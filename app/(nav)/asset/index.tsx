
import { Button, ButtonText } from "@/components/ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator } from "@/components/ui/checkbox";
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SimpleWidget from "@/components/widget/SimpleWidget";
import { IMAGE_URL } from "@/constants/public";
import { Href, useRouter } from "expo-router";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { CheckIcon } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
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
  return (
    <SafeAreaView>
      <ScrollView className="flex flex-col gap-4 bg-white py-2 px-4">
        <View className="flex flex-col gap-4 mb-4">
          <SimpleWidget className="h-24" />
          <View className="flex flex-row gap-2">
            <Button size="lg" variant="solid" action="primary">
              <ButtonText>Thêm tài sản</ButtonText>
            </Button>
            <Button size="lg" variant="solid" action="secondary">
              <ButtonText>Nhập liệu</ButtonText>
            </Button>
          </View>
        </View>
        <ScrollView horizontal={true}>
          <View className="rounded-lg overflow-hidden">
            {/* <Table className='w-[800px] '>
              <TableHeader>
                <TableRow className="flex flex-row bg-background-100">
                  <TableHead className='w-1/12'>
                    <Checkbox
                      size="md"
                      isInvalid={false}
                      isDisabled={false}
                      value="s"
                    >
                      <CheckboxIndicator>
                        <CheckboxIcon as={CheckIcon} />
                      </CheckboxIndicator>
                    </Checkbox>
                  </TableHead>
                  <TableHead className="">
                    <Text className="text-md font-bold text-typography-900">
                      Tên
                    </Text>
                  </TableHead>
                  <TableHead>
                    <Text className="text-md font-bold text-typography-900">
                      Danh mục
                    </Text>
                  </TableHead>
                  <TableHead>
                    <Text className="text-md font-bold text-typography-900">
                      Trạng thái
                    </Text>
                  </TableHead>
                  <TableHead>
                    <Text className="text-md font-bold text-typography-900">
                      Mô tả
                    </Text>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((i, index) => (
                  <Pressable
                    key={index}
                    onPress={() => router.push(`/asset/${index}`)}
                  >
                    <TableRow className="flex flex-row">
                      <TableData>
                        <Checkbox
                          size="md"
                          isInvalid={false}
                          isDisabled={false}
                          value="s"
                        >
                          <CheckboxIndicator>
                            <CheckboxIcon as={CheckIcon} />
                          </CheckboxIndicator>
                        </Checkbox>
                      </TableData>
                      <TableData className="h-40">
                        <Image
                          className="h-[40px] w-[40px] rounded-md"
                          source={require("@/assets/images/dreamlike.png")}
                          alt="image"
                        />
                        <Text className="ml-2 text-md font-normal text-typography-900">
                          {i.name}
                        </Text>
                      </TableData>
                      <TableData>
                        <Text className="text-md font-normal text-typography-900">
                          {i.category}
                        </Text>
                      </TableData>
                      <TableData>
                        <Text className="text-md font-normal text-typography-900">
                          {i.state}
                        </Text>
                      </TableData>
                      <TableData>
                        <Text className="text-md font-normal text-typography-900">
                          {i.desc}
                        </Text>
                      </TableData>
                    </TableRow>
                  </Pressable>
                ))}
              </TableBody>
            </Table> */}
            <View className="flex flex-row w-[800px]">
              <View className="flex flex-col w-16">
                <View className='px-6 py-4 bg-background-100 h-14'>
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
                <View className='px-6 py-4 bg-background-100 h-14'>
                  <Text className="text-md font-bold text-typography-900">
                    Tên
                  </Text>
                </View>
                {tableData.map((i, index) =>
                  <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100 gap-2'>
                    <Image
                      className="h-[40px] w-[40px] rounded-md"
                      source={require("@/assets/images/dreamlike.png")}
                      alt="image"
                    />
                    <Text className="text-md font-normal text-typography-900">
                      {i.name}
                    </Text>
                  </View>
                )}
              </View>
              <View className="flex flex-col grow">
                <View className='px-6 py-4 bg-background-100 h-14'>
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
                <View className='px-6 py-4 bg-background-100 h-14'>
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
                <View className='px-6 py-4 bg-background-100 h-14'>
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


              {/* <View className="flex flex-row bg-background-100" >
                <View className='px-6 py-4 w-16'>
                  <Checkbox
                    size="md"
                    isInvalid={false}
                    isDisabled={false}
                    value="s"
                  >
                    <CheckboxIndicator>
                      <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                  </Checkbox>
                </View>
                <View className='px-6 py-4 grow'>
                  <Text className="text-md font-bold text-typography-900">
                    Tên
                  </Text>
                </View>
                <View className='px-6 py-4 grow'>
                  <Text className="text-md font-bold text-typography-900">
                    Danh mục
                  </Text>
                </View>
                <View className='px-6 py-4 grow'>
                  <Text className="text-md font-bold text-typography-900">
                    Trạng thái
                  </Text>
                </View>
                <View className='px-6 py-4 grow'>
                  <Text className="text-md font-bold text-typography-900">
                    Mô tả
                  </Text>
                </View>
              </View>
              <View className="flex flex-col">
                {tableData.map((i, index) => (
                  <Pressable
                    className="flex flex-row"
                    key={index}
                    onPress={() => router.push(`/asset/${index}`)}
                  >
                    <View className='px-6 py-4 w-16'>
                      <Checkbox
                        size="md"
                        isInvalid={false}
                        isDisabled={false}
                        value="s"
                      >
                        <CheckboxIndicator>
                          <CheckboxIcon as={CheckIcon} />
                        </CheckboxIndicator>
                      </Checkbox>
                    </View>
                    <View className="flex flex-row items-center gap-2 px-6 py-4 grow bg-slate-200">
                      <Image
                        className="h-[40px] w-[40px] rounded-md"
                        source={require("@/assets/images/dreamlike.png")}
                        alt="image"
                      />
                      <Text className="text-md font-normal text-typography-900">
                        {i.name}
                      </Text>
                    </View>
                    <View className='px-6 py-4 grow'>
                      <Text className="text-md font-normal text-typography-900">
                        {i.category}
                      </Text>
                    </View>
                    <View className='px-6 py-4 grow'>
                      <Text className="text-md font-normal text-typography-900">
                        {i.state}
                      </Text>
                    </View>
                    <View className='px-6 py-4 grow'>
                      <Text className="text-md font-normal text-typography-900">
                        {i.desc}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View> */}
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
