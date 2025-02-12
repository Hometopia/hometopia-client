import { View, Text } from 'react-native'
import React from 'react'
import { SuggestedScheduleResponseType } from '@/api/types/response'
import { dateToYYYYMMDD } from '@/helpers/time'
import { Button, ButtonText } from '../ui/button'

export default function SuggestedMaintenanceCard({
  data, scheduleFn
}: {
  data: SuggestedScheduleResponseType,
  scheduleFn: Function
}) {
  return (
    <View className='w-60 p-4 rounded-xl border border-outline-100 flex flex-col gap-2'>

      <Text className='text-typography-600 text-sm font-semibold'>
        {dateToYYYYMMDD(new Date(data.start))}
      </Text>
      <Text className='text-typography-800'>{data.title}</Text>
      {data.vendor && <Text className='text-typography-800'>Dịch vụ: {data.vendor.name}</Text>}

    </View>
  )
}