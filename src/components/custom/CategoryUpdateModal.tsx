import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'
import { ChevronDownIcon, ChevronLeftIcon, CloseIcon, Icon } from '../ui/icon'
import { CategoryResponseType } from '@/api/types/response'
import { Button, ButtonIcon, ButtonText } from '../ui/button'
import ControllableInput from './ControllableInput'
import { Input, InputField, InputIcon, InputSlot } from '../ui/input'
import { Textarea, TextareaInput } from '../ui/textarea'
import { Select } from './Select'
import { SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectPortal, SelectTrigger } from '../ui/select'
import useFormControl from '@/hooks/useFormControl'
import CategoryPickerModal from './CategoryPickerModal'
import { useFocusEffect } from 'expo-router'
import { TrashIcon } from 'lucide-react-native'
import { CategoryUpdateType } from '@/api/types/request'
import useFormSubmit from '@/hooks/useFormSubmit'

export default function CategoryUpdateModal(
  {
    showModal,
    setShowModal,
    data,
    fullList,
    updateFn,
    deleteFn
  }: {
    showModal: boolean,
    setShowModal: Function,
    data: CategoryResponseType,
    fullList: CategoryResponseType[],
    updateFn: Function,
    deleteFn: Function,
  }
) {

  useFocusEffect(
    useCallback(() => {
      if (showModal) {
        nameControl.onChange(data.name)
        descControl.onChange(data.description)
        parentControl.onChange(data.parent !== null ? data.parent.id : '')
      }
    }, [data]),
  )

  const [parentList, setParentList] = useState<CategoryResponseType[]>(
    fullList.filter(i => !i.parent)
  )
  const [children, setChildren] = useState<CategoryResponseType[] | undefined>(undefined)
  const [categoryModalShow, setCategoryModalShow] = useState(false)

  const getCategoryName = (id: string): string => {
    return fullList.find((i: CategoryResponseType) => i.id === id)?.name || ''
  }

  const nameControl = useFormControl(data.name, (v): boolean => { return v !== "" })
  const descControl = useFormControl(data.description, (v): boolean => true)
  const parentControl = useFormControl(data.parent !== null ? data.parent.id : '', (v): boolean => true)

  const validateAll = () => {
    nameControl.validate()
    descControl.validate()
    parentControl.validate()
  }

  const goToNextStep = async () => {
    const validArray = [
      nameControl.isValid,
      descControl.isValid,
      parentControl.isValid,
    ]

    for (var i: number = 0; i < validArray.length; i++) {
      if (validArray[i] === false) {
        return
      }
    }

    setShowModal(false)
    updateFn({
      id: data.id,
      payload: {
        name: nameControl.value,
        description: descControl.value !== '' ? descControl.value : 'Không có',
        parentId: parentControl.value !== '' ? parentControl.value : null,
        subCategoryIds: fullList.filter(i => i.parent && i.parent.id === data.id)
          .map(i => i.id)
      } as CategoryUpdateType
    })
  }

  const { handleSubmit } = useFormSubmit(validateAll, goToNextStep)
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
            Sửa danh mục
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
        <View className='py-4 flex flex-col gap-4'>
          <View className='flex flex-col gap-2'>
            <ControllableInput control={nameControl} label="Tên danh mục" errorText='Tên danh mục không được để trống'
              input={
                <Input
                  className="text-center"
                  size="lg">
                  <InputField
                    type="text"
                    placeholder="Nhập tên danh mục"
                    value={nameControl.value}
                    onChangeText={nameControl.onChange} />
                </Input>}
            />
            <ControllableInput control={descControl} label="Mô tả" errorText='' isRequired={false}
              input={
                <Textarea size='lg'>
                  <TextareaInput
                    placeholder="Thêm mô tả cho danh mục này"
                    value={descControl.value}
                    onChangeText={descControl.onChange}
                  />
                </Textarea>
              }
            />
            <ControllableInput control={parentControl} label="Danh mục cha" errorText=''
              input={
                <View className="flex flex-col gap-4">
                  <CategoryPickerModal
                    type='parent'
                    showModal={categoryModalShow}
                    setShowModal={setCategoryModalShow}
                    data={fullList}
                    pickFn={(id: string) => {
                      parentControl.onChange(id)
                    }}
                  />
                  <Input
                    isReadOnly={true}
                    variant="outline"
                    size="lg"
                    onTouchEnd={() => setCategoryModalShow(true)}
                  >
                    <InputField placeholder="Danh mục cha" value={getCategoryName(parentControl.value)} />
                    <InputSlot >
                      <InputIcon className="mr-3" as={ChevronDownIcon} />
                    </InputSlot>
                  </Input>
                </View>
              }
              isRequired={false}
            />
          </View>

          <Button
            className='rounded-lg'
            variant='solid'
            action='primary'
            size='lg'
            onPress={handleSubmit}
            isDisabled={
              nameControl.value === data.name &&
              descControl.value === data.description &&
              ((parentControl.value === '' && data.parent === null) ||
                (data.parent !== null && parentControl.value === data.parent.id))
            }
          >
            <ButtonText>Lưu thay đổi</ButtonText>
          </Button>
          <Button
            className='rounded-lg'
            variant='outline'
            action='negative'
            size='lg'
            onPress={() => {
              setShowModal(false)
              deleteFn(data.id)
            }}
          >
            <ButtonIcon as={TrashIcon} />
            <ButtonText className='text-error-400'>Xóa danh mục</ButtonText>
          </Button>
        </View>


        {/* </ModalBody> */}
      </ModalContent>
    </Modal>
  )
}