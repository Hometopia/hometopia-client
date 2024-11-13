
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
          <Table className='w-[600px]'>
            {/* <TableHeader>
              <TableRow className="bg-background-100">
                <TableData className='w-[40px]'>
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
                <TableHead>
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
            </TableHeader> */}
            <TableBody>
              {tableData.map((i, index) => (
                <Pressable
                  key={index}
                  onPress={() => router.push(`/asset/${index}`)}
                >
                  <TableRow className='w-full'>
                    <TableData className="w-1/8">
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
                    <TableData className="w-4/5 flex flex-row items-center gap-2">
                      <Image
                        className="h-[40px] w-[40px] rounded-md"
                        source={require("@/assets/images/dreamlike.png")}
                        alt="image"
                      />
                      <Text className="text-md font-normal text-typography-900">
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
          </Table>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
