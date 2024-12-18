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
import React from "react";
import { Modal, ModalBackdrop, ModalBody, ModalContent } from "@/components/ui/modal";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { Image } from "@/components/ui/image";
import { router, useLocalSearchParams } from "expo-router";
import { HouseType } from "@/api/CategoryService";

type CategoryTableCols = {
  name: string,
  desc: string,
  numberOfAssets: number,
  parentName: string,
}
const tableData: CategoryTableCols[] = [
  {
    name: "Device",
    desc: "abcdxyz@!#$%^",
    numberOfAssets: 2,
    parentName: "Thiết bị phòng ăn"
  },
  {
    name: "Device",
    desc: "abcdxyz@!#$%^",
    numberOfAssets: 2,
    parentName: "Thiết bị phòng ăn"
  },
  {
    name: "Device",
    desc: "abcdxyz@!#$%^",
    numberOfAssets: 2,
    parentName: "Thiết bị phòng ăn"
  },
  {
    name: "Device",
    desc: "abcdxyz@!#$%^",
    numberOfAssets: 2,
    parentName: "Thiết bị phòng ăn"
  },
  {
    name: "Device",
    desc: "abcdxyz@!#$%^",
    numberOfAssets: 2,
    parentName: "Thiết bị phòng ăn"
  },
  {
    name: "Device",
    desc: "abcdxyz@!#$%^",
    numberOfAssets: 2,
    parentName: "Thiết bị phòng ăn"
  },
  {
    name: "Device",
    desc: "abcdxyz@!#$%^",
    numberOfAssets: 2,
    parentName: "Thiết bị phòng ăn"
  },
  {
    name: "Device",
    desc: "abcdxyz@!#$%^",
    numberOfAssets: 2,
    parentName: "Thiết bị phòng ăn"
  },
  {
    name: "Device",
    desc: "abcdxyz@!#$%^",
    numberOfAssets: 2,
    parentName: "Thiết bị phòng ăn"
  },
];


const HouseTypeName = [
  "Nhà cấp 1",
  "Nhà cấp 2",
  "Nhà cấp 3",
  "Nhà cấp 4",
]


export default function Categories() {
  const [page, setPage] = React.useState(1)
  const [showModal, setShowModal] = React.useState(false)
  const { state } = useLocalSearchParams()
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
        {HouseTypeName.map((i, index) => (
          <Button
            key={index}
            className="self-stretch"
            variant="solid"
            action="secondary"
            size='lg'
            onPress={() => router.navigate(`/(nav)/categories/${HouseType.at(index)}`)}
          >
            <ButtonText>{i}</ButtonText>
          </Button>
        ))}
      </View>
    </View>
  )

  const DefaultView = () => (
    <ScrollView className="my-4 px-4">
      <View className="flex flex-col gap-4">
        <View className="flex flex-col gap-4">
          <View className="flex flex-row gap-2 justify-center">
            <Button className="" size="lg" variant="outline" action="primary">
              <ButtonIcon as={AddIcon} />
              <ButtonText>Thêm danh mục</ButtonText>
            </Button>
          </View>
          <SimpleWidget className="h-24" label="Số lượng" />
        </View>
        <Input
          variant="outline"
          size="lg"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputSlot className="pl-3">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField placeholder="Tìm kiếm" />
        </Input>
        <View className="flex flex-row gap-4 justify-end">
          <Select className="basis-1/2">
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
                <SelectItem label="UX Research" value="ux" />
                <SelectItem label="Web Development" value="web" />
                <SelectItem
                  label="Cross Platform Development Process"
                  value="Cross Platform Development Process"
                />
                <SelectItem label="UI Designing" value="ui" isDisabled={true} />
                <SelectItem label="Backend Development" value="backend" />
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>
        <View className="flex flex-row justify-center">
          <Pagination quantity={10} active={page} onChange={setPage} />
        </View>
        <ScrollView horizontal={true} >
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
                {tableData.map((i, index) =>
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
                {tableData.map((i, index) =>
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
                {tableData.map((i, index) =>
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
                    Dang mục cha
                  </Text>
                </View>
                {tableData.map((i, index) =>
                  <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                    <Text className="text-md font-normal text-typography-900">
                      {i.parentName}
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
                {tableData.map((i, index) =>
                  <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                    <Text className="text-md font-normal text-typography-900">
                      {i.desc}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  )

  return (
    <SafeAreaView className='h-full bg-white'>
      {state !== 'old' ? <NewAccessView /> : <DefaultView />}

    </SafeAreaView>
  );
}
