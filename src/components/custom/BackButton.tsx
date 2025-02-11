import { View, Text } from 'react-native'
import React from 'react'
import { Button, ButtonIcon } from '../ui/button'
import { ChevronLeftIcon } from 'lucide-react-native'

export default function BackButton({ backFn }: { backFn: () => void }) {
  return (
    <Button
      variant="outline"
      action="default"
      className="border-outline-200 p-2 rounded-lg"
      onPress={backFn}
    >
      <ButtonIcon as={ChevronLeftIcon} className="h-6 w-6 text-typography-700" />
    </Button>
  )
}