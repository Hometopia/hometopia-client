import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import BackButton from '@/components/custom/BackButton'

export default function CreateSchedule() {
  const { asset_id, type } = useLocalSearchParams()

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView className='pb-2 px-4' overScrollMode='never'>
        <View className="bg-white h-[48px] pt-2 pb-4 flex flex-row justify-between">
          <BackButton backFn={() => router.back()} />
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}