import { View } from 'react-native'
import { Text } from '../ui/text'
import React from 'react'
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from '../ui/alert-dialog'
import { Button, ButtonText } from '../ui/button'

type Props = {
  text: string,
  show: boolean,
  setShow: Function,
  deleteFn: Function
}

export default function DeleteDialog({ text, show, setShow, deleteFn }: Props) {
  return (
    <AlertDialog isOpen={show} onClose={() => setShow(false)} size="md">
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Text className="text-typography-900 font-medium text-lg">
            Chắc chắn muốn xóa
            <Text className="text-warning-400 font-medium text-lg">{` ${text} `}</Text>
            chứ?
          </Text>
        </AlertDialogHeader>
        <AlertDialogBody className="mt-3 mb-4">
          <Text className="text-typography-800 text-md">
            Nó sẽ bị xóa vĩnh viễn và không thể hoàn tác.
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
            <ButtonText>Hủy</ButtonText>
          </Button>
          <Button className='rounded-lg' size="lg" action='negative' onPress={() => {
            deleteFn()
            setShow(false)
          }}>
            <ButtonText>Xóa</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}