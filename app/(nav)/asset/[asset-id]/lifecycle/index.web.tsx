import HistoryLog from '@/components/custom/HistoryLog'
import React from 'react'
import { View } from 'react-native'

const data = 12

export default function AssetLifecycle_Web() {
  return (
    <View className="w-full h-full bg-background-0 flex flex-col pr-6 flex-[1_0_0] overflow-y-scroll">
      {Array.from({ length: data }, (_, index) => (
        <HistoryLog key={index} />
      ))}
    </View>
  )
}
