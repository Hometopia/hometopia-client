import { FlatList, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import MainContainer from '@/components/container/MainContainer'
import UpcomingFeaturePopover from '@/components/custom/UpcomingFeaturePopover'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { BoxIcon, ChevronDownIcon, FilterIcon, HeartIcon, List, Locate, PlusIcon, QrCodeIcon, SearchIcon } from 'lucide-react-native'
import { Href, router } from 'expo-router'
import SimpleWidget from '@/components/widget/SimpleWidget'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab'
import { Text } from '@/components/ui/text'
import { Icon } from '@/components/ui/icon'
import { primaryColor } from '@/constants/color'
import { AssetOnListResponseType, AssetResponseType, CategoryResponseType, LocationResponseType, PageResponseType, ResponseBaseType } from '@/api/types/response'
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
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu'
import { LocationService } from '@/api/LocationService'
import { getImgUri } from '@/api/FileService'
import CreateLocationModal from '@/components/custom/CreateLocationModal'
import ImageAdder from '@/components/custom/Camera'
import Camera from '@/components/custom/Camera'
import { AssetDisplayModeType } from '@/constants/types'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import LocationCard from '@/components/custom/LocationCard'
import { DEFAULT_PAGE_SIZE } from '@/constants/config'
import DeleteDialog from '@/components/custom/DeleteDialog'
import SelectedListActionPanel from '@/components/custom/SelectedListActionPanel'
import { LinearGradient } from 'expo-linear-gradient'
import NotificationDialog from '@/components/custom/NotificationDialog'



const DisplayModeInput = ({
  mode, onChange
}: {
  mode: AssetDisplayModeType,
  onChange: Function
}) => {
  const ColorModeItem = ({
    value, label, onChange
  }: {
    value: AssetDisplayModeType,
    label: string,
    onChange: Function
  }) => (
    <TouchableOpacity
      className={mode !== value ?
        ' px-4 py-2 rounded-md bg-background-50 flex-1 flex-row justify-center items-center gap-2' :
        ' px-4 py-2 rounded-md bg-primary-400/10 flex-1 flex-row justify-center items-center  gap-2'}
      onPress={() => onChange()}
    >
      <Icon
        className={mode === value ? 'text-primary-400' : 'text-typography-400'}
        as={value === 'location' ? Locate : List}
        size='md'
      />
      <Text className={mode !== value ?
        'text-typography-400' :
        'text-primary-400  font-semibold'
      }>
        {label}
      </Text>
    </TouchableOpacity>
  )
  return (
    <View className='flex flex-row gap-2 justify-between rounded-2xl overflow-hidden'>
      <ColorModeItem value={"location"} label="Vị trí" onChange={() => onChange("location")} />
      <ColorModeItem value={"list"} label="Danh sách" onChange={() => onChange("list")} />
    </View>
  )
}
export default function Asset() {
  const globalValues = useGlobalContext()
  //
  const queryClient = useQueryClient()
  const cacheData = queryClient.getQueryData<ResponseBaseType | undefined>(['asset-list', 1, DEFAULT_PAGE_SIZE, '', '', '',])
  //
  useEffect(() => {
    setTotalItems(cacheData ?
      cacheData.data.totalItems : undefined)
  }, [cacheData])
  const [totalItems, setTotalItems] = useState<number | undefined>(cacheData ?
    cacheData.data.totalItems : undefined)
  //useStates for pagination and filter
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  //filter
  const [category, setCategory] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  //
  const [isFiltered, setIsFiltered] = useState<boolean>(false)
  const resetFilter = () => {
    setCategory('')
    setStatus('')
    setIsFiltered(false)
  }
  //
  const [name, setName] = useState<string>('')
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [categoryModalShow, setCategoryModalShow] = useState(false)
  const [createLocationModalShow, setCreateLocationModalShow] = useState(false)
  const [deleteAssetDialogShow, setDeleteAssetDialogShow] = useState(false)
  const [deleteLocationDialogShow, setDeleteLocationDialogShow] = useState(false)

  const [currentAsset, setCurrentAsset] = useState<AssetOnListResponseType>()
  const [currentLocation, setCurrentLocation] = useState<LocationResponseType>()

  const [selectedAssets, setSelectedAssets] = useState<Record<string, boolean>>({})

  const locationListQuery = useQuery({
    queryKey: ['locations'],
    queryFn: () => LocationService.getListLocation()
  })
  const categoryFullList = useQuery({
    queryKey: ['categoryFullList'],
    queryFn: () => CategoryService.getAllCategory()
  })
  const assetListQuery = useQuery({
    queryKey: [
      'asset-list',
      page,
      pageSize,
      category,
      status,
      name,
    ],
    queryFn: () => AssetService.getAssetList(page, pageSize, category, status, name)
  })
  const deleteAssetMutation = useMutation({
    mutationFn: (id: string) => AssetService.deleteAsset(id),
    onSuccess: (res) => {
      assetListQuery.refetch()
    },
    onError: (err) => { }
  })
  const deleteAssetListMutation = useMutation({
    mutationFn: (ids: string[]) => AssetService.deleteListAsset(ids),
    onSuccess: (res) => {
      assetListQuery.refetch()
    },
    onError: (err) => { }
  })
  const deleteLocationMutation = useMutation({
    mutationFn: async (id: string) => {

      return await LocationService.deleteLocation(id)
    },
    onSuccess: (res) => {
      locationListQuery.refetch()
    },
    onError: (err) => { }
  })
  const getCategoryName = (): string => {
    return categoryFullList.data?.data.items.find((i: CategoryResponseType) => i.id === category)?.name
  }


  //#region local items
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
    <Menu
      className='drop-shadow-lg'
      placement='top'
      offset={25}
      crossOffset={10}
      trigger={({ ...triggerProps }) => {
        return (
          <Fab
            className='bg-primary-400 drop-shadow-lg'
            size="lg"
            placement="bottom right"
            {...triggerProps}
          >
            <FabLabel>Thêm</FabLabel>
            <FabIcon as={PlusIcon} />
          </Fab>
        )
      }}
    >
      <MenuItem key="Add location" textValue="Add location" onPress={() => setCreateLocationModalShow(true)}>
        <Icon as={Locate} size="lg" className="mr-2" />
        <MenuItemLabel size="lg">Thêm vị trí</MenuItemLabel>
      </MenuItem>
      <MenuItem key="Add asset" textValue="Add asset" onPress={() => router.push('/(_main)/asset/create-asset')}>
        <Icon as={BoxIcon} size="lg" className="mr-2" />
        <MenuItemLabel size="lg">Thêm tài sản</MenuItemLabel>
      </MenuItem>
    </Menu>

  )
  //#endregion
  const NormalList = (data: PageResponseType<AssetResponseType>) => (
    <View className='flex flex-col gap-2 pt-4 pb-10 border-t border-outline-50'>
      <View className="flex flex-row justify-between">
        <Text className='text-lg text-typography-800 font-semibold'>
          Danh sách
        </Text>
        <Text>
          Số lượng: {data.totalItems}
        </Text>
      </View>
      <View className='flex flex-row justify-center '>
        <Pagination
          quantity={data.totalPages}
          active={data.pageIndex}
          onChange={setPage} />
      </View>
      <View className='flex flex-row flex-wrap items-stretch gap-2 my-2'>
        {data.items.map((i: AssetOnListResponseType) =>
          <AssetCard
            key={i.id}
            data={i}
            isSelect={!!selectedAssets[i.id]}
            setIsSelect={() => {
              setSelectedAssets(prev => ({
                ...prev,
                [i.id]: !prev[i.id],
              }))
            }}
            canPressToSelect={Object.entries(selectedAssets).filter(([_, v]) => v).length > 0}
            onPress={() => router.push(`/(_main)/asset/${i.id}`)}
            deleteFn={() => {
              setCurrentAsset(i)
              setDeleteAssetDialogShow(true)
            }} />)}
      </View>
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
          setIsFiltered(id !== '' || status !== '')
        }}
      />
      <View className="flex-1 flex-col gap-4">
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
            setIsFiltered(category !== '' || v !== '')
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
      <Button
        className='rounded-lg'
        isDisabled={!isFiltered}
        onPress={() => resetFilter()}>
        <ButtonText>Bỏ lọc</ButtonText>
      </Button>
    </View>
  )

  const LocationList = (
    locationListQuery.isPending ?
      <View className='relative h-40'>
        <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
      </View>
      :
      <View className='flex flex-col gap-2 pt-4 pb-10 border-t border-outline-50'>
        <Text className='text-lg text-typography-800 font-semibold'>
          Vị trí
        </Text>
        <View className='flex flex-row flex-wrap gap-2 my-2'>
          {locationListQuery.data.data.items.map((i: any) =>
            <LocationCard
              key={i.id}
              data={i}
              onPress={() => {
                router.push(`/(_main)/asset/location/${i.id}`)
              }}
              deleteFn={() => {
                setCurrentLocation(i)
                setDeleteLocationDialogShow(true)
              }} />
          )}
        </View>
      </View>

  )
  return (
    <BaseScreenContainer>
      <MainContainer>
        <View className="flex flex-col gap-4 py-4">
          <SimpleWidget className="h-24" label="Tổng số tài sản" number={totalItems} />
          <View className='py-4'>
            <DisplayModeInput mode={globalValues.assetDisplayMode} onChange={globalValues.setAppAssetDisplayMode} />
          </View>
          {globalValues.assetDisplayMode === 'location' ?
            LocationList :
            <View className='flex flex-col gap-4 '>
              <View className='flex flex-row gap-4 items-center'>
                {SearchInput}
                <CustomFilter filters={Filters} isFiltered={isFiltered} />
              </View>

              {assetListQuery.isPending || deleteAssetMutation.isPending || deleteAssetListMutation.isPending ?
                <View className='relative h-40'>
                  <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
                </View>
                :
                NormalList(assetListQuery.data.data)}
            </View>
          }
        </View>
      </MainContainer>
      {Object.entries(selectedAssets).filter(([_, v]) => v).length > 0 ?
        <SelectedListActionPanel
          theme={globalValues.themeMode === 'dark' ? 'dark' : 'light'}
          number={Object.entries(selectedAssets).filter(([_, v]) => v).length}
          selectAllFn={() => {
            let current = selectedAssets
            assetListQuery.data.data.items
              .map((i: AssetResponseType) => current = { ...current, [i.id]: true })

            setSelectedAssets(current)
          }}
          unSelectAllFn={() => setSelectedAssets({})}
          actionText='Xóa hết'
          actionVariant='negative'
          actionFn={() => setDeleteAssetDialogShow(true)}
        />
        :
        <ActionFab />
      }
      <CreateLocationModal
        showModal={createLocationModalShow}
        setShowModal={(bool: boolean) => {
          setCreateLocationModalShow(bool)
          locationListQuery.refetch()
        }}
      />
      {
        Object.entries(selectedAssets).filter(([_, v]) => v).length > 0 &&
        <DeleteDialog
          text={`${Object.entries(selectedAssets).filter(([_, v]) => v).length} tài sản đã chọn`}
          show={deleteAssetDialogShow}
          setShow={setDeleteAssetDialogShow}
          deleteFn={() => {
            deleteAssetListMutation.mutate(
              Object.entries(selectedAssets)
                .filter(([_, v]) => v)
                .map(([key, value]) => key)
            )
            setSelectedAssets({})
          }} />
      }
      {
        currentAsset &&
        <DeleteDialog text={currentAsset.name}
          show={deleteAssetDialogShow}
          setShow={(bool: boolean) => {
            setDeleteAssetDialogShow(bool)
            if (!bool)
              setCurrentAsset(undefined)
          }}
          deleteFn={() => {
            deleteAssetMutation.mutate(currentAsset.id)
            setCurrentAsset(undefined)
          }} />
      }
      {
        currentLocation &&
        <DeleteDialog text={currentLocation.name}
          show={deleteLocationDialogShow}
          setShow={setDeleteLocationDialogShow}
          deleteFn={() => {
            deleteLocationMutation.mutate(currentLocation.id)
          }} />
      }

    </BaseScreenContainer>
  )
}