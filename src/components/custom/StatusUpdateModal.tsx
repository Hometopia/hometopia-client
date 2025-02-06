import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'
import { CloseIcon, Icon } from '../ui/icon'
import { Button, ButtonIcon, ButtonText } from '../ui/button'
import { Image } from '../ui/image'
import { getImgUri } from '@/api/FileService'
import { LocationResponseType, ScheduleResponseType } from '@/api/types/response'
import CreateLocationModal from './CreateLocationModal'
import useFormControl from '@/hooks/useFormControl'
import useFormSubmit from '@/hooks/useFormSubmit'
import { Input, InputField, InputSlot } from '../ui/input'
import ControllableInput from './ControllableInput'
import DatePicker from './DatePicker'
import { deformatNumber, formatNumber } from '@/helpers/currency'
import { dateToISOString, dateToYYYYMMDD, YYYYMMDDtoLocalDate } from '@/helpers/time'
import { ScheduleType } from '@/api/types/request'
import { FileInfoType } from '@/api/types/common'
import { useFocusEffect } from 'expo-router'
import { AssetStatusList, AssetStatusListMapToDisplayText } from '@/constants/data_enum'
import Loading from '../feedback/Loading'

export default function StatusUpdateModal(
  {
    showModal,
    setShowModal,
    data,
    updateFn,
    loading = false,
  }: {
    showModal: boolean,
    setShowModal: Function,
    data: string,
    updateFn: Function,
    loading?: boolean,
  }
) {


  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false)
      }}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-typography-900 text-lg font-medium">
            Chỉnh sửa trạng thái
          </Text>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="lg"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        {/* <ModalBody> */}
        {loading ?
          <View className='flex flex-col gap-4 my-4 h-40'>
            <Loading texts={[{ condition: true, text: '' }]} />
          </View>
          :
          <View className='flex flex-col gap-4 my-4'>
            {AssetStatusList.map(i =>
              <TouchableOpacity
                key={i}
                className={data !== i ? 'p-4 rounded-lg bg-background-400/10' : 'p-4 rounded-lg bg-primary-400/10 border border-primary-400'}
                onPress={() => updateFn(i)}
              >
                <Text className={data !== i ? 'text-typography-800' : 'text-primary-400'}>
                  {AssetStatusListMapToDisplayText[i as keyof typeof AssetStatusListMapToDisplayText]}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }

        {/* </ModalBody> */}
      </ModalContent>
    </Modal>
  )
}