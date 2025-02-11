import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'
import { ChevronLeftIcon, CloseIcon, Icon } from '../ui/icon'
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '../ui/button'
import { Input, InputField } from '../ui/input'
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
import { LocationType } from '@/api/types/request'
import { useImageManipulator } from '@/hooks/useImageManipulator'
import { useMutation } from '@tanstack/react-query'
import { set } from 'date-fns'
const NAME_MAX_LENGTH = 30
export default function CreateLocationModal(
  {
    showModal,
    setShowModal,
  }: {
    showModal: boolean,
    setShowModal: Function,
  }
) {

  const FileUploader = useFileUploader()
  const ImgManipulator = useImageManipulator()
  const [imgPicked, setImgPicked] = useState<DocumentPicker.DocumentPickerAsset | undefined>(undefined)

  const [imgAdderShow, setImgAdderShow] = useState(false)

  const nameControl = useFormControl('', (v) => { return v !== '' })

  const [isConfirmUpload, setIsConfirmUpload] = useState(true)
  const [isFileUpload, setIsFileUpload] = useState(false)

  const [imgInfo, setImgInfo] = useState<FileInfoType | undefined>(undefined)

  const [createPending, setCreatePending] = useState(false)


  const validateAll = () => {
    nameControl.validate()
  }

  const goToNextStep = async () => {
    const validArray = [
      nameControl.isValid
    ]

    for (var i: number = 0; i < validArray.length; i++) {
      if (validArray[i] === false) {
        return
      }
    }

    handleMutation()
  }
  const handleMutation = async () => {
    if (imgPicked !== undefined) {

      try {
        console.log(imgPicked)
        const res = await FileService.uploadFiles([imgPicked])
        if (res) {
          console.log(res)
          setImgInfo(res.data.items[0].data as FileInfoType)
          setIsFileUpload(true)
        }
      }
      catch (err) {
        console.error(err)
      }
    }
    else {
      setIsFileUpload(true)
    }
  }
  useAsyncExec({
    condition:
      imgPicked !== undefined &&
      imgPicked.size !== undefined &&
      imgPicked.size >= 500000, callback: async () => {
        if (imgPicked !== undefined) {
          if (imgPicked.size && imgPicked.size >= 500000) {
            const tmpUri = await ImgManipulator.compressImage(imgPicked.uri, Math.ceil((500000 / imgPicked.size) * 100) / 100)
            setImgPicked({
              ...imgPicked,
              uri: tmpUri,
              size: Math.round(imgPicked.size * (Math.ceil((500000 / imgPicked.size) * 100) / 100))
            } as DocumentPicker.DocumentPickerAsset)
            setIsConfirmUpload(true)
          }
        }
      }
  })
  useAsyncExec({
    condition: isFileUpload, callback: async () => {
      setCreatePending(true)
      const res = await LocationService.createLocation({
        name: nameControl.value,
        images: imgInfo ? [imgInfo] : null
      } as LocationType)
      if (res) {
        setCreatePending(false)
        setShowModal(false)
      }
    }
  })
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
            Tạo vị trí mới
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
          <ControllableInput
            control={nameControl}
            label='Tên'
            errorText='Không thể trống'
            input={
              <View className='flex flex-col gap-2 items-end'>
                <Input>
                  <InputField
                    type='text'
                    value={nameControl.value}
                    onChangeText={(value: string) => {
                      if (value.length > NAME_MAX_LENGTH) return
                      nameControl.onChange(value)
                    }}
                    placeholder='Tên vị trí. Ví dụ: Phòng ngủ' />
                </Input>
                <Text className={nameControl.value.length < NAME_MAX_LENGTH ? 'text-typography-600' : 'text-error-400'} >
                  {nameControl.value.length + ' / ' + NAME_MAX_LENGTH}
                </Text>
              </View>
            }
          />

          <View className='flex flex-col gap-2'>
            <Text className="text-md font-semibold text-typography-500">
              Hình ảnh
            </Text>
            <View className='flex flex-col gap-4'>
              {imgPicked &&
                <View className='flex flex-col items-center'>
                  <Image
                    // className="w-[12rem] h-[12rem]"
                    size='2xl'
                    source={{ uri: imgPicked.uri }}
                    alt="asset img"
                  />
                </View>}
              <AddImageTrigger imgPicked={imgPicked} setImgPicked={
                (i: DocumentPicker.DocumentPickerAsset) => {
                  setImgPicked(i)

                  if (imgPicked !== undefined) {
                    if (imgPicked.size && imgPicked.size >= 500000) {
                      setIsConfirmUpload(false)
                    }
                  }
                }} />
            </View>
          </View>
          <Divider />
          <Button
            className='rounded-lg'
            size='lg'
            onPress={handleSubmit}
            isDisabled={!isConfirmUpload}>
            {createPending ?
              <>
                <ButtonSpinner className='text-white' />
                <ButtonText className="font-medium text-sm ml-2">
                  Đang tạo...
                </ButtonText>
              </>
              :
              <ButtonText>Tạo mới</ButtonText>
            }

          </Button>
        </View>
        {/* </ModalBody> */}
      </ModalContent>
    </Modal>

  )
}