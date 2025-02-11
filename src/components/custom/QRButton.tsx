import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { PrinterIcon, QrCode, QrCodeIcon } from "lucide-react-native";
import { Menu, MenuItem, MenuItemLabel } from "../ui/menu";
import { useState } from "react";
import QRCode from "react-native-qrcode-svg";
import { TouchableOpacity, View } from "react-native";
import { CloseIcon, Icon } from "../ui/icon";
import { DEEP_LINK } from "@/constants/client";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "../ui/modal";
import { Text } from "../ui/text";
import { Spinner } from "../ui/spinner";
export default function QRGenerateButton({
  uri, size = 'lg', name
}: {
  uri: string,
  size?: "md" | "sm" | "lg" | "xl",
  name: string
}) {
  const [generate, setGenerate] = useState(false)
  const [qrValue, setQrValue] = useState<string | null>(null)

  const generateQR = () => {
    setQrValue(DEEP_LINK + uri)
    setGenerate(true)
  }

  return (
    <View>
      <TouchableOpacity
        className="flex justify-center items-center p-2 rounded-lg border border-primary-400 "
        onPress={generateQR} >
        <Icon as={QrCodeIcon} size={size} className="text-primary-400" />
      </TouchableOpacity>

      <Modal
        isOpen={generate}
        onClose={() => {
          setGenerate(false)
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent className="rounded-xl">
          <ModalHeader>
            <View className="w-full flex flex-col items-center gap-0">
              <Text className="text-typography-900 text-lg font-medium">
                QR code của
              </Text>
              <Text className="text-primary-500 text-lg">
                {name}
              </Text>
            </View>
          </ModalHeader>
          <ModalBody className="py-4">
            {qrValue ?
              <View className="flex justify-center items-center">
                <QRCode value={qrValue} size={200} />
              </View>
              :
              <View className="flex justify-center items-center h-[200px] w-[200px]">
                <Spinner />
                <Text className="text-typography-800">Đang tạo</Text>
              </View>
            }

          </ModalBody>
          <ModalFooter>
            <Button className="rounded-lg w-full" size='lg'>
              <ButtonIcon as={PrinterIcon} />
              <ButtonText>In</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  )
}
