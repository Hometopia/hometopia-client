import { AssetService } from "@/api/AssetService";
import { ScheduleService } from "@/api/ScheduleService";
import { ScheduleType as ScheduleRequestType } from "@/api/types/request";
import { AssetResponseType, ResponseBaseType, ScheduleResponseType } from "@/api/types/response";
import Callout from "@/components/custom/Callout";
import { CustomTable, TableCol } from "@/components/custom/CustomTable";
import ScheduleUpdateModal from "@/components/custom/ScheduleUpdateModal";
import Loading from "@/components/feedback/Loading";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { ScheduleType } from "@/constants/data_enum";
import { currencyFormatter } from "@/helpers/currency";
import { calcDuration, dateToISOString, dateToYYYYMMDD, getTime, YYYYMMDDtoLocalDate } from "@/helpers/time";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ClockIcon, EditIcon, TrashIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";
const totalOf = (arr: number[]) => {
  var total = 0
  arr.forEach(i => {
    total += i
  })

  return total
}
const data = (assetData: AssetResponseType, history: ScheduleResponseType[]) => [
  {
    head: 'Số lần bảo trì',
    data: history.length,
  },
  {
    head: 'Tổng tiền đã tiêu để bảo trì sản này',
    data: currencyFormatter().format(totalOf(history.map((i: ScheduleResponseType) => i.cost))),
    editable: true
  },

  {
    head: 'Chu kỳ bảo trì',
    data: assetData.maintenanceCycle !== null ? `${assetData.maintenanceCycle} năm` : 'Không có'
  },
]

export default function AssetMaintenance() {
  const { asset_id } = useLocalSearchParams()
  const queryClient = useQueryClient()

  const [assetQuery, setAssetQuery] = React.useState<ResponseBaseType | undefined>(queryClient.getQueryData(['asset', asset_id]))

  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleResponseType>()

  const historyQuery = useQuery({
    queryKey: ['schedule-history', ScheduleType.MAINTENANCE, asset_id],
    queryFn: () =>
      ScheduleService.getScheduleHistory(
        asset_id as string,
        ScheduleType.MAINTENANCE,
        new Date())
  })
  const upcomingQuery = useQuery({
    queryKey: ['schedule-upcoming', ScheduleType.MAINTENANCE, asset_id],
    queryFn: () =>
      ScheduleService.getUpcomingSchedule(
        asset_id as string,
        ScheduleType.MAINTENANCE,
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
  // const maintenanceQuery = useQuery({
  //   queryKey: ['maintenance-cycle', asset_id],
  //   queryFn: () => 
  // })

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
        data={data.map(i => `${getTime(new Date(i.start))}`)} /> */}
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
    <SafeAreaView className='h-full bg-white'>
      {assetQuery?.data === undefined ?
        <Loading texts={[
          {
            condition: true,
            text: 'Đang tải...'
          }
        ]} />
        :
        <ScrollView className="my-4 px-4" overScrollMode="never">
          <View className="flex flex-col gap-4">
            {upcomingQuery.isPending ?
              <Skeleton className="h-10 w-full" variant='rounded' />
              :
              <Callout what="maintenance" size='mobile' data={upcomingQuery.data.data.items}
                scheduleFn={() => router.push({
                  pathname: `/(_main)/calendar/create-schedule`,
                  params: {
                    asset_id: asset_id,
                    type: ScheduleType.MAINTENANCE
                  }
                })}
                lookFn={() => {
                  router.push({
                    pathname: '/(_main)/calendar/[schedule_details]',
                    params: {
                      schedule_details: upcomingQuery.data.data.items[0].id,
                      data: JSON.stringify(upcomingQuery.data.data.items[0])
                    }
                  })
                }}
              />
            }

            <View className="flex flex-col gap-2">
              {historyQuery.isFetched && data(assetQuery.data, historyQuery.data.data.items).map((i) => (
                <View key={i.head}>
                  <Text className="p-0 pb-1 text-base font-medium text-typography-400 align-top">{i.head}:</Text>
                  <Text className="p-0 text-lg text-typography-900">{i.data}</Text>
                  {/* {i.desc && <Text className="text-base italic text-typography-900">{i.desc}</Text>} */}
                </View>
              ))}
            </View>
            <View className="flex flex-col gap-2">
              <View className="flex flex-row gap-2 items-center">
                <Icon as={ClockIcon} className="h-4 w-4 text-typography-700" />
                <Text className="text-base font-bold text-typography-700">Lịch sử bảo trì</Text>
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

    </SafeAreaView >
  )
}