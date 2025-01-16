import { View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Text } from '../ui/text'
import StatusBadge from './StatusBadge'
import { AssetStatusList, AssetStatusListMapToDisplayText } from '@/constants/data_enum'
import { Icon } from '../ui/icon'
import { QrCodeIcon, Trash2Icon } from 'lucide-react-native'
import { Button, ButtonIcon } from '../ui/button'
import { AssetResponseType } from '@/api/types/response'
import { Image } from '../ui/image'
import { getImgUri } from '@/api/FileService'
type AssetCardPropsType = {
  data: AssetResponseType,
  onPress: () => void,
  deleteFn: () => void
}
export default function AssetCard({
  data, onPress, deleteFn
}: AssetCardPropsType) {
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
    <View className='relative'>
      {longPress && Overlay}
      <TouchableOpacity
        className='flex flex-row gap-4 py-4 px-4 rounded-3xl border border-outline-100 '
        onLongPress={() => { setLongPress(true) }}
        onPress={onPress}
      >
        {data.images[0] !== null ?
          <Image
            source={{ uri: getImgUri(data.images[0].fileName) }}
            className='w-12 h-12 rounded-xl bg-background-100'
            alt={`asset-img-${data.id}`}
          /> :
          <View className='w-12 h-12 rounded-xl bg-background-100' />

        }

        <View className='grow'>
          <View className='grow flex flex-row justify-between '>
            <Text className='text-lg'>{data.name}</Text>
            <StatusBadge
              length={AssetStatusList.length}
              index={AssetStatusList.indexOf(data.status)}
              label={AssetStatusListMapToDisplayText[data.status as keyof typeof AssetStatusListMapToDisplayText]} />
          </View>
          <Text className='text-md text-primary-500/60'>Danh mục: {data.category.name}</Text>
          <Text className='text-md text-typography-400'>{data.description}</Text>
          <View className='grow flex flex-row justify-end'>
            <TouchableOpacity className='p-2 border border-outline-100 rounded-lg'>
              <Icon as={QrCodeIcon} className='w-6 h-6 text-typography-900' />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}