import { AssetService } from "@/api/AssetService";
import { ScheduleService } from "@/api/ScheduleService";
import { AssetResponseType, ResponseBaseType, ScheduleResponseType } from "@/api/types/response";
import Callout from "@/components/custom/Callout";
import Loading from "@/components/feedback/Loading";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { ScheduleType } from "@/constants/data_enum";
import { currencyFormatter } from "@/helpers/currency";
import { calcDuration, dateToISOString, dateToYYYYMMDD, getTime, YYYYMMDDtoLocalDate } from "@/helpers/time";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ClockIcon, EditIcon, TrashIcon } from "lucide-react-native";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

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
    queryFn: () => ScheduleService.getScheduleHistory(asset_id as string, ScheduleType.MAINTENANCE, new Date())
  })
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
            <Callout what="maintenance" size='mobile' />
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
                <ScrollView horizontal={true} >
                  <View className="rounded-lg overflow-hidden">
                    <View className="flex flex-row w-[900px]">
                      <View className="flex flex-col grow">
                        <View className='px-6 py-4 bg-background-50 h-14'>
                          <Text className="text-md font-bold text-typography-900">
                            Ngày
                          </Text>
                        </View>
                        {historyQuery.data.data.items.map((i: ScheduleResponseType, index: number) =>
                          <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                            <Text className="text-md font-normal text-typography-900">
                              {YYYYMMDDtoLocalDate(dateToYYYYMMDD(new Date(i.start)))}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View className="flex flex-col grow">
                        <View className='px-6 py-4 bg-background-50 h-14'>
                          <Text className="text-md font-bold text-typography-900">
                            Bên cung cấp dịch vụ
                          </Text>
                        </View>
                        {historyQuery.data.data.items.map((i: ScheduleResponseType, index: number) =>
                          <View
                            key={index}
                            className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100 gap-2'
                          >
                            <Text className="text-md font-normal text-typography-900">
                              {i.vendor.name}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View className="flex flex-col grow">
                        <View className='px-6 py-4 bg-background-50 h-14'>
                          <Text className="text-md font-bold text-typography-900">
                            Thời gian bảo trì
                          </Text>
                        </View>
                        {historyQuery.data.data.items.map((i: ScheduleResponseType, index: number) =>
                          <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                            <Text className="text-md font-normal text-typography-900">
                              {getTime(new Date(i.start))} - {getTime(new Date(i.end))}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View className="flex flex-col grow">
                        <View className='px-6 py-4 bg-background-50 h-14'>
                          <Text className="text-md font-bold text-typography-900">
                            Chi phí
                          </Text>
                        </View>
                        {historyQuery.data.data.items.map((i: ScheduleResponseType, index: number) =>
                          <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                            <Text className="text-md font-normal text-typography-900">
                              {currencyFormatter().format(i.cost)}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View className="flex flex-col grow">
                        <View className='px-6 py-4 bg-background-50 h-14'>
                          <Text className="text-md font-bold text-typography-900">
                            Minh chứng
                          </Text>
                        </View>
                        {historyQuery.data.data.items.map((i: ScheduleResponseType, index: number) =>
                          <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                            <Button
                              variant='solid'
                              action='primary'>
                              <ButtonText>
                                Xem
                              </ButtonText>
                            </Button>
                          </View>
                        )}
                      </View>
                      <View className="flex flex-col grow">
                        <View className='px-6 py-4 bg-background-50 h-14'>
                        </View>
                        {historyQuery.data.data.items.map((i: ScheduleResponseType, index: number) =>
                          <View key={index} className='px-6 py-4 h-24 flex flex-row gap-4 items-center border-b border-outline-100'>
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
                        )}
                      </View>
                    </View>
                  </View>
                </ScrollView>
              }
            </View>

          </View>
        </ScrollView>
      }
    </SafeAreaView>
  )
}