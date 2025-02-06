import Tabs from "@/components/nav/Tabs";
import { TabItemType } from "@/constants/types";
import { Stack, useLocalSearchParams, useNavigation, usePathname, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View, SafeAreaView } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements';
import { Icon } from "@/components/ui/icon";
import { ChevronDownIcon, ChevronLeftIcon, CopyIcon, EditIcon, HeartCrackIcon, QrCodeIcon, ReplaceIcon, TrashIcon } from "lucide-react-native";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "@/components/ui/menu";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AssetService } from "@/api/AssetService";
import { Spinner } from "@/components/ui/spinner";
import Loading from "@/components/feedback/Loading";
import BackButton from "@/components/custom/BackButton";
import StatusUpdateModal from "@/components/custom/StatusUpdateModal";
import { AssetType } from "@/api/types/request";

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
];
export default function AssetDetailsLayout() {
  const router = useRouter()
  const pathName = usePathname()
  const navigation = useNavigation()

  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false)
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
  const updateAssetMutation = useMutation({
    mutationFn: (payload: AssetType) => AssetService.updateAsset(asset_id as string, payload),
    onSuccess: (res) => {
      setShowStatusUpdateModal(false)
      assetQuery.refetch()
    }
  })
  const deleteAssetMutation = useMutation({
    mutationFn: (id: string) => AssetService.deleteAsset(id),
    onSuccess: (res) => {
      router.navigate('/(_main)/asset')
    },
    onError: (err) => { }
  })
  // useEffect(() => {
  //   console.log(assetQuery.data)
  // }, [assetQuery])
  return (
    <SafeAreaView className="h-full bg-white">
      {assetQuery.isFetched && <StatusUpdateModal
        showModal={showStatusUpdateModal}
        setShowModal={setShowStatusUpdateModal}
        data={assetQuery.data.data.status}
        updateFn={(status: string) => {
          if (status === assetQuery?.data.data.status) return
          console.log()
          updateAssetMutation.mutate({
            name: assetQuery?.data.data.name,
            description: assetQuery?.data.data.description,
            images: assetQuery?.data.data.images,
            purchaseDate: assetQuery?.data.data.purchaseDate,
            purchasePlace: assetQuery?.data.data.purchasePlace,
            purchasePrice: assetQuery?.data.data.purchasePrice,
            brand: assetQuery?.data.data.brand,
            serialNumber: assetQuery?.data.data.serialNumber,
            locationId: assetQuery?.data.data.location ? assetQuery?.data.data.location.id : null,
            warrantyExpiryDate: assetQuery?.data.data.warrantyExpiryDate ?
              assetQuery?.data.data.warrantyExpiryDate : null,
            documents: assetQuery?.data.data.documents,
            status: status,
            maintenanceCycle: assetQuery?.data.data.maintenanceCycle || null,
            categoryId: assetQuery?.data.data.category.id
          } as AssetType)
        }}
        loading={updateAssetMutation.isPending}
      />}


      {!pathName.endsWith('update') &&
        <View className="bg-white h-[48px] px-4 pt-2 pb-4 flex flex-row justify-between items-center">
          <BackButton backFn={() => {
            router.back()
          }} />
          <View className="flex flex-row gap-4">
            <Button
              variant="outline"
              action="default"
              className="border-outline-200 px-2"
            >
              <ButtonIcon as={QrCodeIcon} className="h-8 w-8 text-typography-700" />
            </Button>
            <Menu
              placement="bottom right"
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
              <MenuItem key="ChangeStatus" textValue="ChangeStatus"
                onPress={() => setShowStatusUpdateModal(true)}>
                <Icon as={ReplaceIcon} size="md" className="mr-2" />
                <MenuItemLabel size="lg">Thay đổi trạng thái</MenuItemLabel>
              </MenuItem>
              <MenuSeparator />
              <MenuItem key="Edit" textValue="Edit" onPress={() => router.push({
                pathname: '/(_main)/asset/[asset_id]/update',
                params: {
                  asset_id: asset_id as string
                }
              })}>
                <Icon as={EditIcon} size="md" className="mr-2" />
                <MenuItemLabel size="lg">Chỉnh sửa</MenuItemLabel>
              </MenuItem>
              <MenuItem key="Delete" textValue="Delete">
                <Icon as={TrashIcon} size="md" className="mr-2" />
                <MenuItemLabel size="lg">Xóa</MenuItemLabel>
              </MenuItem>
            </Menu>
          </View>
        </View>}

      {!pathName.endsWith('update') &&
        <View className="bg-white h-[40px]">
          <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <Tabs data={tabData} onPress={handlePress} />
          </ScrollView>
        </View>}

      {assetQuery.isPending || assetQuery.isRefetching ?
        <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
        :
        <Stack screenOptions={{
          headerShown: false,
          animation: 'fade',
        }} />
      }
    </SafeAreaView>
  )
}
