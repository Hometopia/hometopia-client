import { AssetService } from "@/api/AssetService";
import { ScheduleService } from "@/api/ScheduleService";
import { AssetResponseType, ResponseBaseType, ScheduleResponseType } from "@/api/types/response";
import Callout from "@/components/custom/Callout";
import { CustomTable, TableCol } from "@/components/custom/CustomTable";
import Loading from "@/components/feedback/Loading";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { ScheduleType } from "@/constants/data_enum";
import { currencyFormatter } from "@/helpers/currency";
import { calcDuration, dateToISOString, dateToYYYYMMDD, getTime, YYYYMMDDtoLocalDate } from "@/helpers/time";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ClockIcon, EditIcon, TrashIcon } from "lucide-react-native";
import React from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";

const data = (assetData: AssetResponseType) => [
  {
    head: 'Danh mục',
    data: `${assetData.category.parent.name} > ${assetData.category.name}`
  },
  {
    head: 'Chu kỳ bảo trì',
    data: assetData.maintenanceCycle !== null ? `${assetData.maintenanceCycle} năm` : 'Không có'
  },
  // {
  //   head: 'Thời gian còn lại',
  //   data: assetData.maintenanceCycle !== null ? `${assetData.maintenanceCycle} tháng` : 'Không có',
  //   desc: "Thời gian còn lại cho đến lần bảo trì tiếp theo."
  // },
]

export default function AssetMaintenance() {
  const { asset_id } = useLocalSearchParams()
  const queryClient = useQueryClient()

  const [assetQuery, setAssetQuery] = React.useState<ResponseBaseType | undefined>(queryClient.getQueryData(['asset', asset_id]))

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
        data={data.map(i => i.vendor.name)} />
      <TableCol head="Thời gian bảo trì" type='text'
        data={data.map(i => `${getTime(new Date(i.start))} - ${getTime(new Date(i.end))}`)} />
      <TableCol head="Chi phí" type='text'
        data={data.map(i => currencyFormatter().format(i.cost))} />
      <TableCol head="Minh chứng" type='element'
        data={data.map(i => (
          <Button key={i.id} variant='solid' action='primary'>
            <ButtonText>Xem</ButtonText>
          </Button>
        ))} />
      <TableCol head="]" type='element'
        data={data.map(i => (
          <View key={i.id} className="flex flex-row gap-4">
            <Button
              className="px-3"
              variant='outline'
              action='primary'>
              <ButtonIcon as={EditIcon} className="text-primary-400" />
            </Button>
            <Button
              className="px-3"
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
        <ScrollView className="my-4 px-4">
          <View className="flex flex-col gap-4">
            {upcomingQuery.isPending ?
              <Skeleton className="h-10 w-full" variant='rounded' />
              :
              <Callout what="maintenance" size='mobile' data={upcomingQuery.data.data.items}
                scheduleFn={() => router.push({
                  pathname: `/(nav)/calendar/create-schedule`,
                  params: {
                    asset_id: asset_id,
                    type: ScheduleType.MAINTENANCE
                  }
                })}
                lookFn={() => {
                  router.push({
                    pathname: '/(nav)/calendar/[schedule_details]',
                    params: {
                      schedule_details: upcomingQuery.data.data.items[0].id,
                      data: JSON.stringify(upcomingQuery.data.data.items[0])
                    }
                  })
                }}
              />
            }

            <View className="flex flex-col gap-2">
              {data(assetQuery.data).map((i) => (
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
    </SafeAreaView >
  )
}