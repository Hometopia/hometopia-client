import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import React from 'react'
import { Spinner } from '../ui/spinner'
type LoadingProps = {
  texts: {
    condition: boolean,
    text: string
  }[]
}
export default function Loading({
  texts
}: LoadingProps) {
  return (
    <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }} className='absolute z-50 top-0 left-0 w-full h-full flex justify-center items-center'>
      <Spinner size="large" className="text-primary-400" />
      <Text className='text-typography-800 text-md'>
        {texts.map(i => i.condition && i.text)}
      </Text>
    </View>
  )
}