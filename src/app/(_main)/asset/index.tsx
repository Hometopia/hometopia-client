import { FlatList, TouchableOpacity, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import MainContainer from '@/components/container/MainContainer'
import UpcomingFeaturePopover from '@/components/custom/UpcomingFeaturePopover'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { BoxIcon, ChevronDownIcon, FilterIcon, HeartIcon, PlusIcon, QrCodeIcon, SearchIcon } from 'lucide-react-native'
import { router } from 'expo-router'
import SimpleWidget from '@/components/widget/SimpleWidget'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab'
import { Text } from '@/components/ui/text'
import { Icon } from '@/components/ui/icon'
import { primaryColor } from '@/constants/color'
import { AssetResponseType, CategoryResponseType, PageResponseType, ResponseBaseType } from '@/api/types/response'
import { Image } from '@/components/ui/image'
import StatusBadge from '@/components/custom/StatusBadge'
import { AssetStatusList, AssetStatusListMapToDisplayText } from '@/constants/data_enum'
import AssetCard from '@/components/custom/AssetCard'
import Pagination from '@/components/custom/Pagination'
import CustomFilter from '@/components/custom/CustomFilter'
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select'
import CategoryPickerModal from '@/components/custom/CategoryPickerModal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CategoryService } from '@/api/CategoryService'
import { AssetService } from '@/api/AssetService'
import Loading from '@/components/feedback/Loading'

const DEFAULT_PAGE_SIZE = 10
export default function Asset() {

  //
  const queryClient = useQueryClient()
  const cacheData = queryClient.getQueryData<ResponseBaseType | undefined>(['assetList', 1, DEFAULT_PAGE_SIZE, '', '', ''])
  //
  const [totalItems, setTotalItems] = useState<number | undefined>(cacheData ?
    cacheData.data.totalItems : undefined)
  //useStates for pagination and filter
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [category, setCategory] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [isFiltered, setIsFiltered] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [categoryModalShow, setCategoryModalShow] = useState(false)
  const categoryFullList = useQuery({
    queryKey: ['categoryFullList'],
    queryFn: async () => {
      const res = await CategoryService.getAllCategory()
      if (res !== undefined) {
        return res
      } else {
        return {
          data: {
            items: [{
              id: 'wtfff',
              name: 'Ê',
              description: 'string;',
              numberOfAssets: 1,
              parent: null
            }]
          }
        }
      }
    }
  })
  const assetListQuery = useQuery({
    queryKey: [
      'assetList',
      page,
      pageSize,
      category,
      status,
      name,
    ],
    queryFn: async () => {
      const res = await AssetService.getAssetList(page, pageSize, category, status, name)
      if (res.status === 200) {
        setTotalItems(res.data.totalItems)
      }
      return res
    },
  })
  const deleteAssetMutation = useMutation({
    mutationFn: (id: string) => AssetService.deleteAsset(id),
    onSuccess: (res) => {
      assetListQuery.refetch()
    },
    onError: (err) => { }
  })
  const getCategoryName = (): string => {
    return categoryFullList.data?.data.items.find((i: CategoryResponseType) => i.id === category)?.name
  }

  //

  const SearchInput = (
    <Input
      className='grow bg-background-50 border-0'
      variant='rounded'
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
  )

  const FilterInput = (
    <TouchableOpacity className='flex flex-row gap-2'>
      <Icon as={FilterIcon} className='text-typography-600' />
      <Text className='text-typography-600'>Bộ lọc</Text>
    </TouchableOpacity>
  )
  const SearchAndFilter = () => (
    <View className='flex flex-row gap-4 items-center'>
      {SearchInput}
      {FilterInput}
    </View>
  )
  const ActionFab = () => (
    <Fab
      className='bg-primary-400 '
      size="lg"
      placement="bottom right"
      onPress={() => router.push('/(_main)/asset/create-asset')}>
      <FabLabel >Thêm</FabLabel>
      <FabIcon as={PlusIcon} />
    </Fab>
  )

  const FavouriteList = () => (
    <View className='flex flex-col gap-2 py-2 border-t border-outline-100'>
      <View className='flex flex-row gap-2 items-center'>
        <HeartIcon className='w-5 h-5' fill={`#D4003F`} />
        <Text className='text-lg text-typography-800 font-semibold'>
          Danh sách yêu thích
        </Text>
      </View>
      {/* <AssetCard deleteFn={() => { }} /> */}
    </View>
  )

  const NormalList = (data: PageResponseType<AssetResponseType>) => (
    <View className='flex flex-col gap-2 pt-4 pb-10 border-t border-outline-50'>
      <Text className='text-lg text-typography-800 font-semibold'>
        Danh sách
      </Text>
      <View className='flex flex-row justify-center '>
        <Pagination
          quantity={data.totalPages}
          active={data.pageIndex}
          onChange={setPage} />
      </View>
      {data.items.map((i: AssetResponseType) =>
        <AssetCard
          key={i.id}
          data={i}
          onPress={() => router.push(`/(_main)/asset/${i.id}`)}
          deleteFn={() => deleteAssetMutation.mutate(i.id)} />)}

    </View>
  )


  const Filters = (
    <View className="flex flex-col gap-4 w-60">
      <CategoryPickerModal
        showModal={categoryModalShow}
        setShowModal={setCategoryModalShow}
        data={categoryFullList.data ? categoryFullList.data?.data.items as CategoryResponseType[] : []}
        pickFn={(id: string) => {
          setCategory(id)
          if (id === '' && status === '')
            setIsFiltered(false)
          else
            setIsFiltered(true)
        }}
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
        initialLabel={status == '' ? 'Tất cả' :
          AssetStatusListMapToDisplayText[status as keyof typeof AssetStatusListMapToDisplayText]}
        onValueChange={(v) => {
          setStatus(v)
          if (v === '' && category === '')
            setIsFiltered(false)
          else
            setIsFiltered(true)
        }}
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
  )
  return (
    <BaseScreenContainer>
      <MainContainer>
        <View className="flex flex-col gap-4 py-4">
          <SimpleWidget className="h-24" label="Tổng số tài sản" number={totalItems} />
          <View className='flex flex-row gap-4 items-center'>
            {SearchInput}
            <CustomFilter filters={Filters} isFiltered={isFiltered} />
          </View>
          {/* {FavouriteList} */}

          {assetListQuery.isPending || deleteAssetMutation.isPending ?
            <View className='relative h-40'>
              <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
            </View>
            :
            NormalList(assetListQuery.data.data)}

        </View>
      </MainContainer>
      <ActionFab />
    </BaseScreenContainer>
  )
}