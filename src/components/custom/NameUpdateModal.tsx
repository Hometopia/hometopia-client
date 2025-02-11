import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Modal, ModalBackdrop, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'
import { CloseIcon, Icon } from '../ui/icon'
import { Input, InputField } from '../ui/input'
import { Button, ButtonText } from '../ui/button'

const NAME_MAX_LENGTH = 30

export default function NameUpdateModal(
  {
    showModal,
    setShowModal,
    data,
    updateFn,
  }: {
    showModal: boolean,
    setShowModal: Function,
    data: string,
    updateFn: Function,
  }
) {
  const [nameInputValue, setNameInputValue] = useState<string>(data)
  return <Modal
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
          Chỉnh sửa tên
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
        <View className='flex flex-col gap-2 items-end'>
          <Input>
            <InputField
              type='text'
              placeholder='Nhập tên cho vị trí này'
              value={nameInputValue}
              onChangeText={(value: string) => {
                if (value.length > NAME_MAX_LENGTH) return
                setNameInputValue(value)
              }} />
          </Input>
          <Text className={nameInputValue.length < NAME_MAX_LENGTH ? 'text-typography-600' : 'text-error-400'} >
            {nameInputValue.length + ' / ' + NAME_MAX_LENGTH}
          </Text>
        </View>
        <Button
          className='rounded-lg'
          size='lg'
          onPress={() => {
            updateFn(nameInputValue)
            setShowModal(false)
          }}
        >
          <ButtonText>Thay đổi</ButtonText>
        </Button>
      </View>
      {/* </ModalBody> */}
    </ModalContent>
  </Modal >
}