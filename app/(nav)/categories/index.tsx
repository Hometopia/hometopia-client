import { View, SafeAreaView, ScrollView } from "react-native";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { CheckIcon, ChevronDownIcon, SearchIcon, TagIcon } from "lucide-react-native";
import SimpleWidget from "@/components/widget/SimpleWidget";
import { AddIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@/components/ui/select";
import { Checkbox, CheckboxIcon, CheckboxIndicator } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import Pagination from "@/components/custom/Pagination";
import React, { useCallback } from "react";
import { Modal, ModalBackdrop, ModalBody, ModalContent } from "@/components/ui/modal";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { Image } from "@/components/ui/image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { HouseType, HouseTypeName } from "@/constants/data_enum";
import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/api/CategoryService";
import { CategoryResponseType } from "@/api/types/response";
import Loading from "@/components/feedback/Loading";



export default function Categories() {

  useFocusEffect(useCallback(() => {
    // categoryListQuery.refetch()
    categoryFullList.refetch()
  }, []))
  //useStates for pagination
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  //useStates for filter
  const [parent, setParent] = React.useState<string>('')
  // // this's actually for search, but it's included in filter param
  const [name, setName] = React.useState<string>('')
  const [searchInputValue, setSearchInputValue] = React.useState<string>('')
  //queries
  const categoryFullList = useQuery({
    queryKey: ['categoryFullList'],
    queryFn: CategoryService.getAllCategory,
  })
  const categoryListQuery = useQuery({
    queryKey: ['category-list',
      page, pageSize, parent, name
    ],
    queryFn: () => CategoryService.getCategoryList(
      page,
      pageSize,
      parent,
      name
    ),
    enabled: (categoryFullList.isFetched && categoryFullList.data?.data?.totalItems !== 0)
  })
  const parentListQuery = useQuery({
    queryKey: ['parent-categories'],
    queryFn: () => CategoryService.getParentList(),
    enabled: (categoryListQuery.isFetched)
  })

  const [showModal, setShowModal] = React.useState(false)
  const HouseClassifiModal = () => (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false)
      }}
    >
      <ModalBackdrop />
      <View className="bg-transparent h-[14rem] rounded-lg">
        <ReactNativeZoomableView
          maxZoom={2}
          minZoom={0.8}
          zoomStep={0.5}
          initialZoom={1}
          bindToBorders={true}
        >
          <Image
            className="w-[30rem] h-[14rem]"
            source={require("@/assets/images/housing-classification.png")}
            alt="onboarding-img"
          />
        </ReactNativeZoomableView>
      </View>
    </Modal>
  )

  const NewAccessView = () => (
    <View className="h-full flex flex-col gap-4 justify-center items-center px-4">
      <View className="flex flex-col items-center ">
        <Text className="text-xl font-bold">Chọn quy mô căn nhà của bạn.</Text>
        <View className="flex flex-row gap-0 items-center justify-center">
          <Text className="text-lg">Xem tham khảo </Text>
          <Button
            variant="link"
            action="primary"
            onPress={() => setShowModal(true)}
          >
            <ButtonText className="text-lg text-primary-400">ở đây</ButtonText>
          </Button>
        </View>
        <HouseClassifiModal />
      </View>
      <View className="flex flex-col gap-4 self-stretch">
        {HouseType.map((i: string, index) => (
          <Button
            key={index}
            className="self-stretch"
            variant="solid"
            action="secondary"
            size='lg'
            onPress={() => router.navigate(`/(nav)/categories/${i}`)}
          >
            <ButtonText>{HouseTypeName[`${i}` as keyof typeof HouseTypeName]}</ButtonText>
          </Button>
        ))}
      </View>
    </View>
  )

  // const DefaultView = () => (

  // )

  return (
    <SafeAreaView className='h-full bg-white'>
      {categoryFullList.isPending ?
        <Loading
          texts={[{
            condition: categoryFullList.isPending,
            text: "Đang tải..."
          }]}
        />
        :
        (categoryFullList.data?.data?.totalItems === 0) ?
          <NewAccessView />
          :
          <ScrollView className="my-4 px-4" overScrollMode="never">
            <View className="flex flex-col gap-4">
              <View className="flex flex-col gap-4">
                <View className="flex flex-row gap-2 justify-center">
                  <Button
                    className="self-stretch"
                    size="lg"
                    variant="solid"
                    action="primary"
                    onPress={() => router.push('/(nav)/categories/create-category')}
                  >
                    <ButtonIcon as={AddIcon} />
                    <ButtonText>Thêm danh mục</ButtonText>
                  </Button>
                </View>
                <SimpleWidget
                  className="h-24"
                  label="Số lượng"
                  number={categoryListQuery.data?.data?.totalItems}
                />

              </View>
              {/* <Input
                variant="outline"
                size="lg"
              >
                <InputSlot className="pl-3">
                  <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField
                  type='text'
                  placeholder="Tìm kiếm"
                  value={searchInputValue}
                  onChangeText={setSearchInputValue}
                  onSubmitEditing={() => setName(searchInputValue)}
                  returnKeyType="search"
                />
              </Input> */}
              <Select
              >
                <SelectTrigger className="flex flex-row justify-between" variant="outline" size="lg">
                  <SelectInput placeholder="Danh mục cha" />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {
                      parentListQuery.isFetched && parentListQuery.data?.data?.items.map((i: any) => (
                        <SelectItem
                          key={i.id}
                          label={i.name}
                          value={i.id}
                        />
                      ))
                    }
                  </SelectContent>
                </SelectPortal>
              </Select>

              <ScrollView horizontal={true} overScrollMode="never">
                <View className="rounded-lg overflow-hidden">
                  <View className="flex flex-row w-[800px]">
                    <View className="flex flex-col w-16">
                      <View className='px-6 py-4 bg-background-50 h-14'>
                        <Checkbox
                          size="lg"
                          isInvalid={false}
                          isDisabled={false}
                          value="s"
                        >
                          <CheckboxIndicator>
                            <CheckboxIcon as={CheckIcon} />
                          </CheckboxIndicator>
                        </Checkbox>
                      </View>
                      {categoryListQuery.data?.data?.items.map((i: CategoryResponseType, index: number) =>
                        <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                          <Checkbox
                            size="lg"
                            isInvalid={false}
                            isDisabled={false}
                            value="s"
                          >
                            <CheckboxIndicator>
                              <CheckboxIcon as={CheckIcon} />
                            </CheckboxIndicator>
                          </Checkbox>
                        </View>
                      )}
                    </View>
                    <View className="flex flex-col grow">
                      <View className='px-6 py-4 bg-background-50 h-14'>
                        <Text className="text-md font-bold text-typography-900">
                          Tên
                        </Text>
                      </View>
                      {categoryListQuery.data?.data?.items.map((i: CategoryResponseType, index: number) =>
                        <View
                          key={index}
                          className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100 gap-2'
                        >
                          <Text className="text-md font-normal text-typography-900">
                            {i.name}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View className="flex flex-col grow">
                      <View className='px-6 py-4 bg-background-50 h-14'>
                        <Text className="text-md font-bold text-typography-900">
                          Số lượng thiết bị
                        </Text>
                      </View>
                      {categoryListQuery.data?.data?.items.map((i: CategoryResponseType, index: number) =>
                        <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                          <Text className="text-md font-normal text-typography-900">
                            {i.numberOfAssets}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View className="flex flex-col grow">
                      <View className='px-6 py-4 bg-background-50 h-14'>
                        <Text className="text-md font-bold text-typography-900">
                          Danh mục cha
                        </Text>
                      </View>
                      {categoryListQuery.data?.data?.items.map((i: CategoryResponseType, index: number) =>
                        <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                          <Text className="text-md font-normal text-typography-900">
                            {i.parent.name}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View className="flex flex-col grow">
                      <View className='px-6 py-4 bg-background-50 h-14'>
                        <Text className="text-md font-bold text-typography-900">
                          Mô tả
                        </Text>
                      </View>
                      {categoryListQuery.data?.data?.items.map((i: CategoryResponseType, index: number) =>
                        <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                          <Text className="text-md font-normal text-typography-900">
                            {i.description}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </ScrollView>

      }
    </SafeAreaView>
  );
}
