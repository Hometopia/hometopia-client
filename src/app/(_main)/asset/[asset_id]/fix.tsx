import { ScheduleService } from "@/api/ScheduleService";
import { AssetResponseType, ResponseBaseType, ScheduleResponseType, UserProfileResponseType } from "@/api/types/response";
import Callout from "@/components/custom/Callout";
import { CustomTable, TableCol } from "@/components/custom/CustomTable";
import Loading from "@/components/feedback/Loading";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { ScheduleType } from "@/constants/data_enum";
import { ScheduleType as ScheduleRequestType } from "@/api/types/request";
import { parseAdress } from "@/helpers/address";
import { currencyFormatter } from "@/helpers/currency";
import { dateToYYYYMMDD, getTime, YYYYMMDDtoLocalDate } from "@/helpers/time";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Href, router, useLocalSearchParams } from "expo-router";
import { ClockIcon, EditIcon, TrashIcon } from "lucide-react-native";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import ScheduleUpdateModal from "@/components/custom/ScheduleUpdateModal";
import BaseScreenContainer from "@/components/container/BaseScreenContainer";


type infoFieldType = {
  head: string,
  data: string,
  desc?: string,
  editable: boolean,
}
const totalOf = (arr: number[]) => {
  var total = 0
  arr.forEach(i => {
    total += i
  })

  return total
}
const data = (data: ScheduleResponseType[]) => [
  {
    head: 'Số lần sửa chữa',
    data: data.length,
  },
  {
    head: 'Tổng tiền đã tiêu để sửa tài sản này',
    data: currencyFormatter().format(totalOf(data.map((i: ScheduleResponseType) => i.cost))),
    editable: true
  },
]

