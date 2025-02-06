import { View, Text, FlatList } from 'react-native'
import React, { useState } from 'react'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import MainContainer from '@/components/container/MainContainer'
import { router, useLocalSearchParams } from 'expo-router'
import BackButton from '@/components/custom/BackButton'
import { useMutation, useQuery } from '@tanstack/react-query'
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
  const locationQuery = useQuery({
    queryKey: ['location', location],
    queryFn: () => LocationService.getLocationById(location as string)
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

  return (
    <BaseScreenContainer>
      <MainContainer>
        <View className="bg-white h-[48px] pt-2 pb-4 flex flex-row justify-start gap-4 items-center">
          <BackButton backFn={() => {
            router.back()
          }} />
          <View>
            <Text className='font-normal text-lg'>{!locationQuery.isPending &&
              (locationQuery.data ? locationQuery.data.data.name : '')}</Text>
          </View>
        </View>
        <View className='w-full flex flex-row justify-center'>
          {!locationQuery.isPending ?

            (locationQuery.data?.data.images ?
              <ImageUploader
                placeholder={locationQuery.data?.data.images[0] === null}
                uri={getImgUri(locationQuery.data?.data.images[0].fileName)}
                uploadFn={async (img: DocumentPickerAsset) => {
                  const res = await filesUploadMutation.mutateAsync([img])
                  if (res.status === 207) {
                    // if (res.data.items[0].status === 200) {
                    //   updateAssetMutation.mutate({
                    //     name: assetQuery?.data.name,
                    //     description: assetQuery?.data.description,
                    //     images: [res.data.items[0].data],
                    //     purchaseDate: assetQuery?.data.purchaseDate,
                    //     purchasePlace: assetQuery?.data.purchasePlace,
                    //     purchasePrice: assetQuery?.data.purchasePrice,
                    //     brand: assetQuery?.data.brand,
                    //     serialNumber: assetQuery?.data.serialNumber,
                    //     locationId: assetQuery?.data.location ? assetQuery?.data.location.id : null,
                    //     // warrantyExpiryDate: assetQuery?.data.warrantyExpiryDate,
                    //     warrantyExpiryDate: dateToYYYYMMDD(new Date()),
                    //     documents: assetQuery?.data.documents,
                    //     status: assetQuery?.data.status,
                    //     maintenanceCycle: assetQuery?.data.maintenanceCycle || null,
                    //     categoryId: assetQuery?.data.category.id
                    //   } as AssetType)
                    //   setIsFileUpload(false)
                    // }
                  }
                }}
              />
              :
              <View className='w-40 h-40 rounded-xl bg-background-100' />)
            :
            <View className='w-40 h-40 rounded-xl bg-background-100' />
          }

        </View>
        <View className='flex flex-row flex-wrap gap-2 my-2'>
          {assetListQuery.isPending ?
            <View className='relative h-40'>
              <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
            </View>
            :
            assetListQuery.data.data.items.map((i: AssetOnListResponseType) =>
              <AssetCard
                key={i.id}
                data={i}
                onPress={() => router.push(`/(_main)/asset/${i.id}`)}
                deleteFn={() => { }}
              />)
          }

        </View>
      </MainContainer>
    </BaseScreenContainer>
  )
}