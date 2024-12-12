
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator } from "@/components/ui/checkbox";
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SimpleWidget from "@/components/widget/SimpleWidget";
import { IMAGE_URL } from "@/constants/public";
import { Href, useRouter } from "expo-router";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { BoxIcon, CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useState } from "react";
import Pagination from "@/components/custom/Pagination";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useHeaderHeight } from '@react-navigation/elements';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@/components/ui/select";
const tableData = [
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
  {
    img: "@/assets/images/dreamlike.png",
    name: "Device",
    category: "Electrical",
    state: "Đang dùng",
    desc: "abcdxyz@!#$%^",
  },
];
export default function Assets() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView className='flex flex-col pb-2 px-4'>
        <View className="flex flex-col gap-4 mb-4">
          <View className="flex flex-row gap-2">
            <Button className="grow" size="lg" variant="outline" action="secondary">
              <ButtonText>Nhập liệu</ButtonText>
            </Button>
            <Button className="grow" size="lg" variant="solid" action="primary">
              <ButtonIcon as={BoxIcon} />
              <ButtonText>Thêm tài sản</ButtonText>
            </Button>
          </View>
          <SimpleWidget className="h-24" label="Số lượng" />
        </View>
        <Input
          className="mb-4"
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
        <View className="flex flex-row gap-4">
          <Select className="grow">
            <SelectTrigger variant="outline" size="lg">
              <SelectInput placeholder="Danh mục" />
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
          <Select className="grow">
            <SelectTrigger variant="outline" size="lg">
              <SelectInput placeholder="Trạng thái" />
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
                  <Pressable
                    key={index}
                    className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100 gap-2'
                    onPress={() => router.push(`/asset/${index}`)}
                  >
                    <Image
                      className="h-[40px] w-[40px] rounded-md"
                      source={require("@/assets/images/dreamlike.png")}
                      alt="image"
                    />
                    <Text className="text-md font-normal text-typography-900">
                      {i.name}
                    </Text>
                  </Pressable>
                )}
              </View>
              <View className="flex flex-col grow">
                <View className='px-6 py-4 bg-background-50 h-14'>
                  <Text className="text-md font-bold text-typography-900">
                    Danh mục
                  </Text>
                </View>
                {tableData.map((i, index) =>
                  <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                    <Text className="text-md font-normal text-typography-900">
                      {i.category}
                    </Text>
                  </View>
                )}
              </View>
              <View className="flex flex-col grow">
                <View className='px-6 py-4 bg-background-50 h-14'>
                  <Text className="text-md font-bold text-typography-900">
                    Trạng thái
                  </Text>
                </View>
                {tableData.map((i, index) =>
                  <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                    <Text className="text-md font-normal text-typography-900">
                      {i.state}
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
      </ScrollView>
    </SafeAreaView>
  );
}
