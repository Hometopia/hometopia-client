import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'
import { CloseIcon, Icon } from '../ui/icon'
import { Button, ButtonIcon, ButtonText } from '../ui/button'
import { Image } from '../ui/image'
import { getImgUri } from '@/api/FileService'
import { LocationResponseType } from '@/api/types/response'
import CreateLocationModal from './CreateLocationModal'

export default function LocationUpdateModal(
  {
    showModal,
    setShowModal,
    data,
    pickFn,
    createFn,
  }: {
    showModal: boolean,
    setShowModal: Function,
    data: LocationResponseType[],
    pickFn: Function,
    createFn: Function
  }
) {

  const [createLocationModalShow, setCreateLocationModalShow] = useState(false)

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
            Chọn vị trí hoặc tạo mới
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
          <FlatList
            className='h-[240px]'
            data={data}
            renderItem={({ item }) =>
              <TouchableOpacity
                className='rounded-xl py-4 px-4 border border-outline-100 mb-2 flex flex-row gap-2 items-center'
                key={item.id}
                onPress={() => {
                  setShowModal(false)
                  pickFn(item.id)
                }}
              >
                {item.images !== null ?
                  <Image
                    source={{ uri: getImgUri(item.images[0].fileName) }}
                    className='w-20 h-20 rounded-xl bg-background-100'
                    alt={`asset-img-${item.id}`}
                  /> :
                  <View className='w-20 h-20 rounded-xl bg-background-100' />
                }
                <Text className='text-md'>{item.name}</Text>
              </TouchableOpacity>
            }
          />

          <Text className='self-stretch text-center text-typography-400'>Hoặc</Text>
          <View className='flex flex-col gap-2'>
            <Button className='rounded-lg' onPress={() => setCreateLocationModalShow(true)}>
              <ButtonText>Tạo mới</ButtonText>
            </Button>
            <CreateLocationModal
              showModal={createLocationModalShow}
              setShowModal={(bool: boolean) => {
                setCreateLocationModalShow(bool)
                createFn()
              }}
            />
          </View>
        </View>
        {/* </ModalBody> */}
      </ModalContent>
    </Modal>
  )
}