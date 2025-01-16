import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon } from '../ui/icon'
import { FilterIcon } from 'lucide-react-native'
import { Text } from '../ui/text'
import { Popover, PopoverArrow, PopoverBackdrop, PopoverBody, PopoverContent } from '../ui/popover'

type CustomFilterPropsType = {
  filters: React.ReactNode,
  isFiltered: boolean
}
export default function CustomFilter({
  filters, isFiltered
}: CustomFilterPropsType) {
  const [isOpen, setIsOpen] = React.useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }
  const FilterTrigger = (
    <TouchableOpacity className={isFiltered ?
      'flex flex-row py-2 px-4 gap-2 rounded-lg bg-primary-400/15' :
      'flex flex-row py-2 px-4 gap-2'}>
      <Icon as={FilterIcon} className={isFiltered ? 'text-primary-400' : 'text-typography-600'} />
      <Text className={isFiltered ? 'text-primary-400' : 'text-typography-600'}>Bộ lọc</Text>
    </TouchableOpacity>
  )

  return (
    <Popover
      isOpen={isOpen}
      onClose={handleClose}
      onOpen={handleOpen}
      placement="bottom"
      size="md"
      trigger={(triggerProps) => (
        React.cloneElement(FilterTrigger, triggerProps)
      )}
    >
      <PopoverBackdrop />
      <PopoverContent >
        <PopoverArrow />
        <PopoverBody>
          {filters}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}