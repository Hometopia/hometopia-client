
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Checkbox, CheckboxGroup, CheckboxIcon, CheckboxIndicator } from "@/components/ui/checkbox";
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SimpleWidget from "@/components/widget/SimpleWidget";
import { IMAGE_URL } from "@/constants/public";
import { Href, useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { BoxIcon, CheckIcon, ChevronDownIcon, ChevronLeftIcon, LaughIcon, SearchIcon, Smile, TrashIcon } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Key, useCallback, useEffect, useState } from "react";
import Pagination from "@/components/custom/Pagination";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useHeaderHeight } from '@react-navigation/elements';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AssetService } from "@/api/AssetService";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { primaryColor } from "@/constants/color";
import { AssetListResponseType, CategoryResponseType } from "@/api/types/response";
import CategoryPickerModal from "@/components/custom/CategoryPickerModal";
import { AssetStatusList, AssetStatusListMapToDisplayText } from "@/constants/data_enum";
import { CategoryService } from "@/api/CategoryService";
import UpcomingFeaturePopover from "@/components/custom/UpcomingFeaturePopover";
import { FileService } from "@/api/FileService";
import { BASE_URL } from "@/constants/server";
import { Icon } from "@/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { useToast } from "@/components/ui/toast";
import CommonToast from "@/components/feedback/CommonToast";
import ConfirmModal from "@/components/custom/ConfirmModal";
import Loading from "@/components/feedback/Loading";

