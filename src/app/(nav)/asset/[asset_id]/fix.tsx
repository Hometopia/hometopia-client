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
import { parseAdress } from "@/helpers/address";
import { currencyFormatter } from "@/helpers/currency";
import { dateToYYYYMMDD, getTime, YYYYMMDDtoLocalDate } from "@/helpers/time";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ClockIcon, EditIcon, TrashIcon } from "lucide-react-native";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";


type infoFieldType = {
  head: string,
  data: string,
  desc?: string,
  editable: boolean,
}
const data = (assetData: AssetResponseType, user: UserProfileResponseType) => [
  {
    head: 'Danh mục',
    data: `${assetData.category.parent.name} > ${assetData.category.name}`,
  },
  {
    head: 'Địa chỉ',
    data: parseAdress(user.address),
    editable: true
  },
]

export default function AssetFix() {
  const { asset_id } = useLocalSearchParams()
  const queryClient = useQueryClient()
  const [assetQuery, setAssetQuery] = React.useState<ResponseBaseType | undefined>(queryClient.getQueryData(['asset', asset_id]))
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
      {assetQuery?.data === undefined || userProfile?.data === undefined ?
        <Loading texts={[
          {
            condition: true,
            text: 'Đang tải...'
          },
        ]} />
        :
        <ScrollView className="my-4 px-4">
          <View className="flex flex-col gap-4">
            {upcomingQuery.isPending ?
              <Skeleton className="h-10 w-full" variant='rounded' />
              :
              <Callout what="fix" size='mobile' data={upcomingQuery.data.data.items}
                scheduleFn={() => router.push({
                  pathname: `/(nav)/calendar/create-schedule`,
                  params: {
                    asset_id: asset_id,
                    type: ScheduleType.REPAIR
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
              {data(assetQuery.data, userProfile.data).map((i) => {
                if (i.editable)
                  return (
                    <View key={i.head} className="flex flex-row gap-2 items-center">
                      <View className="shrink">
                        <Text className="p-0 pb-1 text-base font-medium text-typography-400 align-top">{i.head}:</Text>
                        <Text className="p-0 text-lg text-typography-900">{i.data}</Text>
                      </View>
                      <Button
                        className="px-3"
                        variant="outline"
                        action="primary"
                      >
                        <ButtonIcon as={EditIcon} className="text-primary-400" />
                      </Button>
                    </View>
                  )
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
    </SafeAreaView>
  )
}
