import { View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { ChevronLeftIcon, SearchIcon } from 'lucide-react-native'
import { router, useLocalSearchParams, usePathname } from 'expo-router'
import InputChip from '@/components/custom/InputChip'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'

const data = [
  {
    id: '1',
    name: "Thiết bị phòng ngủ",
  },
  {
    id: '2',
    name: "Thiết bị phòng ngủ",
  },
  {
    id: '3',
    name: "Thiết bị phòng ngủ",
  },
  {
    id: '4',
    name: "Thiết bị phòng ngủ",
  },
  {
    id: '5',
    name: "Thiết bị phòng ngủ",
  },
  {
    id: '6',
    name: "Thiết bị phòng ngủ",
  },
  {
    id: '7',
    name: "Thiết bị phòng ngủ",
  },
  {
    id: '8',
    name: "Thiết bị phòng ngủ",
  },
  {
    id: '42',
    name: "Thiết bị phòng ngủ",
  },
  {
    id: '52',
    name: "Thiết bị phòng ngủ",
  },
  {
    id: '62',
    name: "Thiết bị phòng ngủ",
  }

]

export default function SuggestedCategories() {

  const currentPath = usePathname()
  const { suggested } = useLocalSearchParams()

  const handleChipClose = () => {
    //
  }

  const handleListItemChoosing = (name: string) => {

  }

  const handleSubmit = () => {
    router.replace('/(nav)/categories?state=old')
  }

  const Item = ({ name }: { name: string }) => (
    <TouchableOpacity
      style={{ marginBottom: 8 }}
      className='w-auto px-4 py-2 flex flex-row justify-center border border-outline-100'
      onPress={() => handleListItemChoosing(name)}
    >
      <Text className='text-lg'>{name}</Text>
    </TouchableOpacity>
  )
  return (
    <SafeAreaView className='h-full bg-white'>
      <View className="h-full flex flex-col gap-4 px-4 pb-8">
        <View className="h-[48px] pt-2 pb-4 flex flex-row gap-4 items-center">
          <Button
            variant="outline"
            action="default"
            className="border-outline-200 p-2"
            onPress={() => router.back()}
          >
            <ButtonIcon as={ChevronLeftIcon} className="h-6 w-6 text-typography-700" />
          </Button>
          <Text className='text-md'>Đề xuất cho {suggested}</Text>
        </View>
        <View className='grow flex flex-col gap-4'>
          <Text className='text-md font-semibold'>Danh mục đã chọn</Text>
          <ScrollView style={{ height: 50 }}>
            <View
              style={{ flexWrap: 'wrap' }}
              className='flex flex-row items-start content-start gap-4'>

              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
              <InputChip onClose={handleChipClose} />
            </View>
          </ScrollView>
          <View className='grow flex flex-col gap-2 items-center '>
            {/* <Input
              variant="outline"
              size="lg"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputSlot className="pl-3">
                <InputIcon as={SearchIcon} />
              </InputSlot>
              <InputField placeholder="Tìm kiếm" />
            </Input> */}
            <Text className='text-md font-semibold'>Đề xuất</Text>
            <FlatList
              className='h-40 self-stretch '
              data={data}
              renderItem={({ item }) => <Item name={item.name} />}
              keyExtractor={item => item.id}
            ></FlatList>
            <Button
              className='self-stretch'
              action="primary"
              size="xl"
              onPress={handleSubmit}
            >
              <ButtonText>Hoàn thành</ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}