import { View, Text } from 'react-native'
import React from 'react'
import { LucideIcon } from 'lucide-react-native'
import { Icon } from '../ui/icon'
import { Button, ButtonText } from '../ui/button'

export default function EditableDataDisplay(
  {
    icon,
    label,
    data,
    onEdit,
  }: {
    icon: LucideIcon,
    label: string,
    data: string,
    onEdit: () => void
  }
) {
  return (
    <View className='bg-background-50 rounded-xl px-4 py-3 flex flex-col items-end gap-4'>
      <View className='flex flex-row gap-2 self-stretch justify-start'>
        <Icon as={icon} className='text-primary-400' />
        <Text className='text-primary-400 text-md font-semibold'>{label}</Text>
      </View>
      <Text className='text-lg text-typography-800'>{data}</Text>
      <Button variant='solid' action='primary'>
        <ButtonText>Chỉnh sửa</ButtonText>
      </Button>
    </View>
  )
}