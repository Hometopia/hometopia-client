import { View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Text } from '../ui/text'
import StatusBadge from './StatusBadge'
import { AssetStatusList, AssetStatusListMapToDisplayText } from '@/constants/data_enum'
import { Icon } from '../ui/icon'
import { CheckIcon, QrCodeIcon, Trash2Icon } from 'lucide-react-native'
import { Button, ButtonIcon } from '../ui/button'
import { AssetOnListResponseType, AssetResponseType } from '@/api/types/response'
import { Image } from '../ui/image'
import { getImgUri } from '@/api/FileService'
import QRGenerateButton from './QRButton'
import { Checkbox, CheckboxIcon, CheckboxIndicator } from '../ui/checkbox'
type AssetCardPropsType = {
  data: AssetOnListResponseType,
  onPress: () => void,
  deleteFn: () => void,
  type?: 'grid' | 'list',
  selectable?: boolean,
  canPressToSelect?: boolean,
  isSelect?: boolean,
  setIsSelect?: Function
}
export default function AssetCard({
  data, onPress, deleteFn, type = 'grid', selectable = true, isSelect = false, setIsSelect, canPressToSelect = false
}: AssetCardPropsType) {

  return (
    <View className={type === 'grid' ?
      'relative bg-background-0 w-[48%] self-stretch' :
      'relative bg-background-0 w-full'
    }>
      <TouchableOpacity
        className={type === 'grid' ?
          'flex flex-col items-center gap-4 py-4 px-4 rounded-3xl border border-outline-100'
          :
          'flex flex-row gap-4 py-4 px-4 rounded-3xl border border-outline-100 '
        }
        onPress={() => {
          if (canPressToSelect) {
            setIsSelect && setIsSelect(true)
          }
          else
            onPress()
        }}
      >
        <View className='flex flex-row items-start'>
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
          <View className='grow flex flex-row justify-center'>
            {data.images[0] !== null ?
              <Image
                source={{ uri: getImgUri(data.images[0].fileName) }}
                className='w-20 h-20 rounded-xl bg-background-100'
                alt={`asset-img-${data.id}`}
              /> :
              <View className='w-20 h-20 rounded-xl bg-background-100' />
            }
          </View>
        </View>


        <View className={type === 'grid' ?
          'flex flex-col gap-2 justify-start  w-full'
          :
          'grow flex flex-col gap-2 justify-start'
        }>

          <View className={type === 'grid' ? 'flex flex-col gap-2 items-center' : 'flex flex-row justify-between'}>
            <Text className='text-md font-bold text-typography-800 text-center'>{data.name}</Text>
            <StatusBadge
              size='sm'
              length={AssetStatusList.length}
              index={AssetStatusList.indexOf(data.status)}
              label={AssetStatusListMapToDisplayText[data.status as keyof typeof AssetStatusListMapToDisplayText]}
            />
          </View>
          <View className='flex flex-row gap-2 justify-end'>
            <QRGenerateButton uri={`(_main)/asset/${data.id}`} size='md' name={data.name} />
            <TouchableOpacity className='p-2 rounded-lg border border-error-300' onPress={deleteFn}>
              <Icon as={Trash2Icon} className='text-error-300' size='md' />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}