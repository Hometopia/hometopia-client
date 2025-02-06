import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'
import { ChevronLeftIcon, CloseIcon, Icon } from '../ui/icon'
import { CategoryResponseType } from '@/api/types/response'
import { Button, ButtonIcon, ButtonText } from '../ui/button'
import ControllableInput from './ControllableInput'
import { Input, InputField } from '../ui/input'
import { Textarea, TextareaInput } from '../ui/textarea'
import { Select } from './Select'
import { SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectPortal, SelectTrigger } from '../ui/select'
import useFormControl from '@/hooks/useFormControl'

export default function CategoryUpdateModal(
  {
    showModal,
    setShowModal,
    data,
    updateFn,
  }: {
    showModal: boolean,
    setShowModal: Function,
    data: CategoryResponseType,
    updateFn: Function
  }
) {

  const [parentList, setParentList] = useState<CategoryResponseType[] | undefined>(undefined)
  const [children, setChildren] = useState<CategoryResponseType[] | undefined>(undefined)

  const nameControl = useFormControl(data.name, (v): boolean => {
    return v !== ""
  })

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
            Sửa danh mục
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
        <View className='px-4 pb-4 flex flex-col '>
          <View className='flex flex-col gap-2'>
            <ControllableInput control={nameControl} label="Tên danh mục" errorText='Tên danh mục không được để trống'
              input={
                <Input
                  className="text-center"
                  size="lg">
                  <InputField
                    type="text"
                    placeholder="Nhập tên danh mục"
                    value={nameControl.value}
                    onChangeText={nameControl.onChange} />
                </Input>}
            />

          </View>

          <View className='flex flex-row gap-4 mt-4 mb-4 justify-end'>
            <Button
              variant='solid'
              action='primary'
              size='lg'
              onPress={() => updateFn()}
            >
              <ButtonText>Hoàn thành</ButtonText>
            </Button>
          </View>
        </View>


        {/* </ModalBody> */}
      </ModalContent>
    </Modal>
  )
}