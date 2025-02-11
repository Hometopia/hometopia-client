import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'
import { ChevronLeftIcon, CloseIcon, Icon } from '../ui/icon'
import { CategoryResponseType } from '@/api/types/response'
import { Button, ButtonIcon, ButtonText } from '../ui/button'
import { router } from 'expo-router'
import { BLANK_CATEGORY_NAME } from '@/constants/client'

export default function CategoryPickerModal(
  {
    type = 'normal',
    showModal,
    setShowModal,
    data,
    pickFn,
  }: {
    type?: 'parent' | 'normal' | 'category'
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
    if (type === 'normal') {
      const childs = data?.filter(i => (i.parent !== null && i.parent.id === id))
      if (childs && childs.length > 0)
        setChildren(data?.filter(i => (i.parent !== null && i.parent.id === id)))
      else {
        pickFn(id)
        setShowModal(false)
      }
    }
    else {
      pickFn(id)
      setShowModal(false)
    }
  }

  const RenderItem = ({ item, onPress }: { item: CategoryResponseType | null, onPress: Function }) => (
    <TouchableOpacity
      className='w-auto mb-4 px-4 py-2 flex flex-row justify-between items-center border border-outline-100 rounded-lg'
      onPress={() => onPress()}
    >
      <Text className='text-lg text-typography-800'>{item ? item.name : 'Không có'}</Text>
      {/* <Text className='text-md text-typography-600'>SL: {item?.numberOfAssets}</Text> */}
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
        {data?.length === 0 ?
          <View className='h-[360px] flex flex-col justify-center items-center gap-4'>
            <Text className='text-typography-800 text-lg'>Chưa khởi tạo danh mục</Text>
            <Button className='rounded-lg' onPress={() => router.push('/(_main)/category')}>
              <ButtonText>Nhấp để khởi tạo</ButtonText>
            </Button>
          </View>

          :
          <View className='py-4 flex flex-col gap-4 '>
            {children === undefined ?
              <FlatList
                className='h-[360px]'
                overScrollMode='never'
                data={type === 'parent' ? [null, ...(parentList || [])] :
                  type === 'category' ? [...(parentList?.filter(i => i.name !== BLANK_CATEGORY_NAME) || [])] :
                    parentList}
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
              <View className='h-[360px] flex flex-col gap-4'>
                <View className='flex flex-row justify-start items-center gap-4'>
                  <Button
                    className={children === undefined ? "hidden p-2" : "border-outline-200 p-2"}
                    variant="outline"
                    action="default"
                    onPress={() => setChildren(undefined)}
                    disabled={children === undefined}
                  >
                    <ButtonIcon as={ChevronLeftIcon} className="h-6 w-6 text-typography-700" />
                  </Button>
                  <View className='py-2 px-4 rounded-xl bg-primary-400/10'>
                    <Text className='text-primary-400'>{children[0].parent.name}</Text>
                  </View>
                </View>
                <FlatList
                  className=''
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

              </View>
            }
            <TouchableOpacity
              className='mt-4 flex flex-row justify-center p-2 rounded-lg bg-primary-400/10'
              onPress={() => {
                pickFn('')
                setShowModal(false)
              }}>
              <Text className='text-lg font-bold text-primary-400'>Bỏ chọn</Text>
            </TouchableOpacity>
          </View>
        }


        {/* </ModalBody> */}
      </ModalContent>
    </Modal>
  )
}