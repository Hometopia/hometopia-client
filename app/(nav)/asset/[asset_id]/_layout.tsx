import Tabs from "@/components/nav/Tabs";
import { TabItemType } from "@/constants/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { ScrollView, View, SafeAreaView } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements';
import { Icon } from "@/components/ui/icon";
import { ChevronDownIcon, ChevronLeftIcon, CopyIcon, EditIcon, QrCodeIcon, TrashIcon } from "lucide-react-native";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { useQuery } from "@tanstack/react-query";
import { AssetService } from "@/api/AssetService";
import { Spinner } from "@/components/ui/spinner";

const tabData: TabItemType[] = [
  {
    slug: "general",
    label: "Thông tin chung",
  },
  {
    slug: "depreciation",
    label: "Khấu hao",
  },
  {
    slug: "lifecycle",
    label: "Vòng đời",
  },
  {
    slug: "maintenance",
    label: "Bảo trì",
  },
  {
    slug: "fix",
    label: "Sửa chữa",
  },
  {
    slug: "failure-symptom",
    label: "Triệu chứng hư hỏng",
  },
];
export default function AssetDetailsLayout() {
  const router = useRouter()
  //scroll..
  const scrollViewRef = useRef<ScrollView>(null)
  const handlePress = (index: number) => {
    const targetWidth = 80; // Chiều rộng ước tính của mỗi tab (có thể dùng `onLayout` để tính chính xác hơn)
    const offset = index * targetWidth;

    // Scroll đến vị trí mong muốn
    scrollViewRef.current?.scrollTo({
      x: offset,
      animated: true,
    });
  }

  //
  const { asset_id } = useLocalSearchParams()

  //
  const assetQuery = useQuery({
    queryKey: ['asset', asset_id],
    queryFn: () => AssetService.getAsset(asset_id as string),
  })

  // useEffect(() => {
  //   console.log(assetQuery.data)
  // }, [assetQuery])
  return (
    <SafeAreaView className="h-full bg-white">
      <View className="bg-white h-[48px] px-4 pt-2 pb-4 flex flex-row justify-between">
        <Button
          variant="outline"
          action="default"
          className="border-outline-200 p-2"
          onPress={() => router.back()}
        >
          <ButtonIcon as={ChevronLeftIcon} className="h-6 w-6 text-typography-700" />
        </Button>
        <View className="flex flex-row gap-4">
          <Button
            variant="outline"
            action="default"
            className="border-outline-200 px-2"
          >
            <ButtonIcon as={QrCodeIcon} className="h-8 w-8 text-typography-700" />
          </Button>
          <Menu
            placement="top"
            offset={5}
            disabledKeys={['Settings']}
            trigger={({ ...triggerProps }) => {
              return (
                <Button
                  variant="outline"
                  action="default"
                  className="border-outline-200"
                  {...triggerProps}
                >
                  <ButtonText className="text-typography-700 text-lg">Menu</ButtonText>
                  <ButtonIcon as={ChevronDownIcon} className="h-5 w-5 text-typography-700" />
                </Button>
              );
            }}
          >
            <MenuItem key="Edit" textValue="Edit">
              <Icon as={EditIcon} size="md" className="mr-2" />
              <MenuItemLabel size="lg">Chỉnh sửa</MenuItemLabel>
            </MenuItem>
            <MenuItem key="Duplicate" textValue="Duplicate">
              <Icon as={CopyIcon} size="md" className="mr-2" />
              <MenuItemLabel size="lg">Nhân bản</MenuItemLabel>
            </MenuItem>
            <MenuItem key="Delete" textValue="Delete">
              <Icon as={TrashIcon} size="md" className="mr-2" />
              <MenuItemLabel size="lg">Xóa</MenuItemLabel>
            </MenuItem>
          </Menu>
        </View>
      </View>

      <View className="bg-white h-[40px]">
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <Tabs data={tabData} onPress={handlePress} />
        </ScrollView>
      </View>

      {assetQuery.isPending || assetQuery.isRefetching ?
        <Spinner size='small' className="text-primary-400" />
        :
        <Stack screenOptions={{
          headerShown: false,
          animation: 'fade'
        }} />
      }

    </SafeAreaView>
  )
}
