import Tabs from "@/components/nav/Tabs";
import { TabItemType } from "@/constants/types";
import { Href, Stack, useLocalSearchParams, useNavigation, usePathname, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View, SafeAreaView, BackHandler } from "react-native";
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
import BaseScreenContainer from "@/components/container/BaseScreenContainer";
import DeleteDialog from "@/components/custom/DeleteDialog";
import QRGenerateButton from "@/components/custom/QRButton";

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

  //
  const { asset_id, redirect, data } = useLocalSearchParams()

  //
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
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
  // 
  const backFn = () => {
    if (redirect) {
      router.navigate({
        pathname: '/(_main)/calendar/[schedule_details]',
        params: {
          schedule_details: redirect as string,
          data: data,
          from: 'asset-back'
        }
      })
    }
    else
      router.back()
  }
  useEffect(() => {
    const backAction = () => {
      backFn()
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => backHandler.remove()
  }, [])
  return (
    <BaseScreenContainer>
      <DeleteDialog text='lịch'
        show={showDeleteDialog}
        setShow={setShowDeleteDialog}
        deleteFn={() => {
          deleteAssetMutation.mutate(asset_id as string)
        }} />

      {assetQuery.isFetched && <StatusUpdateModal
        showModal={showStatusUpdateModal}
        setShowModal={setShowStatusUpdateModal}
        data={assetQuery.data.data.status}
        updateFn={(status: string) => {
          if (status === assetQuery?.data.data.status) return
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
        <View className="px-4 py-4 flex flex-row justify-between items-center">
          <BackButton backFn={() => backFn()} />
          <View className="flex flex-row gap-4">
            <QRGenerateButton
              name={assetQuery.isFetched ? assetQuery.data.data.name : ''}
              uri={`(_main)/asset/${asset_id as string}`}
              size='xl' />

            <Menu
              placement="bottom right"
              offset={5}
              disabledKeys={['Settings']}
              trigger={({ ...triggerProps }) => {
                return (
                  <Button
                    variant="outline"
                    action="default"
                    className="border-outline-200 rounded-lg"
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
              <MenuSeparator className="my-2" />
              <MenuItem key="Edit" textValue="Edit" onPress={() => router.push({
                pathname: '/(_main)/asset/[asset_id]/update',
                params: {
                  asset_id: asset_id as string
                }
              })}>
                <Icon as={EditIcon} size="md" className="mr-2" />
                <MenuItemLabel size="lg">Chỉnh sửa</MenuItemLabel>
              </MenuItem>
              <MenuItem key="Delete" textValue="Delete" onPress={() => setShowDeleteDialog(true)}>
                <Icon as={TrashIcon} size="md" className="mr-2 text-error-400" />
                <MenuItemLabel className='text-error-400' size="lg">Xóa</MenuItemLabel>
              </MenuItem>
            </Menu>
          </View>
        </View>}

      {!pathName.endsWith('update') &&
        <View className="h-[40px]">
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
    </BaseScreenContainer>
  )
}
