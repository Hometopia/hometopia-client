import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'

export default function BaseScreenContainer({ children }: { children?: React.ReactNode }) {
  return (
    <SafeAreaView className='h-full bg-background-0 relative'>
      {children}
    </SafeAreaView>
  )
}