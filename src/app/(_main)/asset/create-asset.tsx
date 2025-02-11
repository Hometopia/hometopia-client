import { View, SafeAreaView, ScrollView, findNodeHandle, TouchableOpacity, Text } from 'react-native'
import React, { useRef, useState } from 'react'
import { router } from 'expo-router'
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
import { CategoryResponseType, FileUploadResponseType } from '@/api/types/response'
import { Textarea, TextareaInput } from '@/components/ui/textarea'
import { dateToYYYYMMDD, stringToDate } from '@/helpers/time'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { currencyFormatter, deformatNumber, formatNumber } from '@/helpers/currency'
import { Popover, PopoverBackdrop, PopoverBody, PopoverContent } from '@/components/ui/popover'
import { BrandService } from '@/api/BrandService'
import VendorSearchModal from '@/components/custom/VendorSearchModal'
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
import { FileInfoType } from '@/api/types/common'
import AddImageTrigger from '@/components/custom/AddImageTrigger'
import { useImageManipulator } from '@/hooks/useImageManipulator'
import MainContainer from '@/components/container/MainContainer'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import Loading from '@/components/feedback/Loading'
import BackButton from '@/components/custom/BackButton'
import { DEFAULT_PAGE_SIZE } from '@/constants/config'

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

export default function CreateAsset() {

  const queryClient = useQueryClient()

  //#region Queries

  const createAssetMutation = useMutation({
    mutationKey: ['createAsset'],
    mutationFn: async () => AssetService.createAsset({
      name: nameControl.value,
      description: descontrol.value,
      images: [imgInfo || null],
      purchaseDate: purchaseDateControl.value,
      purchasePlace: purchasePlaceControl.value,
      purchasePrice: Number(deformatNumber(purchasePriceControl.value)),
      brand: vendorControl.value,
      serialNumber: serialNumberControl.value,
      locationId: locationControl.value ? locationControl.value : null,
      warrantyExpiryDate: warrantyExpiryDateControl.value,
      documents: documentInfo || null,
      status: statusControl.value,
      maintenanceCycle: null,
      categoryId: categoryControl.value
    } as AssetType),
    onSuccess: (res) => {
      if (res) {
        switch (res.status) {
          case 201:
          case 200: {
            queryClient.refetchQueries({
              queryKey: ['asset-list', 1, DEFAULT_PAGE_SIZE, '', '', '',]
            })
            successToast.handleToast()
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
                setImgInfo(res.data.items[0].data as FileInfoType)
              if (selectedFiles && imgPicked) {
                const [img, ...rest] = res.data.items
                setdocumentInfo(rest.map((i: any) => i.data))
              }
              else if (selectedFiles) {
                setdocumentInfo(res.data.items.map((i: any) => i.data))
              }
              setIsFileUpload(true)
              break
            }
          default:
            console.error('from file upload success mutate', res)
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
    title: "Tạo tài sản thành công",
    description: "Tài sản đã được tạo thành công",
    variant: "success"
  })
  const errorToast = CommonToast({
    toast: toast,
    title: "Tạo tài sản thất bại",
    description: "Tài sản chưa được tạo",
    variant: "error"
  })
  //#endregion

  //#region File 
  const FileUploader = useFileUploader()
  const [imgPicked, setImgPicked] = useState<DocumentPicker.DocumentPickerAsset>()
  const [selectedFiles, setSelectedFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([])
  const [isConfirmUpload, setIsConfirmUpload] = useState(true)
  const ImgManipulator = useImageManipulator()
  //#endregion

  //#region Form control

  //overview
  const nameControl = useFormControl("", (value): boolean => {
    return value !== ""
  })
  const categoryControl = useFormControl("", (value): boolean => {
    return value !== ""
  })
  const descontrol = useFormControl("", (value): boolean => {
    return true
  })
  const [imgInfo, setImgInfo] = useState<FileInfoType>()
  //
  const purchaseDateControl = useFormControl("", (value): boolean => {
    return value !== ""
  })
  const purchasePlaceControl = useFormControl("", (value): boolean => {
    return true
  })
  const purchasePriceControl = useFormControl("", (value): boolean => {
    return value !== ""
  })
  const vendorControl = useFormControl("", (value): boolean => {
    return true
  })
  const serialNumberControl = useFormControl("", (value): boolean => {
    return true
  })
  //
  const statusControl = useFormControl(AssetStatusList[0], (value): boolean => {
    return value !== ""
  })
  const locationControl = useFormControl("", (value): boolean => {
    return true
  })
  //
  const warrantyExpiryDateControl = useFormControl("", (value): boolean => {
    return true
  })
  const documentControl = useFormControl("", (value): boolean => {
    return true
  })
  const [documentInfo, setdocumentInfo] = useState([])

  const [isFileUpload, setIsFileUpload] = useState<boolean>(false)

  const validateAll = () => {
    nameControl.validate()
    categoryControl.validate()
    descontrol.validate()
    purchaseDateControl.validate()
    purchasePlaceControl.validate()
    purchasePriceControl.validate()
    vendorControl.validate()
    serialNumberControl.validate()
    statusControl.validate()
    locationControl.validate()
    warrantyExpiryDateControl.validate()
  }

  const goToNextStep = async () => {
    const validArray = [
      nameControl.isValid,
      categoryControl.isValid,
      descontrol.isValid,
      purchaseDateControl.isValid,
      purchasePlaceControl.isValid,
      purchasePriceControl.isValid,
      vendorControl.isValid,
      serialNumberControl.isValid,
      statusControl.isValid,
      locationControl.isValid,
      warrantyExpiryDateControl.isValid,
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
      createAssetMutation.mutate()
    }
  }
  useAsyncExec({
    condition:
      imgPicked !== undefined &&
      imgPicked.size !== undefined &&
      imgPicked.size >= 500000, callback: async () => {
        if (imgPicked !== undefined) {
          if (imgPicked.size && imgPicked.size >= 500000) {
            const tmpUri = await ImgManipulator.compressImage(imgPicked.uri, Math.ceil((500000 / imgPicked.size) * 100) / 100)
            setImgPicked({
              ...imgPicked,
              uri: tmpUri,
              size: Math.round(imgPicked.size * (Math.ceil((500000 / imgPicked.size) * 100) / 100))
            } as DocumentPicker.DocumentPickerAsset)
            setIsConfirmUpload(true)
          }
        }
      }
  })
  useAsyncExec({ condition: isFileUpload, callback: createAssetMutation.mutate })
  const { handleSubmit } = useFormSubmit(validateAll, goToNextStep)

  const resetForm = () => {
    nameControl.reset()
    categoryControl.reset()
    descontrol.reset()
    purchaseDateControl.reset()
    purchasePlaceControl.reset()
    purchasePriceControl.reset()
    vendorControl.reset()
    serialNumberControl.reset()
    statusControl.reset()
    locationControl.reset()
    warrantyExpiryDateControl.reset()
    setImgPicked(undefined)
    setSelectedFiles([])

    scrollTo(0)
  }
  //#endregion

  //#region category
  const [categoryModalShow, setCategoryModalShow] = React.useState(false)
  const categoryFullList = useQuery({
    queryKey: ['categoryFullList'],
    queryFn: CategoryService.getAllCategory,
  })
  const getCategoryName = (): string => {
    return categoryFullList.data?.data.items.find((i: CategoryResponseType) => i.id === categoryControl.value)?.name
  }
  //#endregion

  //#region vendor Popover
  const [isSuggestedVendorOpen, setIsSuggestedVendorOpen] = React.useState(false)
  const suggestedVendorQuery = useQuery({
    queryKey: ['suggestedVendor', vendorControl.value],
    queryFn: () => BrandService.getSuggestedListBrand(vendorControl.value.toLowerCase()),
    enabled: isSuggestedVendorOpen
  })
  //#endregion

  const accorddionItems = [
    {
      key: 'overview',
      label: 'Tổng quan',
      items: [
        <ControllableInput key={1} control={nameControl} label="Tên tài sản" errorText='Tên tài sản không được để trống'
          input={
            <Input
              className="text-center"
              size="lg"
              ref={(el) => (elementsRef.current[inputFieldNameList.name] = el)}>
              <InputField
                type="text"
                placeholder="Nhập tên tài sản"
                value={nameControl.value}
                onChangeText={nameControl.onChange} />
            </Input>}
        />,
        <ControllableInput key={2} control={categoryControl} label="Danh mục" errorText='Danh mục không được để trống'
          input={
            <>
              <CategoryPickerModal
                showModal={categoryModalShow}
                setShowModal={setCategoryModalShow}
                data={categoryFullList.data?.data.items as CategoryResponseType[]}
                pickFn={categoryControl.onChange}
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
        <ControllableInput key={3} control={descontrol} label="Mô tả" errorText='' isRequired={false}
          input={
            <Textarea size='lg' ref={(el) => (elementsRef.current[inputFieldNameList.desc] = el)}>
              <TextareaInput
                placeholder="Thêm mô tả cho tài sản này"
                value={descontrol.value}
                onChangeText={descontrol.onChange}
              />
            </Textarea>
          }
        />,
        <View key={4} className='flex flex-col gap-2'>
          <Text className="text-md text-typography-500">
            Hình ảnh
          </Text>
          <View className='flex flex-col gap-4'>
            {imgPicked &&
              <View className='flex flex-col items-center'>
                <Image
                  className="rounded-lg"
                  size='2xl'
                  source={{ uri: imgPicked.uri }}
                  alt="asset img"
                />
              </View>}
            <AddImageTrigger imgPicked={imgPicked} setImgPicked={
              (i: DocumentPicker.DocumentPickerAsset) => {
                setImgPicked(i)

                if (imgPicked !== undefined) {
                  if (imgPicked.size && imgPicked.size >= 500000) {
                    setIsConfirmUpload(false)
                  }
                }
              }} />
          </View>
        </View>
      ],
    },
    {
      key: 'purchase',
      label: 'Thông tin mua hàng',
      items: [
        <ControllableInput key={0} control={purchaseDateControl} label="Ngày mua hàng" errorText='Ngày mua không thể trống'
          input={
            <View ref={(el) => (elementsRef.current[inputFieldNameList.purDate] = el)}>
              <DatePicker
                value={purchaseDateControl.value}
                onChange={purchaseDateControl.onChange}
                placeholder='Chọn ngày mua hàng'
              />
            </View>
          }
        />,

        <ControllableInput key={2} control={purchasePriceControl} label="Giá mua" errorText='Giá mua không thể trống'
          input={
            <Input className="text-center" size="lg" ref={(el) => (elementsRef.current[inputFieldNameList.purPrice] = el)}>
              <InputField
                type="text"
                inputMode="numeric"
                placeholder="Nhập giá mua. Đợn vị hiện là VND"
                value={purchasePriceControl.value}
                onChangeText={(v) => {
                  const formatValue = formatNumber(v)
                  purchasePriceControl.onChange(formatValue)
                }} />
              <InputSlot >
                <Text className='px-4 text-typography-800'>₫</Text>
              </InputSlot>
            </Input>
          }
        />,
        <ControllableInput key={1} control={purchasePlaceControl} label="Nơi mua hàng" errorText='Nơi mua không thể trống' isRequired={false}
          input={
            <Input
              className="text-center"
              size="lg"
              ref={(el) => (elementsRef.current[inputFieldNameList.purPlace] = el)}
            >
              <InputField
                type="text"
                placeholder="Nhập nơi mua"
                value={purchasePlaceControl.value}
                onChangeText={purchasePlaceControl.onChange} />
            </Input>
          }
        />,
        <ControllableInput key={3} control={vendorControl} label="Nhà cung cấp" errorText='Nhà cung cấp không thể trống' isRequired={false}
          input={
            <>
              <VendorSearchModal
                showModal={isSuggestedVendorOpen}
                setShowModal={setIsSuggestedVendorOpen}
                data={suggestedVendorQuery.data?.data.items}
                pickFn={vendorControl.onChange}
                seachValue={vendorControl.value}
                searchChange={vendorControl.onChange}
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
                  value={vendorControl.value}
                  onChangeText={vendorControl.onChange} />
              </Input>
            </>

          }
        />,
        <ControllableInput key={4} control={serialNumberControl} label="Số serial" errorText='Số serial không thể trống' isRequired={false}
          input={
            <Input
              className="text-center"
              size="lg"
              ref={(el) => (elementsRef.current[inputFieldNameList.serial] = el)}
            >
              <InputField
                type="text"
                placeholder="Nhập số serial"
                value={serialNumberControl.value}
                onChangeText={serialNumberControl.onChange} />
            </Input>
          }
        />,
      ],
    },
    {
      key: 'use',
      label: 'Thông tin sử dụng',
      items: [
        <ControllableInput key={1} control={statusControl} label="Trạng thái sử dụng" errorText=''
          input={
            <Select
              selectedValue={statusControl.value}
              initialLabel={AssetStatusListMapToDisplayText[AssetStatusList[0] as keyof typeof AssetStatusListMapToDisplayText]}
              defaultValue={AssetStatusList[0]}
              onValueChange={(v) => statusControl.onChange(v)}
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
        <ControllableInput key={2} control={locationControl} label="Vị trí" errorText='Vị trí không thể trống' isRequired={false}
          input={
            <Input
              className="text-center"
              size="lg"
              ref={(el) => (elementsRef.current[inputFieldNameList.location] = el)}
            >
              <InputField
                type="text"
                placeholder="Nhập vị trí"
                value={locationControl.value}
                onChangeText={locationControl.onChange} />
            </Input>
          }
        />,
      ],
    },
    {
      key: 'warranty',
      label: 'Bảo hành',
      items: [
        <ControllableInput key={1} control={warrantyExpiryDateControl} label="Ngày kết thúc bảo hành" errorText='Ngày kết thúc không thể trống' isRequired={false}
          input={
            <View ref={(el) => (elementsRef.current[inputFieldNameList.warranDate] = el)}>
              <DatePicker
                value={warrantyExpiryDateControl.value}
                onChange={warrantyExpiryDateControl.onChange}
                placeholder='Chọn ngày kết thúc'
              />
            </View>
          }
        />,
        <ControllableInput key={2} control={documentControl} label="Thẻ bảo hành , hóa đơn" errorText='' isRequired={false}
          input={
            <View className='flex flex-col rounded-xl overflow-hidden'>
              <View className="flex flex-row">
                <View className="flex flex-col grow">
                  <View className='px-6 py-4 bg-background-50 h-14'>
                    <Text className="text-md font-bold text-typography-900">
                      Tên
                    </Text>
                  </View>
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
                      Mô tả
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
                className='w-full bg-primary-400/10'
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
          }
        />,
      ],
    },
  ]
  return (
    <BaseScreenContainer>
      {filesUploadMutation.isPending || createAssetMutation.isPending &&
        <View className='h-full flex justify-center items-center'>
          <Loading texts={[
            { condition: filesUploadMutation.isPending, text: 'Đang tải file lên' },
            { condition: createAssetMutation.isPending, text: 'Đang tạo...' },
          ]} />
        </View>
      }
      <ScrollView ref={scrollViewRef} overScrollMode='never'>
        <View className='px-4 pb-4 flex flex-col '>
          <View className="h-[48px] pt-2 pb-4 flex flex-row justify-between">
            <BackButton backFn={() => router.back()} />
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
                  <AccordionHeader className="bg-primary-400/10 px-4 py-2 rounded-xl">
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
              className='rounded-lg'
              variant='outline'
              action='secondary'
              size='lg'
              onPress={resetForm}
            >
              <ButtonText>Đặt lại</ButtonText>
            </Button>
            <Button
              className='rounded-lg'
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
    </ BaseScreenContainer>
  )
}

