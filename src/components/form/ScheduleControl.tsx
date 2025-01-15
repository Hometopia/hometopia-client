import { View, Text } from 'react-native'
import React from 'react'
import { ScheduleResponseType } from '@/api/types/response'
import useFormControl from '@/hooks/useFormControl'

export default function ScheduleControl(data: ScheduleResponseType) {
  const titleControl = useFormControl(data.title, (value): boolean => {
    return value !== ""
  })
  const startDateControl = useFormControl(data.start, (value): boolean => {
    return value !== ""
  })
  const endDateControl = useFormControl(data.end, (value): boolean => {
    return value !== ""
  })
}