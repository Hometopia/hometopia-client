import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'
import { ChevronLeftIcon, CloseIcon, Icon } from '../ui/icon'
import { CategoryResponseType } from '@/api/types/response'
import { Button, ButtonIcon, ButtonText } from '../ui/button'

export default function CategoryPickerModal(
  {
    type = 'normal',
    showModal,
    setShowModal,
    data,
    pickFn,
  }: {
    type?: 'parent' | 'normal'
    showModal: boolean,
    setShowModal: Function,
    data?: CategoryResponseType[],
    pickFn: Function
  }
) {

  const [parentList, setParentList] = useState<CategoryResponseType[] | undefined>(undefined)
  const [children, setChildren] = useState<CategoryResponseType[] | undefined>(undefined)

  useEffect(() => {
    setParentList(data?.filter(i => i.parent == null))
  }, [data])

  const handleParentCategoryPicked = (id: string) => {
    if (type === 'normal')
      setChildren(data?.filter(i => (i.parent !== null && i.parent.id === id)))
    else {
      pickFn(id)
      setShowModal(false)
    }
  }

  const RenderItem = ({ item, onPress }: { item: CategoryResponseType | null, onPress: Function }) => (
    <TouchableOpacity
      className='w-auto mb-4 px-4 py-2 flex flex-row justify-center border border-outline-100 rounded-lg'
      onPress={() => onPress()}
    >
      <Text className='text-lg'>{item ? item.name : 'Không có'}</Text>
    </TouchableOpacity>
  )


  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false)
      }}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent className='rounded-xl'>
        <ModalHeader>
          <Text className="text-typography-900 text-lg font-medium">
            Chọn danh mục
          </Text>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="lg"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        {/* <ModalBody> */}
        <View className='flex flex-row justify-start my-4'>
          <Button
            variant="outline"
            action="default"
            className={children === undefined ? "hidden p-2" : "border-outline-200 p-2"}
            onPress={() => setChildren(undefined)}
            disabled={children === undefined}
          >
            <ButtonIcon as={ChevronLeftIcon} className="h-6 w-6 text-typography-700" />
          </Button>
        </View>
        {children === undefined ?
          <FlatList
            className='h-[240px]'
            overScrollMode='never'
            data={type === 'parent' ? [null, ...(parentList || [])] : parentList}
            renderItem={({ item }) => (
              <RenderItem item={item} onPress={() => {
                if (item) handleParentCategoryPicked(item.id)
                else {
                  pickFn(null)
                  setShowModal(false)
                }
              }} />
            )}
            keyExtractor={item => item ? item.id : 'key-blank'}
          /> :
          <FlatList
            className='h-[240px]'
            overScrollMode='never'
            data={children}
            renderItem={({ item }) => (
              <RenderItem item={item} onPress={() => {
                pickFn(item.id)
                setShowModal(false)
              }} />
            )}
            keyExtractor={item => item.id}
          />
        }
        <TouchableOpacity
          className='mt-4 flex flex-row justify-center p-2 rounded-lg bg-primary-400/10'
          onPress={() => {
            pickFn('')
            setShowModal(false)
          }}>
          <Text className='text-lg font-bold text-primary-400'>Bỏ chọn</Text>
        </TouchableOpacity>

        {/* </ModalBody> */}
      </ModalContent>
    </Modal>
  )
}