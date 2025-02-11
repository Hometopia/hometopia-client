import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'
import { ChevronDownIcon, ChevronLeftIcon, CloseIcon, Icon } from '../ui/icon'
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '../ui/button'
import { Input, InputField, InputSlot } from '../ui/input'
import useFileUploader from '@/hooks/useFileUploader'
import * as DocumentPicker from 'expo-document-picker'
import { Image } from '../ui/image'
import { Divider } from '../ui/divider'
import ImageAdder from './ImageAdder'
import AddImageTrigger from './AddImageTrigger'
import ControllableInput from './ControllableInput'
import useFormControl from '@/hooks/useFormControl'
import useFormSubmit from '@/hooks/useFormSubmit'
import { useAsyncExec } from '@/hooks/useAsyncExec'
import { FileService } from '@/api/FileService'
import { FileInfoType } from '@/api/types/common'
import { LocationService } from '@/api/LocationService'
import { LocationType, ScheduleType as ScheduleRequestType } from '@/api/types/request'
import { useImageManipulator } from '@/hooks/useImageManipulator'
import { useMutation } from '@tanstack/react-query'
import { set } from 'date-fns'
import DatePicker from './DatePicker'
import { formatNumber } from '@/helpers/currency'
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '../ui/select'
import { ScheduleType, ScheduleTypeName } from '@/constants/data_enum'
import { Menu, MenuItem, MenuItemLabel } from '../ui/menu'
import Loading from '../feedback/Loading'
export default function CreateLifecycleItem(
  {
    showModal,
    setShowModal,
    createFn,
    loading = false,
  }: {
    showModal: boolean,
    setShowModal: Function,
    createFn: Function,
    loading?: boolean
  }
) {
  const typeControl = useFormControl(ScheduleType.MAINTENANCE, (v) => { return v !== '' })
  const nameControl = useFormControl('', (v) => { return v !== '' })
  const dateControl = useFormControl("", (v) => v !== "")
  const costControl = useFormControl("", (v) => true)

  useEffect(() => {
    if (!showModal) {
      typeControl.reset()
      dateControl.reset()
      costControl.reset()
    }
  }, [showModal])
  const validateAll = () => {
    typeControl.validate()
    dateControl.validate()
  }

  const goToNextStep = async () => {
    const validArray = [
      typeControl.isValid,
      dateControl.isValid,
    ]

    for (var i: number = 0; i < validArray.length; i++) {
      if (validArray[i] === false) {
        return
      }
    }

    createFn({
      type: typeControl.value,
      start: dateControl.value + 'T07:00:00',
    } as ScheduleRequestType)
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
      <ModalContent className='rounded-xl'>
        <ModalHeader>
          <Text className="text-typography-900 text-lg font-medium">
            Thêm vào lịch sử vòng đời
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
            <ControllableInput
              control={typeControl}
              label='Loại'
              errorText='Không thể trống'
              input={
                <Menu
                  className='p-2'
                  placement="bottom left"
                  offset={5}
                  trigger={({ ...triggerProps }) => {
                    return (
                      <Button
                        variant="outline"
                        action="default"
                        className="border-outline-200 justify-between rounded-lg"
                        {...triggerProps}

                      >
                        <ButtonText className="text-typography-700 text-lg">
                          {Object.entries(ScheduleTypeName).filter(([key, value]) => key === typeControl.value)[0][1]}
                        </ButtonText>
                        <Icon as={ChevronDownIcon} className="h-5 w-5 text-typography-700" />
                      </Button>
                    );
                  }}
                >
                  {Object.entries(ScheduleTypeName).map(([key, value]) => {
                    return (
                      <MenuItem key={key} textValue={key} onPress={() => typeControl.onChange(key)}>
                        <MenuItemLabel size="lg">{value}</MenuItemLabel>
                      </MenuItem>
                    )
                  })}
                </Menu>

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
              className='rounded-lg mt-4'
              size='lg'
              onPress={handleSubmit}
            // onPress={() => console.log()}
            >
              <ButtonText>Tạo mới</ButtonText>
            </Button>
          </View>
        }

        {/* </ModalBody> */}
      </ModalContent>
    </Modal>

  )
}