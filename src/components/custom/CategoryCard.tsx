import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { CategoryResponseType } from '@/api/types/response'
import { Icon } from '../ui/icon'
import { Edit2Icon, HeartIcon, Trash2Icon } from 'lucide-react-native'
type CategoryCardPropsType = {
  data: CategoryResponseType,
  onPress: () => void,
  deleteFn: () => void,
  updateFn: () => void
}
export default function CategoryCard({
  data, onPress, deleteFn, updateFn
}: CategoryCardPropsType) {
  const [longPress, setLongPress] = useState<boolean>(false)
  const [fav, setFav] = useState<boolean>(false)

  const [cannotDelete, setCannotDelete] = useState<boolean>(false)
  const Overlay = (
    <TouchableOpacity
      className='absolute bg-background-0/70 z-50 top-0 left-0 w-full h-full flex flex-row gap-2 justify-center items-center'
      onPress={() => setLongPress(false)}
    >
      <TouchableOpacity
        className='p-4 flex justify-center items-center border border-info-400 rounded-md'
        onPress={updateFn}>
        <Icon as={Edit2Icon} className='text-info-400 w-6 h-6' />
      </TouchableOpacity>
      {cannotDelete ?
        <Text className='text-error-400'>Không thể xóa</Text>
        :
        <TouchableOpacity
          className='p-4 flex justify-center items-center border border-error-400 rounded-md'
          onPress={() => {
            if (data.numberOfAssets > 0) {
              setCannotDelete(true)
            }
            else
              deleteFn()
          }}>
          <Icon as={Trash2Icon} className='text-error-400 w-6 h-6' />
        </TouchableOpacity>
      }
    </TouchableOpacity>
  )

  const FavouriteButton = () => (
    <TouchableOpacity className='p-2' onPress={() => setFav(!fav)}>
      <HeartIcon className='w-5 h-5' color={`#D4003F`} fill={fav ? `#D4003F` : `rgba(0,0,0,0.0)`} />
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
        <View className='grow'>
          <View className='grow flex flex-row justify-between'>
            <Text className='text-md text-typography-600'>{data.parent.name}</Text>
            <Text className='text-typography-400'>Số lượng tài sản: {data.numberOfAssets}</Text>
          </View>
          <Text className='text-lg'>{data.name}</Text>
          <Text className='text-md text-typography-400'>{data.description}</Text>
          <View className='grow flex flex-row justify-end'>
            <FavouriteButton />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}
