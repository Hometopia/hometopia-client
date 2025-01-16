import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'flip',
      }}
    />
  )
}