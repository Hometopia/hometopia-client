import { View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Text } from '../ui/text'
import StatusBadge from './StatusBadge'
import { AssetStatusList, AssetStatusListMapToDisplayText } from '@/constants/data_enum'
import { Icon } from '../ui/icon'
import { QrCodeIcon, Trash2Icon } from 'lucide-react-native'
import { Button, ButtonIcon } from '../ui/button'
import { LocationResponseType } from '@/api/types/response'
import { Image } from '../ui/image'
import { getImgUri } from '@/api/FileService'
type Props = {
  data: LocationResponseType,
  onPress: () => void,
  deleteFn: () => void
}
export default function LocationCard({
  data, onPress, deleteFn
}: Props) {
  const [longPress, setLongPress] = useState<boolean>(false)

  const Overlay = (
    <TouchableOpacity
      className='absolute bg-background-0/70 z-50 top-0 left-0 w-full h-full flex flex-row justify-center items-center'
      onPress={() => setLongPress(false)}
    >
      <TouchableOpacity
        className='p-4 flex justify-center items-center border border-error-400 rounded-md'
        onPress={deleteFn}>
        <Icon as={Trash2Icon} className='text-error-400 w-6 h-6' />
      </TouchableOpacity>
    </TouchableOpacity>
  )
  return (
    <View className='relative bg-background-0 w-[48%]'>
      {longPress && Overlay}
      <TouchableOpacity
        className='flex flex-col items-center gap-4 py-4 px-4 rounded-3xl border border-outline-100'
        onLongPress={() => { setLongPress(true) }}
        onPress={onPress}
      >
        <View className='flex flex-row gap-2 items-center'>
          {data.images !== null && data.images.length != 0 ?
            <Image
              source={{ uri: getImgUri(data.images[0].fileName) }}
              className='w-20 h-20 rounded-xl bg-background-100'
              alt={`asset-img-${data.id}`}
            /> :
            <View className='w-20 h-20 rounded-xl bg-background-100' />
          }
          {/* <View className='flex-1 self-stretch flex flex-col justify-center bg-black'>
            <Text className=' text-md text-typography-800'>{data.name}</Text>
          </View> */}
          <Text className='flex-1 h-20 text-md text-typography-800'>{data.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}