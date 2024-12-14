import { View, Text } from 'react-native'
import React from 'react'
import { Button, ButtonIcon } from '../ui/button'
import { XIcon } from 'lucide-react-native'

export default function InputChip(
  {
    text = "InputChip",
    onClose,
  }: {
    text?: string,
    onClose: () => void,
  }
) {
  return (
    <View className=' flex flex-row gap-4 items-center px-4 py-1 rounded-full bg-primary-50'>
      <Text className='text-lg'>{text}</Text>
      <Button variant='link' onPress={onClose}>
        <ButtonIcon as={XIcon} />
      </Button>
    </View>
  )
}