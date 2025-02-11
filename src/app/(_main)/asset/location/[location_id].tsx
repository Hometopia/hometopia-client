import { View, Text, FlatList } from 'react-native'
import React, { useState } from 'react'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import MainContainer from '@/components/container/MainContainer'
import { router, useLocalSearchParams } from 'expo-router'
import BackButton from '@/components/custom/BackButton'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AssetService } from '@/api/AssetService'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { AssetOnListResponseType, AssetResponseType, LocationResponseType, PageResponseType } from '@/api/types/response'
import AssetCard from '@/components/custom/AssetCard'
import { Spinner } from '@/components/ui/spinner'
import Loading from '@/components/feedback/Loading'
import { LocationService } from '@/api/LocationService'
import { Image } from '@/components/ui/image'
import { FileService, getImgUri } from '@/api/FileService'
import ImageUploader from '@/components/custom/ImageUploader'
import { DocumentPickerAsset } from 'expo-document-picker'
import { LocationType } from '@/api/types/request'
import { Button, ButtonIcon } from '@/components/ui/button'
import { Edit3Icon, MenuIcon, SearchIcon, TrashIcon } from 'lucide-react-native'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import NameUpdateModal from '@/components/custom/NameUpdateModal'
import DeleteDialog from '@/components/custom/DeleteDialog'
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu'
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab'
import { Icon } from '@/components/ui/icon'
import NotificationDialog from '@/components/custom/NotificationDialog'
import SelectedListActionPanel from '@/components/custom/SelectedListActionPanel'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import Pagination from '@/components/custom/Pagination'

