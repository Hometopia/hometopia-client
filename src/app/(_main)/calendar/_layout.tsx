import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { ScheduleService } from '@/api/ScheduleService'

export default function CalendarLayout() {
  const scheduleListQuery = useQuery({
    queryKey: ['schedule-list'],
    queryFn: () => ScheduleService.getListSchedule()
  })
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'flip',
      }}
    />
  )
}