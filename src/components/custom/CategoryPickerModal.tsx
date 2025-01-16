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


  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false)
      }}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent>
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
            className='h-[240px] '
            overScrollMode='never'
            data={parentList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ marginBottom: 8 }}
                className='w-auto px-4 py-2 flex flex-row justify-center border border-outline-100'
                onPress={() => handleParentCategoryPicked(item.id)}
              >
                <Text className='text-lg'>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          /> :
          <FlatList
            className='h-[240px] '
            overScrollMode='never'
            data={children}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ marginBottom: 8 }}
                className='w-auto px-4 py-2 flex flex-row justify-center border border-outline-100'
                onPress={() => {
                  pickFn(item.id)
                  setShowModal(false)
                }}
              >
                <Text className='text-lg'>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        }
        <Button
          className='mt-4'
          variant='solid'
          action='primary'
          size='lg'
          onPress={() => {
            pickFn('')
            setShowModal(false)
          }}>
          <ButtonText>Bỏ chọn</ButtonText>
        </Button>

        {/* </ModalBody> */}
      </ModalContent>
    </Modal>
  )
}