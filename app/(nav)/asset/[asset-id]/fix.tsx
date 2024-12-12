import Callout from "@/components/custom/Callout";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ClockIcon, EditIcon, TrashIcon } from "lucide-react-native";
import { SafeAreaView, ScrollView, View } from "react-native";


type infoFieldType = {
  head: string,
  data: string,
  desc?: string,
  editable: boolean,
}
const data: infoFieldType[] = [
  { head: 'Danh mục', data: 'TV', editable: false },
  {
    head: 'Địa chỉ',
    data: 'Trường Đại Học Công Nghệ Thông Tin - Đhqg Tp.hcm, Số 1, Hàn Thuyên, Khu Phố 6, Phường Linh Trung, Thành Phố Thủ Đức, TP. Hồ Chí Minh',
    editable: true
  },
]
const fixsData = [
  {
    date: '20/09/2024',
    service: 'Dienmayxanh',
    time: '2 giờ',
    cost: '1.000.000 VND',
  },
  {
    date: '20/09/2023',
    service: 'Dienmayxanh',
    time: '2 giờ',
    cost: '1.000.000 VND',
  }
]

export default function AssetFix() {
  return (
    <SafeAreaView className='h-full bg-white'>
      <ScrollView className="my-4 px-4">
        <View className="flex flex-col gap-4">
          <Callout what="fix" size='mobile' />
          <View className="flex flex-col gap-2">
            {data.map((i) => {
              if (i.editable)
                return (
                  <View key={i.head} className="flex flex-row gap-2 items-center">
                    <View className="shrink">
                      <Text className="p-0 pb-1 text-base font-medium text-typography-400 align-top">{i.head}:</Text>
                      <Text className="p-0 text-lg text-typography-900">{i.data}</Text>
                      {i.desc && <Text className="text-base italic text-typography-900">{i.desc}</Text>}
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
                  {i.desc && <Text className="text-base italic text-typography-900">{i.desc}</Text>}
                </View>
              )
            })}
          </View>
          <View className="flex flex-col gap-2">
            <View className="flex flex-row gap-2 items-center">
              <Icon as={ClockIcon} className="h-4 w-4 text-typography-700" />
              <Text className="text-base font-bold text-typography-700">Lịch sử sửa chữa</Text>
            </View>
            <ScrollView horizontal={true} >
              <View className="rounded-lg overflow-hidden">
                <View className="flex flex-row w-[900px]">
                  <View className="flex flex-col grow">
                    <View className='px-6 py-4 bg-background-50 h-14'>
                      <Text className="text-md font-bold text-typography-900">
                        Ngày
                      </Text>
                    </View>
                    {fixsData.map((i, index) =>
                      <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                        <Text className="text-md font-normal text-typography-900">
                          {i.date}
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
                    {fixsData.map((i, index) =>
                      <View
                        key={index}
                        className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100 gap-2'
                      >
                        <Text className="text-md font-normal text-typography-900">
                          {i.service}
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
                    {fixsData.map((i, index) =>
                      <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                        <Text className="text-md font-normal text-typography-900">
                          {i.time}
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
                    {fixsData.map((i, index) =>
                      <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                        <Text className="text-md font-normal text-typography-900">
                          {i.cost}
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
                    {fixsData.map((i, index) =>
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
                    {fixsData.map((i, index) =>
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
