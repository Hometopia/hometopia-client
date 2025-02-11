import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog"
import { Button, ButtonText } from "../ui/button"
import { Text } from "../ui/text"

type Props = {
  text: string,
  show: boolean,
  setShow: Function
}

export default function NotificationDialog({ text, show, setShow }: Props) {
  return (
    <AlertDialog isOpen={show} onClose={() => setShow(false)} size="md">
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Text className="text-typography-900 font-medium text-lg">
            Này bạn ơi !
          </Text>
        </AlertDialogHeader>
        <AlertDialogBody className="mt-3 mb-4">
          <Text className="text-typography-800 text-md">
            {text}
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter className="">
          <Button
            className='rounded-lg'
            variant="outline"
            action="secondary"
            onPress={() => setShow(false)}
            size="lg"
          >
            <ButtonText>Ừ biết rồi</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}