import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'
import { CloseIcon, Icon } from '../ui/icon'
import { CameraIcon, Library } from 'lucide-react-native'
import Camera from './Camera'
import useFileUploader from '@/hooks/useFileUploader'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
export default function ImageAdder(
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

  const FileUploader = useFileUploader()
  const [triggerCamra, setTriggerCamera] = useState(false)
  const CameraModal =
    <Modal
      isOpen={triggerCamra}
      onClose={() => {
        setTriggerCamera(false)
      }}
      size="lg"
    >
      <ModalBackdrop />
      <ModalContent className='h-[480px] w-[360px] rounded-xl'>
        <Camera takeAPicture={async (uri: string) => {
          const info: FileSystem.FileInfo = await FileSystem.getInfoAsync(uri)
          // console.log(info)
          pickFn({
            name: uri.split('/').pop(),
            uri: uri,
            mimeType: `image/${uri.split('/').pop()?.split('.').pop()}`,
            size: info.exists ? info.size : 0
          } as DocumentPicker.DocumentPickerAsset)
          setTriggerCamera(false)
          setShowModal(false)
        }} />
      </ModalContent>
    </Modal>


  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false)
      }}
      size="lg"
      className=''
    >
      <ModalBackdrop />
      <ModalContent className='rounded-xl'>
        <ModalHeader>
          <Text className="text-typography-900 text-lg font-medium text-center">
            Chọn phương thức
          </Text>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="lg"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody className='mt-4'>
          <View className='flex flex-row gap-4 justify-center'>
            {CameraModal}
            <TouchableOpacity className='px-6 py-4 rounded-xl bg-primary-400/15 flex flex-col items-center'
              onPress={() => setTriggerCamera(true)}
            >
              <Icon as={CameraIcon} size="lg" className='text-primary-400' />
              <Text className='text-primary-400'>Dùng máy ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='px-6 py-4 rounded-xl bg-primary-400/15 flex flex-col items-center'
              onPress={async () => {
                const pickedFile = await FileUploader.pickImage()
                if (pickedFile) {
                  pickFn(pickedFile)
                  setShowModal(false)
                }
              }}
            >
              <Icon as={Library} size="lg" className='text-primary-400' />
              <Text className='text-primary-400'>Dùng ảnh có sẵn</Text>
            </TouchableOpacity>
          </View>
        </ModalBody>
      </ModalContent>
    </Modal>


  )
}