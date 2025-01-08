
import React from 'react'
import { Popover, PopoverArrow, PopoverBackdrop, PopoverBody, PopoverContent } from '../ui/popover'
import { Text } from '../ui/text'
import { Icon } from '../ui/icon'
import { Star } from 'lucide-react-native'
import { View } from 'react-native'
import { primaryColor } from '@/constants/color'

export default function UpcomingFeaturePopover(
  {
    trigger
  }: {
    trigger: any
  }
) {
  const [isOpen, setIsOpen] = React.useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <Popover
      isOpen={isOpen}
      onClose={handleClose}
      onOpen={handleOpen}
      placement="bottom"
      size="md"
      trigger={(triggerProps) => (
        React.cloneElement(trigger, triggerProps)
      )}
    >
      <PopoverBackdrop />
      <PopoverContent >
        <PopoverArrow />
        <PopoverBody>
          <View className='flex flex-row items-center justify-center gap-4 '>
            <Star size={16} strokeWidth={0} fill={`rgb(${primaryColor[400]})`} />
            <Text size="md" className="shrink text-primary-400">
              Tính năng này đang trong quá trình phát triển.
            </Text>
          </View>

        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
