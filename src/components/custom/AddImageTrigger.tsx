import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Button, ButtonText } from '../ui/button'
import useFileUploader from '@/hooks/useFileUploader'
import * as DocumentPicker from 'expo-document-picker'
import ImageAdder from './ImageAdder'
import { Image } from '../ui/image'

type Props = {
  imgPicked: DocumentPicker.DocumentPickerAsset | undefined,
  setImgPicked: Function,
}
export default function AddImageTrigger({
  imgPicked, setImgPicked
}: Props) {

  const [imgAdderShow, setImgAdderShow] = useState(false)
  return (
    <>
      <ImageAdder
        showModal={imgAdderShow}
        setShowModal={setImgAdderShow}
        pickFn={(img: DocumentPicker.DocumentPickerAsset) => {
          setImgPicked(img)
        }}
      />
      <Button
        className="px-3 w-full rounded-lg"
        variant='outline'
        action='primary'
        onPress={async () => {
          setImgAdderShow(true)
        }} >
        <ButtonText>{imgPicked ? 'Thay ảnh' : 'Thêm hình ảnh'}</ButtonText>
      </Button>

    </>
  )
}