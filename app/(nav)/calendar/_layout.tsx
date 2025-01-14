
import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function AssetLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{ headerShown: false, animation: 'fade', }} />
  )
}