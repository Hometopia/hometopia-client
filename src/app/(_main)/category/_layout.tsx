import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function CategoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'flip',
      }}
    />
  )
}