export default function AssetList() {
  const globalValues = useGlobalContext()

  const { location_id } = useLocalSearchParams()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [category, setCategory] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [isFiltered, setIsFiltered] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [categoryModalShow, setCategoryModalShow] = useState(false)

  const [deleteAssetDialogShow, setDeleteAssetDialogShow] = useState(false)
  const [deleteLocationDialogShow, setDeleteLocationDialogShow] = useState(false)
  const [notiDialogShow, setNotiDialogShow] = useState(false)

  const [currentAsset, setCurrentAsset] = useState<AssetOnListResponseType>()
  const [selectedAssets, setSelectedAssets] = useState<Record<string, boolean>>({})

  const [isNameEdit, setIsNameEdit] = useState(false)

  const queryClient = useQueryClient()

  const locationQuery = useQuery({
    queryKey: ['location', location_id],
    queryFn: async () => {
      const res = await LocationService.getLocationById(location_id as string)
      return res
    }
  })
  const assetListQuery = useQuery({
    queryKey: ['asset-list', location_id, page, pageSize, '', '', name],
    queryFn: () => AssetService.getAssetListByLocation(
      location_id as string,
      page,
      pageSize,
      '',
      '',
      name
    )
  })
  const filesUploadMutation = useMutation({
    mutationFn: (files: DocumentPickerAsset[]) => FileService.uploadFiles(files),
    onSuccess: (res) => {
      if (res.status) {
        switch (res.status) {
          case 207: {
            // setIsFileUpload(true)
            return
          }
        }
      }
    },
    onError: (err) => console.error(err)
  })
  const updateLocationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: LocationType }) => LocationService.updateLocation(id, data),
    onSuccess: (res) => {
      locationQuery.refetch()
      queryClient.refetchQueries({
        queryKey: ['locations']
      })
    }
  })
  const deleteAssetMutation = useMutation({
    mutationFn: (id: string) => AssetService.deleteAsset(id),
    onSuccess: (res) => {
      queryClient.refetchQueries({
        queryKey: [['asset-list', 1, 10, '', '', '']]
      })
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
      queryClient.refetchQueries({
        queryKey: ['locations']
      })
    },
    onError: (err) => { }
  })
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
  const NormalList = (data: PageResponseType<AssetResponseType>) => (
    <View className='flex flex-col gap-2 pt-4 pb-10 border-t border-outline-50'>
      <View className="flex flex-row justify-between">
        <Text className='text-lg text-typography-800 font-semibold'>
          Danh sách
        </Text>
        <Text className='text-typography-600'>
          Số lượng: {data.totalItems}
        </Text>
      </View>
      {data.totalItems > 0 &&
        <View className='flex flex-row justify-center '>
          <Pagination
            quantity={data.totalPages}
            active={data.pageIndex}
            onChange={setPage} />
        </View>}

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

  const ActionFab = () => (
    <Menu
      className='w-40'
      placement='top right'
      offset={25}
      crossOffset={10}
      trigger={({ ...triggerProps }) => {
        return (
          <Fab
            className='bg-primary-400'
            size="lg"
            placement="bottom right"
            {...triggerProps}
          >
            <FabIcon as={MenuIcon} />
          </Fab>
        )
      }}
    >
      <MenuItem key="Update" textValue="Update" onPress={() => setIsNameEdit(prev => !prev)}>
        <Icon as={Edit3Icon} size="lg" className="mr-2" />
        <MenuItemLabel size="lg">Chỉnh sửa</MenuItemLabel>
      </MenuItem>
      <MenuItem key="Delete" textValue="Delete" onPress={() => {
        setDeleteLocationDialogShow(true)
      }}>
        <Icon as={TrashIcon} size="lg" className="mr-2 text-error-400" />
        <MenuItemLabel className='text-error-400' size="lg">Xoá vị trí</MenuItemLabel>
      </MenuItem>
    </Menu>

  )

  return (
    <BaseScreenContainer>
      <MainContainer>
        <View className="h-[48px] my-2 flex flex-row justify-start gap-4 items-center">
          <BackButton backFn={() => {
            router.back()
          }} />
          <View className='grow flex flex-col justify-between items-center text-wrap'>


            <Text className='font-semibold text-lg text-primary-400 text-wrap'>
              {
                locationQuery.isFetched ? locationQuery.data.data.name : ''
              }
            </Text>

          </View>
        </View>
        <View className='w-full flex flex-row justify-center'>
          {!locationQuery.isPending ?
            (locationQuery.data?.data.images ?
              <ImageUploader
                placeholder={locationQuery.data?.data.images[0] === null || locationQuery.data?.data.images.length === 0}
                uri={locationQuery.data?.data.images[0] === null || locationQuery.data?.data.images.length === 0
                  ? '' : getImgUri(locationQuery.data?.data.images[0].fileName)}
                uploadFn={async (img: DocumentPickerAsset) => {
                  const res = await filesUploadMutation.mutateAsync([img])
                  if (res.status === 207) {
                    if (res.data.items[0].status === 200) {
                      updateLocationMutation.mutate({
                        id: location_id as string,
                        data: {
                          name: locationQuery.data?.data.name,
                          images: [res.data.items[0].data]
                        } as LocationType
                      })
                    }
                  }
                }}
              />
              :
              <View className='w-40 h-40 rounded-xl bg-background-100' />)
            :
            <View className='w-40 h-40 rounded-xl bg-background-100' />
          }

        </View>

        {assetListQuery.isPending ?
          <View className='relative h-40'>
            <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
          </View>
          :
          <View className='py-4'>
            <View className='flex flex-col gap-4 '>
              <View className='flex flex-row gap-4 items-center'>
                {SearchInput}
              </View>

              {assetListQuery.isPending || deleteAssetMutation.isPending || deleteAssetListMutation.isPending ?
                <View className='relative h-40'>
                  <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
                </View>
                :
                NormalList(assetListQuery.data.data)}
            </View>
          </View>
        }
        {locationQuery.isFetched &&
          <NameUpdateModal
            showModal={isNameEdit}
            setShowModal={setIsNameEdit}
            data={locationQuery.data.data.name}
            updateFn={(name: string) => {
              if (name === locationQuery.data.data.name) return
              updateLocationMutation.mutate({
                id: location_id as string,
                data: {
                  name: name,
                  images: locationQuery.data?.data.images
                } as LocationType
              })
            }}
          />}
        {
          currentAsset &&
          <DeleteDialog text={currentAsset.name}
            show={deleteAssetDialogShow}
            setShow={setDeleteAssetDialogShow}
            deleteFn={() => {
              deleteAssetMutation.mutate(currentAsset.id)
            }} />
        }
        {
          locationQuery.isFetched &&
          <DeleteDialog text={locationQuery.data.data.name}
            show={deleteLocationDialogShow}
            setShow={setDeleteLocationDialogShow}
            deleteFn={() => {
              if (assetListQuery.isFetched) {
                if (assetListQuery.data.data.items.length > 0) {
                  setNotiDialogShow(true)
                  return
                }
              }

              deleteLocationMutation.mutate(locationQuery.data.data.id)
            }} />
        }
        <NotificationDialog
          text='Không thể xóa vị trí đang chứa tài sản.'
          show={notiDialogShow}
          setShow={setNotiDialogShow}
        />

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
          actionFn={() => {
            deleteAssetListMutation.mutate(
              Object.entries(selectedAssets)
                .filter(([_, v]) => v)
                .map(([key, value]) => key)
            )
            setSelectedAssets({})
          }}
        />
        :
        <ActionFab />
      }
    </BaseScreenContainer>
  )
}