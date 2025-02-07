import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Modal, ModalBackdrop, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'
import { CloseIcon, Icon } from '../ui/icon'
import { Input, InputField } from '../ui/input'
import { Button, ButtonText } from '../ui/button'

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
        <Input>
          <InputField
            type='text'
            placeholder='Nhập tên cho vị trí này'
            value={nameInputValue}
            onChangeText={setNameInputValue} />
        </Input>
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
  </Modal>
}