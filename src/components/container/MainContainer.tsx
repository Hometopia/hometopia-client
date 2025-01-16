import { View, Text, ScrollView } from 'react-native'
import React from 'react'

export default function MainContainer({ children }: { children?: React.ReactNode }) {
  return (
    <ScrollView className='pb-2 px-4' overScrollMode='never'>
      {children}
    </ScrollView>
  )
}