
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import ImageUploader from '@/components/custom/ImageUploader'
import { Accordion, AccordionContent, AccordionHeader, AccordionIcon, AccordionItem, AccordionTitleText, AccordionTrigger } from '@/components/ui/accordion'
import { ChevronDownIcon, ChevronUpIcon, EditIcon, Locate, TrashIcon } from 'lucide-react-native'
import { Table, TableBody, TableData, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { AssetResponseType, ResponseBaseType } from '@/api/types/response'
import { currencyFormatter } from '@/helpers/currency'
import { ISOtoLocal, YYYYMMDDtoLocalDate } from '@/helpers/time'
import StatusBadge from '@/components/custom/StatusBadge'
import { AssetStatusList, AssetStatusListMapToDisplayText } from '@/constants/data_enum'
import AssetInfoDisplay from '@/components/custom/AssetInfoDisplay'
import { FileService, getImgUri } from '@/api/FileService'
import { Spinner } from '@/components/ui/spinner'
import { BASE_URL } from '@/constants/server'
import { AssetService } from '@/api/AssetService'
import { AssetType } from '@/api/types/request'
import CommonToast from '@/components/feedback/CommonToast'
import { DocumentPickerAsset } from 'expo-document-picker'
import { useToast } from '@/components/ui/toast'
import { dateToYYYYMMDD } from '@/helpers/time';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import useFileSystem from '@/hooks/useFileSystem'
import { FileInfoType } from '@/api/types/common'
import LocationUpdateModal from '@/components/custom/LocationPickModal'
import { LocationService } from '@/api/LocationService'
import { Image } from '@/components/ui/image'


export default function AssetGeneral() {

  const { asset_id } = useLocalSearchParams()
  const queryClient = useQueryClient()
  // const cachedAsset: ResponseBaseType | undefined = queryClient.getQueryData(['asset', asset_id])

  const [assetQuery, setAssetQuery] = useState<ResponseBaseType | undefined>(queryClient.getQueryData(['asset', asset_id]))
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false)

  const [showLocationModal, setShowLocationModal] = useState(false)

  const { openFile } = useFileSystem()
  //#region feedback
  const toast = useToast()
  const successToast = CommonToast({
    toast: toast,
    title: "Thay đổi thành công",
    description: "Tài sản đã được thay đổi thành công",
    variant: "success"
  })
  const errorToast = CommonToast({
    toast: toast,
    title: "Thay đổi thất bại",
    description: "Tài sản chưa thay đổi được.",
    variant: "error"
  })

  const fileUploadErrorToast = CommonToast({
    toast: toast,
    title: "Tải ảnh lên thất bại",
    description: "Vui lòng thử lại.",
    variant: "error"
  })
  //#endregion

  const locationsQuery = useQuery({
    queryKey: ['locations'],
    queryFn: () => LocationService.getListLocation()
  })

  const updateAssetMutation = useMutation({
    mutationFn: (payload: AssetType) => AssetService.updateAsset(asset_id as string, payload),
    onSuccess: (res) => {
      if (res) {
        switch (res.status) {
          case 200: {
            successToast.handleToast()
            queryClient.refetchQueries({ queryKey: ['asset', asset_id] })
            setAssetQuery(queryClient.getQueryData(['asset', asset_id]))
            break
          }
          default: {
            errorToast.handleToast()
          }
        }
      }
    },
    onError: (err) => {
      console.error(err)
      errorToast.handleToast()
    }
  })
  const filesUploadMutation = useMutation({
    mutationFn: (files: DocumentPickerAsset[]) => FileService.uploadFiles(files),
    onSuccess: (res) => {
      if (res.status) {
        switch (res.status) {
          case 207: {
            setIsFileUpload(true)
            return
          }
        }
      }
      fileUploadErrorToast.handleToast()
    },
    onError: (err) => console.error(err)
  })
  const truthData = (asset: AssetResponseType) => [
    {
      key: 'overview',
      label: 'Tổng quan',
      items: [
        { head: 'Tên', data: asset.name },
        { head: 'Danh mục', data: `${asset.category.parent.name} > ${asset.category.name}` },
        { head: 'Mô tả', data: asset.description },
        { head: 'Tạo vào', data: ISOtoLocal(asset.createdAt) },
      ],
    },
    {
      key: 'purchase',
      label: 'Thông tin mua hàng',
      items: [
        { head: 'Ngày mua hàng', data: YYYYMMDDtoLocalDate(asset.purchaseDate) },
        { head: 'Giá mua', data: currencyFormatter().format((asset.purchasePrice)) },
        { head: 'Nhà cung cấp', data: asset.brand },
        { head: 'Số serial', data: asset.serialNumber },
      ],
    },
    {
      key: 'use',
      label: 'Thông tin sử dụng',
      items: [
        {
          head: 'Tình trạng', data: <StatusBadge
            length={AssetStatusList.length}
            index={AssetStatusList.indexOf(asset.status)}
            label={AssetStatusListMapToDisplayText[asset.status as keyof typeof AssetStatusListMapToDisplayText]} />
        },
        {
          head: 'Vị trí', data:
            <View className='grow flex flex-row justify-between'>
              {asset.location !== null ?
                <TouchableOpacity className='flex flex-row gap-2 items-center py-2 px-4 rounded-lg bg-background-400/10'
                  onPress={() => {
                    router.push({
                      pathname: '/(_main)/asset/asset-list',
                      params: {
                        location: asset.location.id,
                      }
                    })
                  }}>
                  <Text>{asset.location.name}</Text>
                </TouchableOpacity> :
                <Text>Chưa có</Text>
              }
              {locationsQuery.isFetched && <LocationUpdateModal
                showModal={showLocationModal}
                setShowModal={setShowLocationModal}
                data={locationsQuery.data.data.items}
                createFn={() => {
                  locationsQuery.refetch()
                }}
                pickFn={(id: string) => {
                  if (assetQuery?.data.location && id === assetQuery?.data.location.id) return
                  updateAssetMutation.mutate({
                    name: assetQuery?.data.name,
                    description: assetQuery?.data.description,
                    images: assetQuery?.data.images,
                    purchaseDate: assetQuery?.data.purchaseDate,
                    purchasePlace: assetQuery?.data.purchasePlace,
                    purchasePrice: assetQuery?.data.purchasePrice,
                    brand: assetQuery?.data.brand,
                    serialNumber: assetQuery?.data.serialNumber,
                    locationId: id,
                    warrantyExpiryDate: assetQuery?.data.warrantyExpiryDate ?
                      assetQuery?.data.warrantyExpiryDate : null,
                    documents: assetQuery?.data.documents,
                    status: assetQuery?.data.status,
                    maintenanceCycle: assetQuery?.data.maintenanceCycle || null,
                    categoryId: assetQuery?.data.category.id
                  } as AssetType)
                }}
              />}

              <Button className='rounded-lg' onPress={() => setShowLocationModal(true)}>
                <ButtonIcon as={Locate} />
                <ButtonText>Chọn vị trí</ButtonText>
              </Button>
            </View>
        },
      ],
    },
  ]
  return (
    <SafeAreaView className='h-full bg-white relative'>
      {(assetQuery?.data === undefined || updateAssetMutation.isPending) ?
        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }} className='absolute z-50 top-0 left-0 w-full h-full flex justify-center items-center'>
          <Spinner size="large" className="text-primary-400" />
          <Text className='text-typography-800 text-md'>
            {updateAssetMutation.isPending && 'Đang lưu thay đổi'}
            {assetQuery?.data === undefined && 'Đang tải thông tin'}
          </Text>
        </View>
        :
        <ScrollView className="flex flex-col my-4 px-4 gap-4 " overScrollMode='never'>
          <View className='flex flex-row justify-center mb-4'>
            {(assetQuery?.data === undefined || filesUploadMutation.isPending) ?
              <Spinner size="large" className="text-primary-400" />
              :
              <ImageUploader
                placeholder={assetQuery?.data.images[0] === null}
                uri={`${BASE_URL}/files?fileName=${assetQuery?.data.images[0]?.fileName}`}
                uploadFn={async (img: DocumentPickerAsset) => {
                  const res = await filesUploadMutation.mutateAsync([img])
                  if (res.status === 207) {
                    if (res.data.items[0].status === 200) {
                      updateAssetMutation.mutate({
                        name: assetQuery?.data.name,
                        description: assetQuery?.data.description,
                        images: [res.data.items[0].data],
                        purchaseDate: assetQuery?.data.purchaseDate,
                        purchasePlace: assetQuery?.data.purchasePlace,
                        purchasePrice: assetQuery?.data.purchasePrice,
                        brand: assetQuery?.data.brand,
                        serialNumber: assetQuery?.data.serialNumber,
                        locationId: assetQuery?.data.location ? assetQuery?.data.location.id : null,
                        // warrantyExpiryDate: assetQuery?.data.warrantyExpiryDate,
                        warrantyExpiryDate: dateToYYYYMMDD(new Date()),
                        documents: assetQuery?.data.documents,
                        status: assetQuery?.data.status,
                        maintenanceCycle: assetQuery?.data.maintenanceCycle || null,
                        categoryId: assetQuery?.data.category.id
                      } as AssetType)
                      setIsFileUpload(false)
                    }
                  }
                }}
              />
            }


          </View>

          <Accordion
            className="flex-[1_0_0]"
            variant="unfilled"
            type="multiple"
            defaultValue={[...truthData(assetQuery?.data).map(item => item.key), 'warranty']}
          >
            {truthData(assetQuery?.data).map(i =>
              <AccordionItem key={i.key} value={i.key} className="p-2">
                <AccordionHeader className="bg-primary-50 px-4 py-2 rounded-xl">
                  <AccordionTrigger >
                    {({ isExpanded }) => {
                      return (
                        <>
                          {isExpanded ? (
                            <AccordionIcon className="text-primary-300" as={ChevronUpIcon} />
                          ) : (
                            <AccordionIcon className="text-primary-300" as={ChevronDownIcon} />
                          )}
                          <AccordionTitleText className="ml-4 text-primary-300 text-md">
                            {i.label}
                          </AccordionTitleText>
                        </>
                      )
                    }}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  {i.items.map(tableItem =>
                    <AssetInfoDisplay
                      key={tableItem.head}
                      head={tableItem.head}
                      data={tableItem.data}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="warranty" className="p-2">
              <AccordionHeader className="bg-primary-50 px-4 py-2 rounded-xl">
                <AccordionTrigger >
                  {({ isExpanded }) => {
                    return (
                      <>
                        {isExpanded ? (
                          <AccordionIcon className="text-primary-300" as={ChevronUpIcon} />
                        ) : (
                          <AccordionIcon className="text-primary-300" as={ChevronDownIcon} />
                        )}
                        <AccordionTitleText className="ml-4 text-primary-300 text-md">
                          Bảo hành
                        </AccordionTitleText>
                      </>
                    )
                  }}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <View>
                  <Text className="p-0 pb-1 text-base font-medium text-typography-400 align-top">Ngày kết thúc:</Text>
                  <Text className="p-0 pb-3 text-lg text-typography-900">{YYYYMMDDtoLocalDate(assetQuery?.data.warrantyExpiryDate)}</Text>
                </View>
                <View className='flex flex-col gap-2 '>
                  <Text className="p-0 pb-1 text-base font-medium text-typography-400 align-top">Thẻ bảo hành/ Hóa đơn:</Text>
                  <Table className='w-full rounded-lg overflow-hidden'>
                    <TableHeader>
                      <TableRow className="bg-background-100">
                        <TableHead>Tài liệu</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assetQuery.data.documents &&
                        assetQuery.data.documents.map((i: FileInfoType, index: number) => (
                          <TableRow key={index}>
                            <TableData onPress={() => {
                              // openFile(`${BASE_URL}/files?fileName=${i.fileName}`, i.fileName)
                            }}>
                              <Text className='leading-6 text-info-400'>{i.fileName}</Text>
                            </TableData>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </View>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollView>
      }

    </SafeAreaView>

  )
}