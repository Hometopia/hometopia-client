import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'
import { CloseIcon, Icon } from '../ui/icon'
import { Button, ButtonIcon, ButtonText } from '../ui/button'
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
import HouseClassifiModal from './HouseClassifiModal'
import { HouseType, HouseTypeName } from '@/constants/data_enum'

export default function SuggestedCategoriesModal(
  {
    showModal,
    setShowModal,
    pickFn,
  }: {
    showModal: boolean,
    setShowModal: Function,
    pickFn: Function,
  }
) {

  const [showRefModal, setRefShowModal] = useState(false)
  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false)
      }}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent className='rounded-xl'>
        <ModalHeader>
          <Text className="text-typography-900 text-lg font-medium">
            Chọn quy mô căn nhà của bạn
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
        <View className='flex flex-col gap-4 my-4'>
          <View className="flex flex-row gap-0 items-center justify-center">
            <Text className="text-lg text-typography-600">Xem tham khảo </Text>
            <Button
              variant="link"
              action="primary"
              onPress={() => setRefShowModal(true)}
            >
              <ButtonText className="text-lg text-primary-400">ở đây</ButtonText>
            </Button>
            <HouseClassifiModal showModal={showRefModal} setShowModal={setRefShowModal} />
          </View>
          <View className="flex flex-col gap-4 self-stretch">
            {HouseType.map((i: string, index) => (
              <TouchableOpacity
                key={index}
                className="rounded-xl bg-background-50 p-4 flex flex-row justify-center"
                onPress={() => {
                  pickFn(i)
                  setShowModal(false)
                }}
              >
                <Text className="text-lg text-typography-800">{HouseTypeName[`${i}` as keyof typeof HouseTypeName]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* </ModalBody> */}
      </ModalContent>
    </Modal>
  )
}