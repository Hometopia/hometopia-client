import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { AddIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { EditIcon, TrashIcon } from "lucide-react-native";
import { SafeAreaView, ScrollView, View } from "react-native";

const symptomsData = [
  {
    date: '20/09/2024',
    symptom: 'Bể màn hình'
  },
  {
    date: '20/09/2024',
    symptom: 'Hỏng main'
  },
]
export default function AssetFailureSymptom() {
  return (
    <SafeAreaView className='h-full bg-white'>
      <ScrollView className="my-4 px-4">
        <View className="flex flex-col gap-4">
          <Button
            variant="solid"
            action="primary"
          >
            <ButtonIcon as={AddIcon} />
            <ButtonText>Báo cáo triệu chứng</ButtonText>
          </Button>
          <View className="flex flex-col gap-2">
            <View className="flex flex-row gap-2 items-center">
              <Text className="text-base font-bold text-typography-700">Lịch sử báo cáo</Text>
            </View>
            <ScrollView horizontal={true} >
              <View className="rounded-lg overflow-hidden">
                <View className="flex flex-row w-[400px]">
                  <View className="flex flex-col grow">
                    <View className='px-6 py-4 bg-background-50 h-14'>
                      <Text className="text-md font-bold text-typography-900">
                        Ngày báo cáo
                      </Text>
                    </View>
                    {symptomsData.map((i, index) =>
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
                        Triệu chứng
                      </Text>
                    </View>
                    {symptomsData.map((i, index) =>
                      <View
                        key={index}
                        className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100 gap-2'
                      >
                        <Text className="text-md font-normal text-typography-900">
                          {i.symptom}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="flex flex-col grow">
                    <View className='px-6 py-4 bg-background-50 h-14'>
                    </View>
                    {symptomsData.map((i, index) =>
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
