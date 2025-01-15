import { View, Text } from 'react-native'
import React from 'react'

export default function AssetInfoDisplay(
  {
    head,
    data,
    opts,
    extras
  }: {
    head: string,
    data: string | any,
    opts?: 'em' | 'italic',
    extras?: any
  }
) {

  const textValue = () => {
    if (opts) {
      if (opts === 'em') {
        return <Text className="p-0 pb-3 text-lg text-primary-400">{data}</Text>
      }
      else if (opts === 'italic') {
        return <Text className="p-0 pb-3 text-lg text-typography-400 italic">{data}</Text>
      }
    }
    else {
      return <Text className="p-0 pb-3 text-lg text-typography-800">{data}</Text>
    }
  }
  return (
    <View className="border-none mb-4">
      <Text className="p-0 pb-1 text-base font-medium text-typography-400 align-top">{head}:</Text>
      {typeof data === 'string' ?
        textValue()
        :
        <View className='flex flex-row my-2'>{data}</View>
      }
      {extras}
    </View>
  )
}