import { View } from "react-native";
import { Image } from "../ui/image";
import { IMAGE_URL } from "@/constants/public";
import { Button, ButtonText } from "../ui/button";
import { useState } from "react";
import { useGlobalContext } from "@/contexts/GlobalProvider";
import { Pressable } from "../ui/pressable";
import useFileUploader from "@/hooks/useFileUploader";
import { DocumentPickerAsset } from "expo-document-picker";
import { FileService } from "@/api/FileService";
import CommonToast from "../feedback/CommonToast";
import { Text } from "../ui/text";
import AddImageTrigger from "./AddImageTrigger";
import * as DocumentPicker from 'expo-document-picker'
import ImageAdder from "./ImageAdder";
import { useAsyncExec } from "@/hooks/useAsyncExec";
import { useImageManipulator } from "@/hooks/useImageManipulator";

type ImageUploaderProps = {
  className?: string,
  uri: string,
  placeholder: boolean,
  uploadFn: Function,
}

export default function ImageUploader({
  className, uri, placeholder, uploadFn
}: ImageUploaderProps) {
  const [active, setActive] = useState(false)
  const [pickedFile, setPickedFile] = useState<DocumentPickerAsset | undefined>(undefined)
  const [imgUri, setImgUri] = useState(uri)
  const FileUploader = useFileUploader()
  const [imgAdderShow, setImgAdderShow] = useState(false)
  const ImgManipulator = useImageManipulator()
  const [isConfirmUpload, setIsConfirmUpload] = useState(true)
  useAsyncExec({
    condition:
      pickedFile !== undefined &&
      pickedFile.size !== undefined &&
      pickedFile.size >= 500000,
    callback: async () => {
      if (pickedFile !== undefined) {
        if (pickedFile.size && pickedFile.size >= 500000) {
          const tmpUri = await ImgManipulator.compressImage(pickedFile.uri, Math.ceil((500000 / pickedFile.size) * 100) / 100)
          setPickedFile({
            ...pickedFile,
            uri: tmpUri,
            size: Math.round(pickedFile.size * (Math.ceil((500000 / pickedFile.size) * 100) / 100))
          } as DocumentPicker.DocumentPickerAsset)
          setIsConfirmUpload(true)
        }
      }
    }
  })


  return (
    <View>
      <ImageAdder
        showModal={imgAdderShow}
        setShowModal={setImgAdderShow}
        pickFn={(img: DocumentPicker.DocumentPickerAsset) => {
          setPickedFile(img)
          setImgUri(img.uri)
        }}
      />
      <Pressable
        className={`${className ? className : 'w-[240px] h-[240px]'} relative overflow-hidden rounded-xl`}
        onPress={() => {
          if (pickedFile === undefined)
            setActive(prev => !prev)
        }
        }
      >
        <View
          className={`${active ? `flex` : `hidden`} absolute z-50 h-full w-full items-center justify-center bg-black/[0.2]`
          }
        >
          {!pickedFile &&
            <Button
              className="rounded-lg"
              variant="solid"
              onPress={async () => {
                setImgAdderShow(true)
              }}
            >
              <ButtonText>Thay ảnh</ButtonText>
            </Button>
          }

          {pickedFile && <View className="flex flex-col gap-4">
            <Button
              className="rounded-lg"
              variant="solid"
              isDisabled={!isConfirmUpload}
              onPress={() => {
                uploadFn(pickedFile)
                setActive(prev => !prev)
              }}
            >
              <ButtonText>Lưu</ButtonText>
            </Button>
            <Button
              className="bg-white rounded-lg"
              onPress={async () => {
                setImgAdderShow(true)
              }}
            >
              <ButtonText className="text-typography-800">Thay đổi</ButtonText>
            </Button>
            <Button
              className="border border-white bg-white/40 rounded-lg"
              onPress={() => {
                setImgUri(uri)
                setPickedFile(undefined)
                setActive(false)
              }}
            >
              <ButtonText className="text-white">Hủy</ButtonText>
            </Button>
          </View>}
        </View>
        {!placeholder || pickedFile !== undefined ?
          <Image
            className="h-full w-full"
            source={{ uri: imgUri }}
            alt="asset-img"
          />
          :
          <View className="h-full w-full flex justify-center items-center bg-slate-50">
            <Text className="text-typography-600">Chưa có ảnh</Text>
          </View>
        }

      </Pressable>
    </View>

  )
}
