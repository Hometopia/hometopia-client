import { View, Text } from 'react-native'
import React, { useCallback } from 'react'
import { router, useFocusEffect } from 'expo-router'

export default function MainIndex() {
  useFocusEffect(
    useCallback(() => {
      router.replace('/(_main)/dashboard')
    }, []),
  )
  return null
}