import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { CategoryResponseType } from '@/api/types/response'
import { Icon } from '../ui/icon'
import { CheckIcon, Edit2Icon, HeartIcon, Trash2Icon } from 'lucide-react-native'
import { Checkbox, CheckboxIcon, CheckboxIndicator } from '../ui/checkbox'
type CategoryCardPropsType = {
  data: CategoryResponseType,
  onPress: () => void,
  deleteFn: () => void,
  updateFn: () => void,
  selectable?: boolean,
  canPressToSelect?: boolean,
  isSelect?: boolean,
  setIsSelect?: Function
}
export default function CategoryCard({
  data, onPress, deleteFn, updateFn, selectable = true, isSelect = false, setIsSelect, canPressToSelect = false
}: CategoryCardPropsType) {

  const [cannotDelete, setCannotDelete] = useState<boolean>(false)

  return (
    <View className='relative'>
      <TouchableOpacity
        className='flex flex-row gap-4 py-4 px-4 rounded-3xl border border-outline-100 '
        onPress={onPress}
      >
        <Checkbox
          size='lg'
          isChecked={isSelect}
          onChange={(value: boolean) => {
            setIsSelect && setIsSelect(value)
          }}
          isInvalid={false}
          isDisabled={!selectable}
          value={data.id}>
          <CheckboxIndicator className='rounded-md w-7 h-7' >
            <CheckboxIcon as={CheckIcon} />
          </CheckboxIndicator>
        </Checkbox>
        <View className='grow'>
          <View className='grow flex flex-row justify-between'>
            <Text className='text-sm text-typography-500'>
              {data.parent ? data.parent.name : 'Không có'}
            </Text>
            <Text className='text-typography-400'>Số lượng tài sản: {data.numberOfAssets}</Text>
          </View>
          <Text className='text-lg text-typography-800'>{data.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
