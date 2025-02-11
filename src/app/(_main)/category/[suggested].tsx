import { View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { ChevronLeftIcon, SearchIcon } from 'lucide-react-native'
import { router, useLocalSearchParams, usePathname } from 'expo-router'
import InputChip from '@/components/custom/InputChip'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CategoryService } from '@/api/CategoryService'
import { HouseTypeName } from '@/constants/data_enum'
import Loading from '@/components/feedback/Loading'
import { CategoryType } from '@/api/types/request'
import { useToast } from '@/components/ui/toast'
import CommonToast from '@/components/feedback/CommonToast'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import BackButton from '@/components/custom/BackButton'
import { BLANK_CATEGORY_DESC, BLANK_CATEGORY_NAME } from '@/constants/client'


export default function SuggestedCategories() {

  const currentPath = usePathname()
  const { suggested } = useLocalSearchParams()

  const queryClient = useQueryClient()

  //#region feedback
  const toast = useToast()
  const successToast = CommonToast({
    toast: toast,
    title: 'Khởi tạo thành công!',
    description: 'Khởi tạo danh mục thành công.',
    variant: 'success'
  })
  const errorToast = CommonToast({
    toast: toast,
    title: 'Khởi tạo thất bại!',
    description: 'Khởi tạo danh mục thất bại. Vui lòng thử lại!',
    variant: 'error'
  })
  const invalidToast = CommonToast({
    toast: toast,
    title: 'Hãy chọn ít nhất 1 danh mục đề xuất!',
    description: '',
    variant: 'error'
  })
  //#endregion

  const suggestedCategoriesQuery = useQuery({
    queryKey: ['suggested-categories', suggested],
    queryFn: () => CategoryService.getSuggestedCategories(suggested as string)
  })
  const createCategoriesMutation = useMutation({
    mutationFn: (categories: CategoryType[]) => CategoryService.createListCategories(categories),
    onSuccess: (res) => {
      if (res) {
        switch (res.status) {
          case 200:
          case 201:
            {
              successToast.handleToast()
              queryClient.refetchQueries({
                queryKey: ['categoryFullList']
              })
              router.replace('/(_main)/category')
              return
            }
        }
      }
      errorToast.handleToast()
    },
    onError: (err) => console.error(err)
  })

  const [chosenCategories, setChosenCategories] = useState<CategoryType[]>([])

  const handleChipClose = (index: number) => {
    setChosenCategories(prev => [...prev.slice(0, index), ...prev.slice(index + 1)])
  }

  const handleListItemChoosing = (item: CategoryType) => {
    setChosenCategories(prev => [...prev, item])
  }

  const handleSubmit = () => {
    if (chosenCategories.length === 0) {
      invalidToast.handleToast()
      return
    }
    createCategoriesMutation.mutate([{
      name: BLANK_CATEGORY_NAME,
      description: BLANK_CATEGORY_DESC,
      subCategories: [] as CategoryType[]
    } as CategoryType,
    ...chosenCategories])

  }

  const Item = ({ item }: { item: any }) => (
    <TouchableOpacity
      key={item.id}
      style={{ marginBottom: 8 }}
      className='w-auto px-4 py-2 rounded-lg flex flex-row justify-center border border-outline-100'
      onPress={() => handleListItemChoosing({
        name: item.name,
        description: '',
        subCategories: item.subCategories
      } as CategoryType)}
    >
      <Text className='text-lg  text-typography-800'>{item.name}</Text>
    </TouchableOpacity>
  )
  return (
    <BaseScreenContainer>
      {suggestedCategoriesQuery.isPending || createCategoriesMutation.isPending ?
        <Loading texts={[
          {
            condition: suggestedCategoriesQuery.isPending,
            text: 'Đang tải...'
          },
          {
            condition: createCategoriesMutation.isPending,
            text: 'Đang khởi tạo...'
          }
        ]} />
        :
        <View className="h-full flex flex-col gap-4 px-4 pb-8">
          <View className="py-4 flex flex-row gap-4 items-center">
            <BackButton backFn={() => router.back()} />
            <Text className='text-lg text-typography-600'>Đề xuất cho {HouseTypeName[`${suggested}` as keyof typeof HouseTypeName]}</Text>
          </View>
          <View className='grow flex flex-col gap-4'>
            <Text className='text-md font-semibold text-typography-800'>Danh mục đã chọn</Text>
            <ScrollView style={{ height: 50 }} overScrollMode='never'>
              <View
                style={{ flexWrap: 'wrap' }}
                className='flex flex-row items-start content-start gap-4'>
                {chosenCategories.map((i, index) =>
                  <InputChip
                    key={index}
                    text={i.name}
                    onClose={() => handleChipClose(index)}
                  />)}
              </View>
            </ScrollView>
            <View className='grow flex flex-col gap-2 items-center '>
              <Text className='text-md font-semibold  text-typography-600'>Đề xuất</Text>
              <FlatList
                className='h-40 self-stretch '
                data={suggestedCategoriesQuery
                  .data
                  .data
                  .items
                  .filter((i: any) => {
                    const includes = chosenCategories.find(it => it.name === i.name)
                    if (includes) return false
                    return true
                  })}
                renderItem={({ item }) => <Item item={item} />}
                keyExtractor={item => item.id}
                overScrollMode='never'
              ></FlatList>
              <Button
                className='self-stretch rounded-lg'
                action="primary"
                size="xl"
                onPress={handleSubmit}
              // isDisabled={chosenCategories.length}
              >
                <ButtonText>Hoàn thành</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      }

    </BaseScreenContainer>
  )
}