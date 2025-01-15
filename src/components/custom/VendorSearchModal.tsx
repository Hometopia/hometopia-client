import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { Modal, ModalBackdrop, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'
import { CloseIcon, Icon } from '../ui/icon'
import { Button } from '../ui/button'
import { Input, InputField } from '../ui/input'
import { Spinner } from '../ui/spinner'

export default function VendorSearchModal({
  showModal,
  setShowModal,
  data,
  pickFn,
  seachValue,
  searchChange
}: {
  showModal: boolean,
  setShowModal: Function,
  data?: any[],
  pickFn: Function,
  seachValue: string,
  searchChange: Function
}) {

  const uniqueArray = (arr: any[]) => {
    const seen = new Set();
    return arr.filter((item) => {
      const serializedItem = JSON.stringify(item);
      if (seen.has(serializedItem)) {
        return false;
      }
      seen.add(serializedItem);
      return true;
    });
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
            Nhập nhà cung cấp
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
          <Input
            className='w-full'
            size='lg'
          >
            <InputField
              value={seachValue}
              onChangeText={(v) => searchChange(v)}
            />
          </Input>
        </View>
        {data === undefined ?
          <Spinner />
          :
          data.length > 0 ?
            <FlatList
              className=' max-h-[240px]'
              overScrollMode='never'
              data={uniqueArray(data || [])}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ marginBottom: 8 }}
                  className='w-auto px-4 py-2 flex flex-row justify-start bg-background-50 rounded-lg'
                  onPress={() => {
                    pickFn(item.name)
                    setShowModal(false)
                  }}
                >
                  <Text className='text-lg'>{item.name}</Text>
                </TouchableOpacity>
              )}
            /> : <Text className='text-typography-900 text-lg font-medium'>Không tìm thấy kết quả</Text>

        }
        {/* </ModalBody> */}
      </ModalContent>
    </Modal>
  )
}