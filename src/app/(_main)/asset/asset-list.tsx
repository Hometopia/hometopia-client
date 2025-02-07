import { View, Text, FlatList } from 'react-native'
import React, { useState } from 'react'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import MainContainer from '@/components/container/MainContainer'
import { router, useLocalSearchParams } from 'expo-router'
import BackButton from '@/components/custom/BackButton'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AssetService } from '@/api/AssetService'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { AssetOnListResponseType } from '@/api/types/response'
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
import { Edit3Icon } from 'lucide-react-native'
import { Input, InputField } from '@/components/ui/input'
import NameUpdateModal from '@/components/custom/NameUpdateModal'

export default function AssetList() {
  const { location } = useLocalSearchParams()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [category, setCategory] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [isFiltered, setIsFiltered] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [categoryModalShow, setCategoryModalShow] = useState(false)

  const [isNameEdit, setIsNameEdit] = useState(false)

  const queryClient = useQueryClient()

  const locationQuery = useQuery({
    queryKey: ['location', location],
    queryFn: async () => {
      const res = await LocationService.getLocationById(location as string)
      return res
    }
  })
  const assetListQuery = useQuery({
    queryKey: ['assets', location, page, pageSize],
    queryFn: () => AssetService.getAssetListByLocation(
      location as string,
      page,
      pageSize
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


  return (
    <BaseScreenContainer>
      <MainContainer>
        <View className="bg-white h-[48px] pt-2 pb-4 flex flex-row justify-start gap-4 items-center">
          <BackButton backFn={() => {
            router.back()
          }} />
          <View className='grow flex flex-row justify-between items-center'>
            {locationQuery.isFetched &&
              <NameUpdateModal
                showModal={isNameEdit}
                setShowModal={setIsNameEdit}
                data={locationQuery.data.data.name}
                updateFn={(name: string) => {
                  if (name === locationQuery.data.data.name) return
                  updateLocationMutation.mutate({
                    id: location as string,
                    data: {
                      name: name,
                      images: locationQuery.data?.data.images
                    } as LocationType
                  })
                }}
              />}

            <Text className='font-semibold text-lg text-primary-400'>
              {
                locationQuery.isFetched ? locationQuery.data.data.name : ''
              }
            </Text>

            <Button className='rounded-lg' variant='outline' onPress={() => setIsNameEdit(prev => !prev)}>
              <ButtonIcon as={Edit3Icon} />
            </Button>
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
                        id: location as string,
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
            <View className='flex items-center'>
              <Text className='text-md text-typography-500'>
                Số lượng tài sản: {assetListQuery.data.data.items.length}
              </Text>
            </View>
            <View className='flex flex-row flex-wrap gap-2 my-2'>
              {assetListQuery.data.data.items.map((i: AssetOnListResponseType) =>
                <AssetCard
                  key={i.id}
                  data={i}
                  onPress={() => router.push(`/(_main)/asset/${i.id}`)}
                  deleteFn={() => { }}
                />)}
            </View>
          </View>
        }

      </MainContainer>
    </BaseScreenContainer>
  )
}