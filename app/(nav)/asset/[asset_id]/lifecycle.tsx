import HistoryLog from '@/components/custom/HistoryLog'
import { Text } from '@/components/ui/text'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { AssetLifecycleType, ResponseBaseType } from '@/api/types/response';
import { Spinner } from '@/components/ui/spinner';
import { AssetService } from '@/api/AssetService';

const data = 3
const backupData = {
  time: '20/09/2024 07:32 PM',
  msg: 'Đây là message'
}
export default function AssetLifecycle() {
  const { asset_id } = useLocalSearchParams()
  const queryClient = useQueryClient()
  const [assetQuery, setAssetQuery] = React.useState<ResponseBaseType | undefined>(queryClient.getQueryData(['asset', asset_id]))
  const lifecycleQuery = useQuery({
    queryKey: ['asset-life-cycle', asset_id],
    queryFn: () => AssetService.getAssetLifecycle(asset_id as string),
  })
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
        <ScrollView className="flex flex-col my-4 px-4 gap-4">
          {lifecycleQuery.data.items.reverse().map((i: AssetLifecycleType, index: number) => (
            <HistoryLog
              key={index}
              createdAt={new Date(i.createdAt)}
              description={i.description}
            />
          )
          )}
        </ScrollView>
      }

    </SafeAreaView>
  )
}
