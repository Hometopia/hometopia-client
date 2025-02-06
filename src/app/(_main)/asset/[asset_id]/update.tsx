import { View, SafeAreaView, ScrollView, findNodeHandle, TouchableOpacity, Text } from 'react-native'
import React, { useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon, EditIcon, FileIcon, TrashIcon } from 'lucide-react-native'
import { Accordion, AccordionContent, AccordionHeader, AccordionIcon, AccordionItem, AccordionTitleText, AccordionTrigger } from '@/components/ui/accordion'
import useFormControl from '@/hooks/useFormControl'
import useFormSubmit from '@/hooks/useFormSubmit'
import ControllableInput from '@/components/custom/ControllableInput'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import CategoryPickerModal from '@/components/custom/CategoryPickerModal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CategoryService } from '@/api/CategoryService'
import { CategoryResponseType, FileUploadResponseType, ResponseBaseType } from '@/api/types/response'
import { Textarea, TextareaInput } from '@/components/ui/textarea'
import { dateToYYYYMMDD, stringToDate } from '@/helpers/time'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { currencyFormatter, deformatNumber, formatNumber } from '@/helpers/currency'
import { Popover, PopoverBackdrop, PopoverBody, PopoverContent } from '@/components/ui/popover'
import { BrandService } from '@/api/BrandService'
import VendorSearchModal from '@/components/custom/VendorSearchModal'
import { FormControlLabel, FormControlLabelText } from '@/components/ui/form-control'
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select'
import { AssetStatusList, AssetStatusListMapToDisplayText } from '@/constants/data_enum'
import DatePicker from '@/components/custom/DatePicker'
import useFileUploader from '@/hooks/useFileUploader'
import * as DocumentPicker from 'expo-document-picker'
import useFileSystem from '@/hooks/useFileSystem'
import { AssetService } from '@/api/AssetService'
import { AssetType } from '@/api/types/request'
import { Image } from '@/components/ui/image'
import { FileService } from '@/api/FileService'
import CommonToast from '@/components/feedback/CommonToast'
import { useAsyncExec } from '@/hooks/useAsyncExec'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/toast'
import Loading from '@/components/feedback/Loading'
import { AssetControl } from '@/components/form/AssetControl'
import { BASE_URL } from '@/constants/server'
import { FileInfoType } from '@/api/types/common'
import { LocationService } from '@/api/LocationService'
import LocationUpdateModal from '@/components/custom/LocationPickModal'

enum inputFieldNameList {
  name,
  category,
  desc,
  purDate,
  purPlace,
  purPrice,
  vendor,
  serial,
  status,
  location,
  warranDate,
  doc
}