export default function AssetFix() {
  const { asset_id } = useLocalSearchParams()
  const queryClient = useQueryClient()
  const [assetQuery, setAssetQuery] = React.useState<ResponseBaseType | undefined>(queryClient.getQueryData(['asset', asset_id]))

  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleResponseType>()

  const historyQuery = useQuery({
    queryKey: ['schedule-history', ScheduleType.REPAIR, asset_id],
    queryFn: () =>
      ScheduleService.getScheduleHistory(
        asset_id as string,
        ScheduleType.REPAIR,
        new Date())
  })
  const upcomingQuery = useQuery({
    queryKey: ['schedule-upcoming', ScheduleType.REPAIR, asset_id],
    queryFn: () =>
      ScheduleService.getUpcomingSchedule(
        asset_id as string,
        ScheduleType.REPAIR,
        new Date()
      )
  })
  const scheduleUpdateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: ScheduleRequestType }) => ScheduleService.updateSchedule(id, data),
    onSuccess: (res) => {
      historyQuery.refetch()
    }
  })
  const scheduleDeleteMutation = useMutation({
    mutationFn: (id: string) => ScheduleService.deleteSchedule(id),
    onSuccess: (res) => {
      historyQuery.refetch()
    }
  })
  const userProfile: ResponseBaseType | undefined = queryClient.getQueryData(['user'])

  const EmptyTable = ({ heads }: { heads: string[] }) => (
    <CustomTable width={900}>
      {heads.map(i => <TableCol key={i} head={i} type='text' data={[]} />)}
    </CustomTable>
  )
  const HistoryTable = ({ data }: { data: ScheduleResponseType[] }) => (
    <CustomTable width={900}>
      <TableCol head="Ngày" type='text'
        data={data.map(i => YYYYMMDDtoLocalDate(dateToYYYYMMDD(new Date(i.start))))} />
      <TableCol head="Bên cung cấp dịch vụ" type='text'
        data={data.map(i => i.vendor ? i.vendor.name : '')} />
      {/* <TableCol head="Thời gian bảo trì" type='text'
        data={data.map(i => `${getTime(new Date(i.start))} - ${getTime(new Date(i.end))}`)} /> */}
      <TableCol head="Chi phí" type='text'
        data={data.map(i => currencyFormatter().format(i.cost))} />
      {/* <TableCol head="Minh chứng" type='element'
        data={data.map(i => (
          <Button key={i.id} variant='solid' action='primary'>
            <ButtonText>Xem</ButtonText>
          </Button>
        ))} /> */}
      <TableCol head="" type='element'
        data={data.map(i => (
          <View key={i.id} className="flex flex-row gap-4">
            <Button
              onPress={() => {
                setCurrentSchedule(i)
                setShowUpdateModal(true)
              }}
              className="px-3 rounded-xl"
              variant='outline'
              action='primary'>
              <ButtonIcon as={EditIcon} className="text-primary-400" />
            </Button>
            <Button
              onPress={() => {
                // scheduleDeleteMutation.mutate(i.id)
              }}
              className="px-3 rounded-xl"
              variant='outline'
              action='negative'>
              <ButtonIcon as={TrashIcon} className="text-error-400">
              </ButtonIcon>
            </Button>
          </View>
        ))} />
    </CustomTable>
  )
  return (
    <BaseScreenContainer>
      {assetQuery?.data === undefined ?
        <Loading texts={[
          {
            condition: true,
            text: 'Đang tải...'
          },
        ]} />
        :
        <ScrollView className="my-4 px-4" overScrollMode="never">
          <View className="flex flex-col gap-4">
            {upcomingQuery.isPending ?
              <Skeleton className="h-10 w-full" variant='rounded' />
              :
              <Callout what="fix" size='mobile' data={upcomingQuery.data.data.items}
                scheduleFn={() => router.push({
                  pathname: `/(_main)/calendar/create-schedule`,
                  params: {
                    asset_id: asset_id,
                    type: ScheduleType.REPAIR
                  }
                })}
                lookFn={() => {
                  router.push({
                    pathname: `/(_main)/calendar/${upcomingQuery.data.data.items[0].id}`,
                    params: {
                      data: JSON.stringify(upcomingQuery.data.data.items[0]),
                      from: 'asset'
                    }
                  })
                }}
                cancelFn={() => {
                  scheduleDeleteMutation.mutate(upcomingQuery.data.data.items[0].id)
                }}
              />
            }

            <View className="flex flex-col gap-2">
              {historyQuery.isFetched &&
                data(historyQuery.data.data.items).map((i) => {
                  return (
                    <View key={i.head}>
                      <Text className="p-0 pb-1 text-base font-medium text-typography-400 align-top">{i.head}:</Text>
                      <Text className="p-0 text-lg text-typography-900">{i.data}</Text>
                    </View>
                  )
                })}
            </View>
            <View className="flex flex-col gap-2">
              <View className="flex flex-row gap-2 items-center">
                <Icon as={ClockIcon} className="h-4 w-4 text-typography-700" />
                <Text className="text-base font-bold text-typography-700">Lịch sử sửa chữa</Text>
              </View>
              {historyQuery.isPending ?
                <Loading
                  texts={[{
                    condition: true,
                    text: 'Đang tải...'
                  }]} />
                :
                historyQuery.data === 'error' ?
                  <EmptyTable heads={[
                    "Ngày",
                    "Bên cung cấp dịch vụ",
                    "Thời gian bảo trì",
                    "Chi phí",
                    "Minh chứng",
                    ""
                  ]} />
                  :
                  <HistoryTable data={historyQuery.data.data.items} />
              }
            </View>
          </View>
        </ScrollView>
      }
      {currentSchedule ?
        <ScheduleUpdateModal
          showModal={showUpdateModal}
          setShowModal={setShowUpdateModal}
          data={currentSchedule as ScheduleResponseType}
          updateFn={(id: string, data: ScheduleRequestType) => {
            scheduleUpdateMutation.mutate({ id, data })
          }}
        />
        : null
      }
    </BaseScreenContainer>
  )
}