export default function Assets() {
  useFocusEffect(useCallback(() => {
    assetListQuery.refetch()
  }, []))
  const router = useRouter()

  const skeletonNumber = 5

  const [categoryModalShow, setCategoryModalShow] = useState(false)

  const [data, setData] = useState<AssetListResponseType>()

  //useStates for pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  //useStates for filter
  const [category, setCategory] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  // // this's actually for search, but it's included in filter param
  const [name, setName] = useState<string>('')
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  //useState for checkbox
  const [check, setCheck] = useState<string[]>([])

  //fb
  const toast = useToast()
  const deleteSuccessToast = CommonToast({
    toast: toast,
    title: 'Xoá thành công',
    description: '',
    variant: 'success'
  })
  const deleteErrorToast = CommonToast({
    toast: toast,
    title: 'Xóa thất bại',
    description: '',
    variant: 'error'
  })
  // modals
  const DeleteAssetModal = ConfirmModal({
    title: "Xác nhận xóa",
    desc: 'Xác nhận xóa các tài sản đã chọn. Hành động này không thể hoàn tác.',
    confirmFn: () => {
      deleteAssetList.mutate(check)
    }
  })
  //queries
  const assetListQuery = useQuery({
    queryKey: [
      'assetList',
      page,
      pageSize,
      category,
      status,
      name,
    ],
    queryFn: () => AssetService.getAssetList(page, pageSize, category, status, name),
  })

  const categoryFullList = useQuery({
    queryKey: ['categoryFullList'],
    queryFn: CategoryService.getAllCategory,
  })

  const deleteAssetList = useMutation({
    mutationFn: (ids: string[]) => AssetService.deleteListAsset(ids),
    onSuccess: (res) => {
      assetListQuery.refetch()
      setCheck([])
    },
    onError: (err) => { deleteErrorToast.handleToast() }
  })

  useEffect(() => {
    if (assetListQuery.isFetched) {
      setData(assetListQuery.data.data)
    }
  }, [assetListQuery])


  const getCategoryName = (): string => {
    return categoryFullList.data?.data.items.find((i: CategoryResponseType) => i.id === category)?.name
  }

  return (
    <SafeAreaView className="h-full bg-white relative">
      {deleteAssetList.isPending && <Loading texts={[{
        condition: true,
        text: 'Đang xóa...'
      }]} />}
      <ScrollView className='pb-2 px-4' overScrollMode='never'>
        <View style={{ paddingTop: 8 }} className="flex flex-col gap-4">
          <View className="flex flex-col gap-4">
            <View className="flex flex-row gap-2">
              <UpcomingFeaturePopover
                trigger={
                  <Button className="grow" size="lg" variant="outline" action="secondary">
                    <ButtonText>Nhập liệu</ButtonText>
                  </Button>
                }
              />

              <Button className="grow" size="lg" variant="solid" action="primary"
                onPress={() => router.push('/(nav)/asset/create-asset')}
              >
                <ButtonIcon as={BoxIcon} />
                <ButtonText>Thêm tài sản</ButtonText>
              </Button>
            </View>
            <SimpleWidget
              className="h-24"
              label="Số lượng"
              number={data?.totalItems} />
          </View>
          <Input
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
          </Input>
          <View className="flex flex-col gap-4">
            <CategoryPickerModal
              showModal={categoryModalShow}
              setShowModal={setCategoryModalShow}
              data={categoryFullList.data?.data.items as CategoryResponseType[]}
              pickFn={setCategory}
            />
            <Input
              isReadOnly={true}
              variant="outline"
              size="lg"
              onTouchEnd={() => setCategoryModalShow(true)}
            >
              <InputField placeholder="Danh mục" value={getCategoryName()} />
              <InputSlot >
                <InputIcon className="mr-3" as={ChevronDownIcon} />
              </InputSlot>
            </Input>
            <Select
              selectedValue={status}
              initialLabel="Tất cả"
              onValueChange={(v) => setStatus(v)}
            >
              <SelectTrigger variant="outline" size="lg" className="flex flex-row justify-between">
                <SelectInput placeholder="Trạng thái" />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem
                    value=""
                    label="Tất cả"
                  />
                  {AssetStatusList.map((i, index) => (
                    <SelectItem
                      key={i}
                      value={i}
                      label={AssetStatusListMapToDisplayText[i as keyof typeof AssetStatusListMapToDisplayText] || i}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </View>
          <View className="flex flex-row justify-end">
            {/* <Input className="w-16" variant="outline" size="lg">
              <InputField
                inputMode='numeric'
                value={pageSize.toString()}
                onChangeText={(v) => {
                  if(Number(v) < 1){
                    
                  }
                }}
                onSubmitEditing={() => setName(searchInputValue)}
                returnKeyType='done'
              />
            </Input> */}
            <DeleteAssetModal.modal />
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
              <MenuItem key="Delete" textValue="Delete"
                onPress={() => {
                  if (check.length) {
                    DeleteAssetModal.setShowModal(true)
                  }
                }}>
                <Icon as={TrashIcon} size="md" className="mr-2" />
                <MenuItemLabel size="lg">Xóa</MenuItemLabel>
              </MenuItem>
            </Menu>
          </View>
          <View className="flex flex-row justify-center">
            {assetListQuery.isPending ?
              <Spinner size='small' className="text-primary-400" />
              :
              data?.totalPages ?
                <Pagination quantity={data?.totalPages || 0} active={page} onChange={setPage} />
                :
                <View></View>
            }
          </View>

          {assetListQuery.isPending ?
            <VStack className="gap-4">
              {Array.from({ length: skeletonNumber }, (_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  speed={4}
                  startColor="bg-background-100"
                  className="h-14" />
              ))}
            </VStack>
            :
            (assetListQuery.data.data?.totalItems > 0) ?
              <ScrollView
                horizontal={true}
                overScrollMode='never'
              >
                <View className=" rounded-lg overflow-hidden">
                  <View className="flex flex-row w-[800px]">
                    <View className="flex flex-col w-16">
                      <View className='px-6 py-4 bg-background-50 h-14'>
                        <Checkbox
                          size="lg"
                          value="all"
                          onChange={(isSelected: boolean) => {
                            if (isSelected) {
                              setCheck(data ? data?.items.map(i => i.id) : [])
                            }
                            else {
                              setCheck([])
                            }
                          }}
                        >
                          <CheckboxIndicator>
                            <CheckboxIcon as={CheckIcon} />
                          </CheckboxIndicator>
                        </Checkbox>
                      </View>
                      <CheckboxGroup
                        value={check}
                        onChange={(keys) => {
                          setCheck(keys)
                        }}
                      >
                        {data?.items.map((i, index) =>
                          <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                            <Checkbox
                              size="lg"
                              value={i.id}
                            >
                              <CheckboxIndicator>
                                <CheckboxIcon as={CheckIcon} />
                              </CheckboxIndicator>
                            </Checkbox>
                          </View>
                        )}
                      </CheckboxGroup>
                    </View>
                    <View className="flex flex-col grow">
                      <View className='px-6 py-4 bg-background-50 h-14'>
                        <Text className="text-md font-bold text-typography-900">
                          Tên
                        </Text>
                      </View>
                      {data?.items.map((i, index) =>
                        <Pressable
                          key={index}
                          className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100 gap-2'
                          onPress={() => router.push(`/asset/${i.id}`)}
                        >
                          {i.images[0] !== null &&
                            <Image
                              className="h-[40px] w-[40px] rounded-md"
                              source={{ uri: `${BASE_URL}/files?fileName=${i.images[0].fileName}` }}
                              alt="image"
                            />}


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
                      {data?.items.map((i, index) =>
                        <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                          <Text className="text-md font-normal text-typography-900">
                            {i.category.name}
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
                      {data?.items.map((i, index) =>
                        <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
                          <Text className="text-md font-normal text-typography-900">
                            {AssetStatusListMapToDisplayText[i.status as keyof typeof AssetStatusListMapToDisplayText]}
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
                      {data?.items.map((i, index) =>
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
              :
              <View className="flex flex-col justify-between items-center gap-2 px-4 py-6 rounded-lg bg-primary-50">
                <Icon as={LaughIcon} className="text-primary-400" size='xl' />
                <Text className="text-lg text-primary-500">
                  Chưa có tài sản nào. Tạo một cái đi !
                </Text>
              </View>
          }
        </View>
      </ScrollView>
    </SafeAreaView >
  );
}
