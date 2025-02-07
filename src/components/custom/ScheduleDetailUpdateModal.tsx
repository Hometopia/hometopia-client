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
import { FileInfoType, VendorType } from '@/api/types/common'
import { useFocusEffect } from 'expo-router'

export default function ScheduleDetailUpdateModal(
  {
    showModal,
    setShowModal,
    data,
    updateFn,
  }: {
    showModal: boolean,
    setShowModal: Function,
    data: ScheduleResponseType,
    updateFn: Function,
  }
) {

  useFocusEffect(
    useCallback(() => {
      if (showModal) {
        dateControl.onChange(dateToYYYYMMDD(new Date(data.start)))
        costControl.onChange(data.cost ? formatNumber(data.cost.toString()) : '')
      }
    }, [data]),
  );

  const titleControl = useFormControl(data.title, (v) => v !== "")
  const dateControl = useFormControl(dateToYYYYMMDD(new Date(data.start)), (v) => v !== "")
  const costControl = useFormControl(data.cost ? formatNumber(data.cost.toString()) : '', (v) => true)

  const validateAll = () => {
    titleControl.validate()
    dateControl.validate()
  }

  const goToNextStep = async () => {
    const validArray = [
      titleControl.isValid,
      dateControl.isValid,
    ]

    for (var i: number = 0; i < validArray.length; i++) {
      if (validArray[i] === false) {
        return
      }
    }

    setShowModal(false)
    updateFn(data.id, {
      title: titleControl.value,
      start: dateToISOString(new Date(dateControl.value)),
      end: dateToISOString(new Date(dateControl.value)),
      vendor: data.vendor,
      cost: Number(deformatNumber(costControl.value)),
      documents: [] as FileInfoType[],
      type: data.type,
      assetId: data.asset.id,
    } as ScheduleType)
  }

  const { handleSubmit } = useFormSubmit(validateAll, goToNextStep)
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
            Chỉnh sửa thông tin
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
          <ControllableInput key={'title'} control={titleControl} label="Tên lịch" errorText='Giờ kết thúc không thể trống hoặc sớm hơn giờ bắt đầu'
            input={
              <Input size="lg" >
                <InputField
                  type='text'
                  value={titleControl.value}
                  onChangeText={titleControl.onChange}
                />
              </Input>
            }

          />
          <ControllableInput key={'date'} control={dateControl} label="Ngày" errorText='Ngày không thể trống'
            input={
              <DatePicker
                value={dateControl.value}
                onChange={dateControl.onChange}
                placeholder='Chọn ngày'
              />
            }
          />
          <ControllableInput key={'cost'} control={costControl} label="Chi phí" errorText=''
            isRequired={false}
            input={
              <Input size="lg">
                <InputField
                  // type="text"
                  inputMode="numeric"
                  placeholder="Nhập chi phí (nếu có)"
                  value={costControl.value}
                  onChangeText={(v) => {
                    const formatValue = formatNumber(v)
                    costControl.onChange(formatValue)
                  }}

                />
                <InputSlot >
                  <Text className='px-4'>₫</Text>
                </InputSlot>
              </Input>
            }
          />

          <Button
            className='rounded-lg'
            size='lg'
            onPress={handleSubmit}
            isDisabled={
              titleControl.value === data.title &&
              dateControl.value === dateToYYYYMMDD(new Date(data.start)) &&
              costControl.value === (data.cost ? formatNumber(data.cost.toString()) : '')
            }
          >
            <ButtonText>Thay đổi</ButtonText>
          </Button>
        </View>
        {/* </ModalBody> */}
      </ModalContent>
    </Modal>
  )
}