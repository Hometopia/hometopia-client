import HistoryLog from '@/components/custom/HistoryLog'
import { Text } from '@/components/ui/text'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { AssetLifecycleType, ResponseBaseType } from '@/api/types/response';
import { Spinner } from '@/components/ui/spinner';
import { AssetService } from '@/api/AssetService';
import { ClassificationService } from '@/api/ClassificationService';
import { RuleService } from '@/api/RuleService';
import { Icon } from '@/components/ui/icon';
import { PlusIcon, SproutIcon } from 'lucide-react-native';
import { Menu, MenuItem } from '@/components/ui/menu';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import CreateLifecycleItem from '@/components/custom/CreateLifecycleItem';
import { ScheduleService } from '@/api/ScheduleService';
import { ScheduleType as ScheduleRequestType } from '@/api/types/request';
import { FileInfoType } from '@/api/types/common';
import { useToast } from '@/components/ui/toast';
import CommonToast from '@/components/feedback/CommonToast';

export default function AssetLifecycle() {
  const { asset_id } = useLocalSearchParams()
  const queryClient = useQueryClient()
  const [assetQuery, setAssetQuery] = React.useState<ResponseBaseType | undefined>(queryClient.getQueryData(['asset', asset_id]))
  const [createItemShowModal, setCreateItemShowModal] = React.useState(false)

  //#region feedback
  const toast = useToast()
  const successToast = CommonToast({
    toast: toast,
    title: "Thêm thành công",
    description: "",
    variant: "success"
  })
  const errorToast = CommonToast({
    toast: toast,
    title: "Thêm thất bại",
    description: "",
    variant: "error"
  })

  const lifecycleQuery = useQuery({
    queryKey: ['asset-life-cycle', asset_id],
    queryFn: () => AssetService.getAssetLifecycle(asset_id as string),
  })
  const predictCategoryQuery = useQuery({
    queryKey: ['predict-category', assetQuery?.data?.images[0].fileName],
    queryFn: async () => {
      const res = await ClassificationService.getPredictCategoryByImg(assetQuery?.data?.images[0].fileName as string)
      if (!res.prediction)
        return {
          prediction: ''
        }
      return {
        prediction: res.prediction
      }
    },
    enabled: !!assetQuery?.data
  })

  const usefulLifeQuery = useQuery({
    queryKey: ['useful-life', asset_id],
    queryFn: async () => {
      if (predictCategoryQuery.data?.prediction === '')
        return { usefulLife: 3 }
      return await RuleService.getUsefulLife(predictCategoryQuery.data?.prediction)
    },
    enabled: predictCategoryQuery.isFetched
  })

  const createScheduleMutation = useMutation({
    mutationFn: (data: ScheduleRequestType) => ScheduleService.createSchedule(data),
    onSuccess: (res) => {
      setCreateItemShowModal(false)
      successToast.handleToast()
      lifecycleQuery.refetch()
    }
  })
  const ActionFab = () => (
    <Fab
      className='bg-primary-400 '
      size="lg"
      placement="bottom right"
      onPress={() => setCreateItemShowModal(true)}
    >
      <FabLabel >Thêm</FabLabel>
      <FabIcon as={PlusIcon} />
    </Fab>

  )
  return (
    <SafeAreaView className='h-full bg-white'>
      {lifecycleQuery.isPending ?
        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }} className='absolute z-50 top-0 left-0 w-full h-full flex justify-center items-center'>
          <Spinner size="large" className="text-primary-400" />
          <Text className='text-typography-800 text-md'>
            {lifecycleQuery.isPending && 'Đang tải thông tin'}
          </Text>
        </View>
        :
        <ScrollView className="my-4 px-4">
          <View className='px-4 py-4 bg-success-400/10 rounded-xl flex flex-row items-center gap-4 mb-4'>
            <View className='flex justify-center items-center p-2 bg-success-400/10 rounded-full'>
              <Icon as={SproutIcon} className='h-6 w-6 text-success-400' />
            </View>
            <View className='flex flex-col gap-0'>
              <Text className='text-md text-typography-800'>
                Thời gian sống của {assetQuery?.data && assetQuery?.data.name} :
              </Text>
              <Text className='text-lg text-success-400'>
                {usefulLifeQuery.isFetched && usefulLifeQuery.data !== undefined && usefulLifeQuery.data.usefulLife} năm
              </Text>
            </View>
          </View>
          {lifecycleQuery.data.items.map((i: AssetLifecycleType, index: number) => (
            <HistoryLog
              key={index}
              createdAt={new Date(i.timestamp)}
              description={i.description}
            />
          )
          ).reverse()}
        </ScrollView>
      }
      <ActionFab />
      <CreateLifecycleItem
        showModal={createItemShowModal}
        setShowModal={setCreateItemShowModal}
        createFn={(data: ScheduleRequestType) => {
          createScheduleMutation.mutate({
            title: 'Blank',
            start: data.start,
            end: data.start,
            type: data.type,
            assetId: asset_id,
            documents: [] as FileInfoType[],
            vendor: null,
          } as ScheduleRequestType)
        }}
        loading={createScheduleMutation.isPending}
      />
    </SafeAreaView>
  )
}
