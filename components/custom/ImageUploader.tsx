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
import { FileInfoType } from "@/api/types/request";
import CommonToast from "../feedback/CommonToast";

type ImageUploaderProps = {
  className?: string,
  uri: string,
  uploadFn: Function,
}

export default function ImageUploader({
  className, uri, uploadFn
}: ImageUploaderProps) {
  const [active, setActive] = useState(false)
  const [pickedFile, setPickedFile] = useState<DocumentPickerAsset | undefined>(undefined)
  const [imgUri, setImgUri] = useState(uri)
  const FileUploader = useFileUploader()

  return (
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
        {!pickedFile && <Button
          className="w-fit"
          onPress={async () => {
            const pickedFile = await FileUploader.pickImage()
            if (pickedFile) {
              setPickedFile(pickedFile)
              setImgUri(pickedFile.uri)
            }
          }}
        >
          <ButtonText>Tải lên</ButtonText>
        </Button>}

        {pickedFile && <View className="flex flex-col gap-4">
          <Button
            variant="solid"
            onPress={() => {
              uploadFn(pickedFile)
            }}
          >
            <ButtonText>Lưu</ButtonText>
          </Button>
          <Button
            className="bg-white "
          >
            <ButtonText className="text-typography-800">Thay đổi</ButtonText>
          </Button>
          <Button
            variant="outline"
            className="border-white"
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
      <Image
        className="h-full w-full"
        source={{ uri: imgUri }}
        alt="asset-img"
      />
    </Pressable>
  )
}
