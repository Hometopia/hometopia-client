import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { ChevronLeftIcon, SearchIcon } from 'lucide-react-native'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { router } from 'expo-router'

export default function CreateCategory() {
  const [searchInputValue, setSearchInputValue] = React.useState<string>('')
  return (
    <SafeAreaView className='h-full bg-white'>
      <ScrollView overScrollMode='never'>
        <View className='px-4 pb-4 flex flex-col '>
          <View className="bg-white h-[48px] pt-2 pb-4 flex flex-row justify-between">
            <Button
              variant="outline"
              action="default"
              className="border-outline-200 p-2"
              onPress={() => router.back()}
            >
              <ButtonIcon as={ChevronLeftIcon} className="h-6 w-6 text-typography-700" />
            </Button>
          </View>

          <View className='flex flex-row gap-4 mt-2 mb-4 justify-end'>
            <Button
              variant='outline'
              action='secondary'
              size='lg'
            // onPress={resetForm}
            >
              <ButtonText>Đặt lại</ButtonText>
            </Button>
            <Button
              variant='solid'
              action='primary'
              size='lg'
            // onPress={handleSubmit}
            >
              <ButtonText>Hoàn thành</ButtonText>
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}