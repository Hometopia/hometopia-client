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
import { Text } from "../ui/text";

type ImageUploaderProps = {
  className?: string,
  uri: string,
  placeholder: boolean,
  uploadFn: Function,
}

export default function ImageUploader({
  className, uri, uploadFn, placeholder
}: ImageUploaderProps) {
  const [active, setActive] = useState(false)
  const [pickedFile, setPickedFile] = useState<DocumentPickerAsset | undefined>(undefined)
  const [imgUri, setImgUri] = useState(uri)
  const FileUploader = useFileUploader()

  const handlePickFile = async () => {
    const pickedFile = await FileUploader.pickImage()
    if (pickedFile) {
      setPickedFile(pickedFile)
      setImgUri(pickedFile.uri)
    }
  }
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
          onPress={handlePickFile}
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
            onPress={handlePickFile}
          >
            <ButtonText className="text-typography-800">Thay đổi</ButtonText>
          </Button>
          <Button
            className="border border-white bg-white/40"
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
  )
}
