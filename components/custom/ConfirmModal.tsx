import { View } from 'react-native'
import React, { useState } from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '../ui/modal'
import { Text } from '../ui/text'
import { CloseIcon, Icon } from '../ui/icon'
import { Button, ButtonText } from '../ui/button'

export default function ConfirmModal({
  title = "Xác nhận",
  desc,
  confirmFn
}: {
  title: string,
  desc: string,
  confirmFn: () => void
}) {
  const [showModal, setShowModal] = useState(false)
  const modal = () => (
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
          <Text size="xl" className="text-typography-800">
            {title}
          </Text>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text size="lg" className="text-typography-500">
            {desc}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={() => {
              setShowModal(false)
            }}
          >
            <ButtonText>Hủy bỏ</ButtonText>
          </Button>
          <Button
            onPress={() => {
              setShowModal(false)
              confirmFn()
            }}
          >
            <ButtonText>Xác nhận</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
  return {
    setShowModal,
    modal,
  }
}