export default function UpdateAsset() {
  const { asset_id } = useLocalSearchParams()
  const queryClient = useQueryClient()
  const [assetQuery, setAssetQuery] = React.useState<ResponseBaseType | undefined>(queryClient.getQueryData(['asset', asset_id]))
  //#region Queries
  const updateAssetMutation = useMutation({
    mutationKey: ['updateAsset'],
    mutationFn: async () => AssetService.updateAsset(
      asset_id as string,
      {
        name: assetCtrl.nameControl.value,
        description: assetCtrl.descontrol.value,
        images: [assetCtrl.imgInfo || null],
        purchaseDate: assetCtrl.purchaseDateControl.value,
        purchasePlace: assetCtrl.purchasePlaceControl.value,
        purchasePrice: Number(deformatNumber(assetCtrl.purchasePriceControl.value)),
        vendor: assetCtrl.vendorControl.value,
        serialNumber: assetCtrl.serialNumberControl.value,
        location: assetCtrl.locationControl.value,
        warrantyExpiryDate: assetCtrl.warrantyExpiryDateControl.value,
        documents: assetCtrl.docInfo || null,
        status: assetCtrl.statusControl.value,
        maintenanceCycle: null,
        categoryId: assetCtrl.categoryControl.value
      } as AssetType),
    onSuccess: (res) => {
      if (res) {
        switch (res.status) {
          case 201:
          case 200: {
            successToast.handleToast()
            queryClient.refetchQueries({ queryKey: ['asset', asset_id] })
            router.back()
            return
          }
        }
      }
      errorToast.handleToast()
    },
    onError: (err) => console.error(err)
  })

  const filesUploadMutation = useMutation({
    mutationFn: async () => {
      if (imgPicked && selectedFiles) {
        return await FileService.uploadFiles([imgPicked, ...selectedFiles])
      }
      else if (selectedFiles) {
        return await FileService.uploadFiles(selectedFiles)
      }
      else if (imgPicked) {
        return await FileService.uploadFiles([imgPicked])
      }
    },
    onSuccess: (res) => {
      if (res) {
        switch (res.status) {
          // handle different statuses here
          case 207:
            {
              if (imgPicked)
                assetCtrl.setImgInfo(res.data.items[0].data as FileInfoType)
              if (selectedFiles && imgPicked) {
                const [img, ...rest] = res.data.items
                assetCtrl.setDocInfo(rest.map((i: any) => i.data))
              }
              else if (selectedFiles) {
                assetCtrl.setDocInfo(res.data.items.map((i: any) => i.data))
              }
              setIsFileUpload(true)
              break
            }
          default:
            console.error('from file upload success mutate', res.request)
        }
      }
    },
    onError: (err) => console.error('from file upload', err)
  })

  //#endregion

  //#region Scroll behaviour
  const scrollViewRef = useRef<ScrollView>(null);
  const elementsRef = useRef<any[]>([]);
  const getOffsetByIndex = async (index: number): Promise<number> => {
    const ref = elementsRef.current[index]
    if (ref) {
      return new Promise((resolve, reject) => {
        ref.measureLayout(
          findNodeHandle(scrollViewRef.current)!,
          (x: number, y: number, width: number, height: number) => {
            resolve(y)
          },
          (error: any) => {
            reject(error)
          }
        )
      })
    } else {
      return 0
    }
  }
  const scrollTo = (offset: number) => {
    scrollViewRef.current?.scrollTo({
      y: offset - 20,
      animated: true,
    });
  }
  //#endregion

  //#region feedback
  const toast = useToast()
  const successToast = CommonToast({
    toast: toast,
    title: "Chỉnh sửa tài sản thành công",
    description: "",
    variant: "success"
  })
  const errorToast = CommonToast({
    toast: toast,
    title: "Chỉnh sửa tài sản thất bại",
    description: "",
    variant: "error"
  })
  //#endregion

  //#region File 
  const FileUploader = useFileUploader()
  const [imgPicked, setImgPicked] = useState<DocumentPicker.DocumentPickerAsset>()
  const [selectedFiles, setSelectedFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([])
  const { openFile } = useFileSystem()
  //#endregion

  //#region Form control

  //overview
  const assetCtrl = AssetControl(assetQuery?.data)

  const [isFileUpload, setIsFileUpload] = useState<boolean>(false)

  const validateAll = () => {
    assetCtrl.nameControl.validate()
    assetCtrl.categoryControl.validate()
    assetCtrl.descontrol.validate()
    assetCtrl.purchaseDateControl.validate()
    assetCtrl.purchasePlaceControl.validate()
    assetCtrl.purchasePriceControl.validate()
    assetCtrl.vendorControl.validate()
    assetCtrl.serialNumberControl.validate()
    assetCtrl.statusControl.validate()
    assetCtrl.locationControl.validate()
    assetCtrl.warrantyExpiryDateControl.validate()
  }

  const goToNextStep = async () => {
    const validArray = [
      assetCtrl.nameControl.isValid,
      assetCtrl.categoryControl.isValid,
      assetCtrl.descontrol.isValid,
      assetCtrl.purchaseDateControl.isValid,
      assetCtrl.purchasePlaceControl.isValid,
      assetCtrl.purchasePriceControl.isValid,
      assetCtrl.vendorControl.isValid,
      assetCtrl.serialNumberControl.isValid,
      assetCtrl.statusControl.isValid,
      assetCtrl.locationControl.isValid,
      assetCtrl.warrantyExpiryDateControl.isValid,
    ]

    for (var i: number = 0; i < validArray.length; i++) {
      if (validArray[i] === false) {
        scrollTo(await getOffsetByIndex(i))
        return
      }
    }
    handleMutation()

  }

  const handleMutation = async () => {
    if (imgPicked !== undefined || selectedFiles.length > 0) {
      try {
        await filesUploadMutation.mutateAsync()
      }
      catch (err) {
        console.error(err)
      }
    }
    else {
      updateAssetMutation.mutate()
    }
  }
  useAsyncExec({ condition: isFileUpload, callback: updateAssetMutation.mutate })
  const { handleSubmit } = useFormSubmit(validateAll, goToNextStep)

  //#endregion

  //#region category
  const [categoryModalShow, setCategoryModalShow] = React.useState(false)
  const categoryFullList = useQuery({
    queryKey: ['categoryFullList'],
    queryFn: CategoryService.getAllCategory,
  })
  const getCategoryName = (): string => {
    return categoryFullList.data?.data.items.find((i: CategoryResponseType) => i.id === assetCtrl.categoryControl.value)?.name
  }
  //#endregion

  //#region vendor Popover
  const [isSuggestedVendorOpen, setIsSuggestedVendorOpen] = React.useState(false)
  const suggestedVendorQuery = useQuery({
    queryKey: ['suggestedVendor', assetCtrl.vendorControl.value],
    queryFn: () => BrandService.getSuggestedListBrand(assetCtrl.vendorControl.value.toLowerCase()),
    enabled: isSuggestedVendorOpen
  })
  //#endregion

  //#region location
  const [locationModalShow, setLocationModalShow] = React.useState(false)
  const locationListQuery = useQuery({
    queryKey: ['locations'],
    queryFn: () => LocationService.getListLocation()
  })
  const getLocationName = (): string => {
    return locationListQuery.data?.data.items.find((i: any) => i.id === assetCtrl.locationControl.value)?.name
  }
  //#endregion

  const accorddionItems = [
    {
      key: 'overview',
      label: 'Tổng quan',
      items: [
        <ControllableInput key={1} control={assetCtrl.nameControl} label="Tên tài sản" errorText='Tên tài sản không được để trống'
          input={
            <Input
              className="text-center"
              size="lg"
              ref={(el) => (elementsRef.current[inputFieldNameList.name] = el)}>
              <InputField
                type="text"
                placeholder="Nhập tên tài sản"
                value={assetCtrl.nameControl.value}
                onChangeText={assetCtrl.nameControl.onChange} />
            </Input>}
        />,
        <ControllableInput key={2} control={assetCtrl.categoryControl} label="Danh mục" errorText='Danh mục không được để trống'
          input={
            <>
              <CategoryPickerModal
                showModal={categoryModalShow}
                setShowModal={setCategoryModalShow}
                data={categoryFullList.data?.data.items as CategoryResponseType[]}
                pickFn={assetCtrl.categoryControl.onChange}
              />
              <Input
                isReadOnly={true}
                variant="outline"
                size="lg"
                onTouchEnd={() => setCategoryModalShow(true)}
                ref={(el) => (elementsRef.current[inputFieldNameList.category] = el)}
              >
                <InputField placeholder="Danh mục" value={getCategoryName()} />
                <InputSlot >
                  <InputIcon className="mr-3" as={ChevronDownIcon} />
                </InputSlot>
              </Input>
            </>
          }
        />,
        <ControllableInput key={3} control={assetCtrl.descontrol} label="Mô tả" errorText='' isRequired={false}
          input={
            <Textarea size='lg' ref={(el) => (elementsRef.current[inputFieldNameList.desc] = el)}>
              <TextareaInput
                placeholder="Thêm mô tả cho tài sản này"
                value={assetCtrl.descontrol.value}
                onChangeText={assetCtrl.descontrol.onChange}
              />
            </Textarea>
          }
        />,
        <View key={4} className='flex flex-col gap-2'>
          <Text className="text-md text-typography-500 font-semibold">
            Hình ảnh
          </Text>
          <View className='flex flex-col gap-4'>
            {imgPicked ?
              <View className='flex flex-col items-center'>
                <Image
                  // className="w-[12rem] h-[12rem]"
                  size='2xl'
                  source={{ uri: imgPicked.uri }}
                  alt="asset img"
                />
              </View>
              :
              assetCtrl.imgInfo !== null &&
              <View className='flex flex-col items-center'>
                <Image
                  // className="w-[12rem] h-[12rem]"
                  size='2xl'
                  source={{ uri: `${BASE_URL}/files?fileName=${assetCtrl.imgInfo.fileName}` }}
                  alt="asset img"
                />
                {/* <Text>{assetCtrl.imgInfo.originalFileName}</Text> */}
              </View>
            }
            <Button className="px-3 w-full" variant='solid' action='primary'
              onPress={async () => {
                const pickedFile = await FileUploader.pickImage()
                if (pickedFile) {
                  setImgPicked(pickedFile)
                }
              }} >
              <ButtonText>
                {imgPicked || assetCtrl.imgInfo !== null ? 'Thay ảnh' : 'Thêm hình ảnh'}
              </ButtonText>
            </Button>
            {
              (imgPicked) &&
              <Button className="px-3 w-full" variant='outline' action='primary'
                onPress={async () => {
                  setImgPicked(undefined)
                }} >
                <ButtonText>
                  Hủy thay đổi
                </ButtonText>
              </Button>
            }
          </View>
        </View>
      ],
    },
    {
      key: 'purchase',
      label: 'Thông tin mua hàng',
      items: [
        <ControllableInput key={0} control={assetCtrl.purchaseDateControl} label="Ngày mua hàng" errorText='Ngày mua không thể trống'
          input={
            <View ref={(el) => (elementsRef.current[inputFieldNameList.purDate] = el)}>
              <DatePicker
                value={assetCtrl.purchaseDateControl.value}
                onChange={assetCtrl.purchaseDateControl.onChange}
                placeholder='Chọn ngày mua hàng'
              />
            </View>
          }
        />,
        <ControllableInput key={1} control={assetCtrl.purchasePlaceControl} label="Nơi mua hàng" errorText='Nơi mua không thể trống' isRequired={false}
          input={
            <Input
              className="text-center"
              size="lg"
              ref={(el) => (elementsRef.current[inputFieldNameList.purPlace] = el)}
            >
              <InputField
                type="text"
                placeholder="Nhập nơi mua"
                value={assetCtrl.purchasePlaceControl.value}
                onChangeText={assetCtrl.purchasePlaceControl.onChange} />
            </Input>
          }
        />,
        <ControllableInput key={2} control={assetCtrl.purchasePriceControl} label="Giá mua" errorText='Giá mua không thể trống'
          input={
            <Input className="text-center" size="lg" ref={(el) => (elementsRef.current[inputFieldNameList.purPrice] = el)}>
              <InputField
                type="text"
                inputMode="numeric"
                placeholder="Nhập giá mua. Đợn vị hiện là VND"
                value={assetCtrl.purchasePriceControl.value}
                onChangeText={(v) => {
                  const formatValue = formatNumber(v)
                  assetCtrl.purchasePriceControl.onChange(formatValue)
                }} />
              <InputSlot >
                <Text className='px-4'>₫</Text>
              </InputSlot>
            </Input>
          }
        />,
        <ControllableInput key={3} control={assetCtrl.vendorControl} label="Nhà cung cấp" errorText='Nhà cung cấp không thể trống' isRequired={false}
          input={
            <>
              <VendorSearchModal
                showModal={isSuggestedVendorOpen}
                setShowModal={setIsSuggestedVendorOpen}
                data={suggestedVendorQuery.data?.data.items}
                pickFn={assetCtrl.vendorControl.onChange}
                seachValue={assetCtrl.vendorControl.value}
                searchChange={assetCtrl.vendorControl.onChange}
              />
              <Input
                isReadOnly
                className="text-center"
                size="lg"
                onTouchEnd={() => setIsSuggestedVendorOpen(true)}
                ref={(el) => (elementsRef.current[inputFieldNameList.vendor] = el)}
              >
                <InputField
                  type="text"
                  placeholder="Nhập tên nhà cung cấp"
                  value={assetCtrl.vendorControl.value}
                  onChangeText={assetCtrl.vendorControl.onChange} />
              </Input>
            </>

          }
        />,
        <ControllableInput key={4} control={assetCtrl.serialNumberControl} label="Số serial" errorText='Số serial không thể trống' isRequired={false}
          input={
            <Input
              className="text-center"
              size="lg"
              ref={(el) => (elementsRef.current[inputFieldNameList.serial] = el)}
            >
              <InputField
                type="text"
                placeholder="Nhập số serial"
                value={assetCtrl.serialNumberControl.value}
                onChangeText={assetCtrl.serialNumberControl.onChange} />
            </Input>
          }
        />,
      ],
    },
    {
      key: 'use',
      label: 'Thông tin sử dụng',
      items: [
        <ControllableInput key={1} control={assetCtrl.statusControl} label="Trạng thái sử dụng" errorText=''
          input={
            <Select
              selectedValue={assetCtrl.statusControl.value}
              initialLabel={AssetStatusListMapToDisplayText[assetCtrl.statusControl.value as keyof typeof AssetStatusListMapToDisplayText]}
              onValueChange={(v) => assetCtrl.statusControl.onChange(v)}
              ref={(el) => (elementsRef.current[inputFieldNameList.status] = el)}
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
          }
        />,
        <ControllableInput key={2} control={assetCtrl.locationControl} label="Vị trí" errorText='Vị trí không thể trống' isRequired={false}
          input={
            <>
              <LocationUpdateModal
                showModal={locationModalShow}
                setShowModal={setLocationModalShow}
                data={locationListQuery.data?.data.items}
                pickFn={assetCtrl.locationControl.onChange}
              />
              <Input
                isReadOnly={true}
                variant="outline"
                size="lg"
                onTouchEnd={() => setLocationModalShow(true)}
                ref={(el) => (elementsRef.current[inputFieldNameList.location] = el)}
              >
                <InputField placeholder="Vị trí" value={getLocationName()} />
                <InputSlot >
                  <InputIcon className="mr-3" as={ChevronDownIcon} />
                </InputSlot>
              </Input>
            </>
          }
        />,
      ],
    },
    {
      key: 'warranty',
      label: 'Bảo hành',
      items: [
        <ControllableInput key={1} control={assetCtrl.warrantyExpiryDateControl} label="Ngày kết thúc bảo hành" errorText='Ngày kết thúc không thể trống' isRequired={false}
          input={
            <View ref={(el) => (elementsRef.current[inputFieldNameList.warranDate] = el)}>
              <DatePicker
                value={assetCtrl.warrantyExpiryDateControl.value}
                onChange={assetCtrl.warrantyExpiryDateControl.onChange}
                placeholder='Chọn ngày kết thúc'
              />
            </View>
          }
        />,
        <View key={2} className='flex flex-col gap-2'>
          <Text className="text-md text-typography-500 font-semibold">Thẻ bảo hành/ Hóa đơn</Text>
          <View className='flex flex-col rounded-xl overflow-hidden' >
            <View className="flex flex-row">
              <View className="flex flex-col grow">
                <View className='px-6 py-4 bg-background-50 h-14'>
                  <Text className="text-md font-bold text-typography-900">
                    Tên
                  </Text>
                </View>
                {assetCtrl.docInfo &&
                  assetCtrl.docInfo.map((i, index) => (
                    <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100 text-wrap' >
                      <View className="flex-1">
                        <Text className="text-md font-normal text-typography-900 ">
                          {i.originalFileName}
                        </Text>
                      </View>
                    </View>
                  ))
                }
                {selectedFiles &&
                  selectedFiles.map((i, index) => (
                    <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100 text-wrap' >
                      <View className="flex-1">
                        <Text className="text-md font-normal text-typography-900 ">
                          {i.name}
                        </Text>
                      </View>
                    </View>
                  ))
                }
              </View>
              <View className="flex flex-col grow">
                <View className='px-6 py-4 bg-background-50 h-14'>
                  <Text className="text-md font-bold text-typography-900">
                    Chỉnh sửa
                  </Text>
                </View>
                {selectedFiles &&
                  selectedFiles.map((i, index) => (
                    <View key={index} className='px-6 py-4 h-24 flex flex-row gap-4 items-center border-b border-outline-100'>
                      <Button
                        className="px-3"
                        variant='outline'
                        action='primary'
                        onPress={async () => {
                          const pickedFile = await FileUploader.pickFile()
                          if (pickedFile) {
                            setSelectedFiles(prev => {
                              const updatedFiles = [...prev]
                              updatedFiles[index] = pickedFile
                              return updatedFiles
                            })
                          }
                        }}
                      >
                        <ButtonIcon as={EditIcon} className="text-primary-400" />
                      </Button>
                      <Button
                        className="px-3"
                        variant='outline'
                        action='negative'
                        onPress={() => {
                          if (selectedFiles.length > 1)
                            setSelectedFiles(prev => prev.splice(index, 1))
                          else
                            setSelectedFiles([])
                        }}
                      >
                        <ButtonIcon as={TrashIcon} className="text-error-400">
                        </ButtonIcon>
                      </Button>
                    </View>
                  ))}
              </View>
            </View>
            <Button
              className='w-full bg-primary-50'
              variant='solid'
              size='lg'
              onPress={async () => {
                const pickedFile = await FileUploader.pickFile()
                if (pickedFile)
                  setSelectedFiles((prev) => [...prev, pickedFile])
              }}
            >
              <ButtonText className='text-primary-400'>Thêm</ButtonText>
              <ButtonIcon className='text-primary-400' as={FileIcon} />
            </Button>
          </View>
        </View>

        ,
      ],
    },
  ]
  return (
    <SafeAreaView className="h-full bg-white relative">
      {(filesUploadMutation.isPending || updateAssetMutation.isPending) &&
        <Loading texts={[
          {
            condition: filesUploadMutation.isPending,
            text: 'Đang tải file lên'
          },
          {
            condition: updateAssetMutation.isPending,
            text: 'Đang lưu...'
          }
        ]} />
      }
      <ScrollView ref={scrollViewRef} overScrollMode='never'>
        <View className='px-4 pb-4 flex flex-col '>
          <View className="bg-white h-[48px] pt-2 pb-4 flex flex-row justify-start gap-4 items-center">
            <Button variant="outline" action="default" className="border-outline-200 p-2" onPress={() => router.back()}>
              <ButtonIcon as={ChevronLeftIcon} className="h-6 w-6 text-typography-700" />
            </Button>
            <Text className='text-lg'>Chỉnh sửa</Text>
          </View>
          <View style={{ paddingTop: 8 }} className="flex flex-col gap-4">
            <Accordion
              className="flex-[1_0_0]"
              variant="unfilled"
              type="multiple"
              defaultValue={accorddionItems.map(i => i.key)}
            >
              {accorddionItems.map(i =>
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
                    <View className='flex flex-col gap-4 pb-3'>
                      {i.items}
                    </View>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </View>
          <View className='flex flex-row gap-4 mt-2 mb-4 justify-end'>
            <Button
              variant='outline'
              action='secondary'
              size='lg'
            // onPress={resetForm}
            >
              <ButtonText>Đặt lại</ButtonText>
            </Button>
            <Button
              variant='solid'
              action='primary'
              size='lg'
              onPress={handleSubmit}
            >
              <ButtonText>Hoàn thành</ButtonText>
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView >
  )
}

