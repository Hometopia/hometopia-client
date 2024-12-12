
import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { FadeIn } from 'react-native-reanimated'

export default function AssetLayout() {
  return (

    <Stack screenOptions={
      {
        headerShown: false,
        animation: 'flip',
      }
    }>

    </Stack>
  )
}