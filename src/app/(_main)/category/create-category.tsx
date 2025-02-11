import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { ChevronDownIcon, ChevronLeftIcon, SearchIcon } from 'lucide-react-native'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { router } from 'expo-router'
import useFormControl from '@/hooks/useFormControl'
import ControllableInput from '@/components/custom/ControllableInput'
import CategoryPickerModal from '@/components/custom/CategoryPickerModal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CategoryService } from '@/api/CategoryService'
import { CategoryResponseType } from '@/api/types/response'
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select'
import { Textarea, TextareaInput } from '@/components/ui/textarea'
import useFormSubmit from '@/hooks/useFormSubmit'
import { CategoryType } from '@/api/types/request'
import { useToast } from '@/components/ui/toast'
import CommonToast from '@/components/feedback/CommonToast'
import Loading from '@/components/feedback/Loading'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import MainContainer from '@/components/container/MainContainer'
import BackButton from '@/components/custom/BackButton'
import { BLANK_CATEGORY_NAME, BLANK_PARENT_CATEGORY } from '@/constants/client'

export default function CreateCategory() {
  const nameControl = useFormControl("", (v): boolean => {
    return v !== ""
  })
  const descControl = useFormControl("", (v): boolean => {
    return true
  })
  const parentControl = useFormControl("", (v): boolean => {
    return true
  })

  //#region category
  const [categoryModalShow, setCategoryModalShow] = React.useState(false)
  const parentListQuery = useQuery({
    queryKey: ['parent-categories'],
    queryFn: () => CategoryService.getParentList(),
  })
  const getCategoryName = (): string => {
    return parentListQuery.data?.data.items.find((i: CategoryResponseType) => i.id === parentControl.value)?.name
  }
  //#endregion

  //#region feedback
  const toast = useToast()
  const successToast = CommonToast({
    toast: toast,
    title: "Tạo danh mục thành công",
    description: "Danh mục đã được tạo thành công",
    variant: "success"
  })
  const errorToast = CommonToast({
    toast: toast,
    title: "Tạo danh mục thất bại",
    description: "Danh mục chưa được tạo",
    variant: "error"
  })
  //#endregion

  const queryClient = useQueryClient()

  const createCategory = useMutation({
    mutationFn: (category: CategoryType) => CategoryService.createListCategories([category]),
    onSuccess: (res) => {
      if (res) {
        switch (res.status) {
          case 200:
          case 201:
            {
              successToast.handleToast()
              queryClient.refetchQueries({ queryKey: ['categoryFullList'] })
              router.back()
              return
            }
        }
      }
      errorToast.handleToast()
    },
    onError: (res) => {
      errorToast.handleToast()
    }
  })

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

    createCategory.mutate({
      name: nameControl.value,
      description: descControl.value,
      parentId: parentControl.value !== "" ? parentControl.value : undefined,
      subCategories: []
    } as CategoryType)

  }

  const resetForm = () => {
    nameControl.reset()
    descControl.reset()
    parentControl.reset()
  }

  const { handleSubmit } = useFormSubmit(validateAll, goToNextStep)

  return (
    <BaseScreenContainer>
      {(createCategory.isPending) &&
        <Loading texts={[
          {
            condition: createCategory.isPending,
            text: 'Đang tạo...'
          }
        ]} />
      }
      <MainContainer>
        <View className='flex flex-col gap-4'>
          <View className="bg-background-0 h-[48px] pt-2 flex flex-row justify-between">
            <BackButton backFn={() => router.back()} />
          </View>

          <View className='flex flex-col gap-2'>
            <ControllableInput control={nameControl} label="Tên danh mục" errorText='Tên tài sản không được để trống'
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
            <ControllableInput control={parentControl} label="Danh mục" errorText=''
              isRequired={false}
              input={
                <>
                  <CategoryPickerModal
                    type='category'
                    showModal={categoryModalShow}
                    setShowModal={setCategoryModalShow}
                    data={parentListQuery.data ? parentListQuery.data?.data.items as CategoryResponseType[] : []}
                    pickFn={(id: string | null) => {
                      parentControl.onChange(id !== null ? id : BLANK_PARENT_CATEGORY)
                    }}
                  />
                  <Text className='text-typography-600'>Không chọn nếu tạo danh mục cha</Text>
                  <Input
                    isReadOnly={true}
                    variant="outline"
                    size="lg"
                    onTouchEnd={() => setCategoryModalShow(true)}
                  >
                    <InputField placeholder="Danh mục cha" value={getCategoryName()} />
                    <InputSlot >
                      <InputIcon className="mr-3" as={ChevronDownIcon} />
                    </InputSlot>
                  </Input>
                </>
              }
            />
          </View>

          <View className='flex flex-row gap-4 mt-4 mb-4 justify-end'>
            <Button
              className='rounded-lg'
              variant='outline'
              action='secondary'
              size='lg'
              onPress={resetForm}
            >
              <ButtonText>Đặt lại</ButtonText>
            </Button>
            <Button
              className='rounded-lg'
              variant='solid'
              action='primary'
              size='lg'
              onPress={handleSubmit}
            >
              <ButtonText>Hoàn thành</ButtonText>
            </Button>
          </View>
        </View>
      </MainContainer>
    </BaseScreenContainer>
  )
}