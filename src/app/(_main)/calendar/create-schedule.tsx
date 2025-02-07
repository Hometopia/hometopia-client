import { View, Text, SafeAreaView, ScrollView, StyleSheet, findNodeHandle } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Href, router, useLocalSearchParams, useNavigation } from 'expo-router'
import BackButton from '@/components/custom/BackButton'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { Input, InputField, InputSlot } from '@/components/ui/input'
import { ScheduleType } from '@/constants/data_enum'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Loading from '@/components/feedback/Loading'
import { ResponseBaseType } from '@/api/types/response'
import DatePicker from '@/components/custom/DatePicker'
import useFormControl from '@/hooks/useFormControl'
import TimePicker from '@/components/custom/TimePicker'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { ClassificationService } from '@/api/ClassificationService'
import { VendorService } from '@/api/VendorService'
import VendorCard from '@/components/custom/VendorCard'
import { ArrowBigLeft, ArrowBigRight, ArrowRight, CalendarDaysIcon, CoinsIcon, CurrencyIcon, LocateIcon, MapIcon, PinIcon } from 'lucide-react-native'
import ControllableInput from '@/components/custom/ControllableInput'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import useFormSubmit from '@/hooks/useFormSubmit'
import { VendorType } from '@/api/types/common'
import { ScheduleService } from '@/api/ScheduleService'
import { ScheduleType as ScheduleRequestType } from '@/api/types/request'
import { useToast } from '@/components/ui/toast'
import CommonToast from '@/components/feedback/CommonToast'
import { deformatNumber, formatNumber } from '@/helpers/currency'

enum inputFieldNameList {
  title
}

export default function CreateSchedule() {
  const { asset_id, type } = useLocalSearchParams()
  const values = useGlobalContext()

  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)


  // queries
  const queryClient = useQueryClient()
  const assetQuery: ResponseBaseType | undefined = queryClient.getQueryData(['asset', asset_id])
  const predictCategoryQuery = useQuery({
    queryKey: ['predict-category', asset_id],
    queryFn: () => ClassificationService.getPredictCategoryByImg(assetQuery?.data?.images[0].fileName as string),
    enabled: assetQuery !== undefined
  })

  const vendorsQuery = useQuery({
    queryKey: ['vendors', asset_id, values.location?.coords.latitude, values.location?.coords.longitude],
    queryFn: () => VendorService.getListVendor(
      page, size,
      predictCategoryQuery.data.prediction,
      values.location?.coords.latitude || 10, values.location?.coords.longitude || 10
    ),
    enabled: predictCategoryQuery.isFetched,
    initialData: []
  })

  const createScheduleMutation = useMutation({
    mutationFn: (scheduleData: ScheduleRequestType) => ScheduleService.createSchedule(scheduleData),
    onSuccess: (res) => {
      if (res) {
        switch (res.status) {
          case 200:
          case 201:
            {
              successToast.handleToast()
              queryClient.refetchQueries({
                queryKey: ['schedule-upcoming', type, asset_id]
              })
              router.navigate(`/(_main)/asset/${asset_id}/${type === ScheduleType.MAINTENANCE ? 'maintenance' : 'fix'}` as Href)
              return
            }
        }
      }
      errorToast.handleToast()
    },
    onError: (err) => errorToast.handleToast()
  })
  // fb
  const toast = useToast()
  const successToast = CommonToast({
    toast: toast,
    title: "Tạo lịch thành công",
    description: `Lịch đã được tạo thành công. Bạn có thể xem chi tiết tại mục lịch của bạn`,
    variant: "success"
  })
  const errorToast = CommonToast({
    toast: toast,
    title: "Tạo lịch thất bại",
    description: "",
    variant: "error"
  })
  //Scroll behaviour
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

  // ctrl
  const titleControl = useFormControl(type === ScheduleType.MAINTENANCE ?
    `Bảo trì ${assetQuery?.data.name}`
    :
    `Sửa chữa ${assetQuery?.data.name}`, (v) => {
      return v !== ""
    })
  const costControl = useFormControl("", (v) => true)
  const dateControl = useFormControl("", (v) => v !== "")
  const startControl = useFormControl("", (v) => true)
  const endControl = useFormControl("", (v) => true)
  const [vendor, setVendor] = useState<VendorType | undefined>(undefined)
  const validateAll = () => {
    titleControl.validate()
    dateControl.validate()
    startControl.validate()
    endControl.validate()
    costControl.validate()
  }

  const goToNextStep = async () => {
    const validArray = [
      titleControl.isValid,
      dateControl.isValid,
      startControl.isValid,
      endControl.isValid,
      costControl.isValid
    ]

    for (var i: number = 0; i < validArray.length; i++) {
      if (validArray[i] === false) {
        console.log('kk', i)
        scrollTo(await getOffsetByIndex(i))
        return
      }
    }

    createScheduleMutation.mutate({
      title: titleControl.value,
      start: `${dateControl.value}T${startControl.value !== '' ? startControl.value : '07:00:00'}`,
      end: `${dateControl.value}T${startControl.value !== '' ? startControl.value : '07:00:00'}`,
      vendor: vendor,
      cost: costControl.value !== '' ? Number(deformatNumber(costControl.value)) : undefined,
      documents: [],
      type: type,
      assetId: asset_id
    } as ScheduleRequestType)

  }

  const { handleSubmit } = useFormSubmit(validateAll, goToNextStep)
  // local components
  const SectionHead = ({ children, text }: { children?: React.ReactNode, text: string }) => (
    <View className='my-2 px-4 py-2 rounded-md bg-primary-400/10 flex flex-row gap-2 items-center'>
      {children}
      <Text className='text-lg font-bold text-primary-400'>
        {text}
      </Text>
    </View>
  )
  const Location = (
    <View className='self-stretch mb-2'>
      <SectionHead text='Vị trí của bạn'>
        <Icon as={LocateIcon} className='text-primary-400 w-6 h-6' />
      </SectionHead>
      <Text className='text-lg font-normal italic'>Vị trí này được lấy từ GPS </Text>
      <View className='h-60 rounded-lg my-2'>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: values.location?.coords.latitude || 10,
            longitude: values.location?.coords.longitude || 10,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: values.location?.coords.latitude || 10,
              longitude: values.location?.coords.longitude || 10
            }}
            description="Vị trí này được lấy từ Google Maps"
          />
        </MapView>
      </View>
    </View>
  )
  const Vendors = (
    <View className='flex flex-col gap-2 mb-2'>
      <SectionHead text='Dịch vụ gần đây'>
        <Icon as={MapIcon} className='text-primary-400 w-6 h-6' />
      </SectionHead>
      {vendorsQuery.isPending ?
        <Loading
          texts={[{
            condition: true,
            text: "Đang tải..."
          }]} />
        :
        <ScrollView horizontal={true} overScrollMode='never'>
          <View className='flex flex-row gap-2'>
            {vendorsQuery.data.data?.items?.map((i: VendorType) =>
              <VendorCard
                key={i.name}
                data={i}
                isChosen={vendor?.address === i.address}
                choosenFn={() => setVendor(i)}
                cancelFn={() => setVendor(undefined)}
              />)}
          </View>
        </ScrollView>
      }
      {/* <View className='flex flex-row justify-end'>
        <Button variant='outline' action='primary'>
          <ButtonIcon as={ArrowRight} />
          <ButtonText>Xem thêm</ButtonText>
        </Button>
      </View> */}
    </View>
  )
  const Title = (
    <View className='flex flex-col mb-2'>
      {assetQuery?.data === undefined ?
        <Skeleton variant='rounded' className='h-8' />
        :
        <ControllableInput key={'title'} control={titleControl} label="Tên lịch" errorText='Giờ kết thúc không thể trống hoặc sớm hơn giờ bắt đầu'
          input={
            <Input size="lg" ref={(el) => (elementsRef.current[inputFieldNameList.title] = el)}>
              <InputField
                type='text'
                value={titleControl.value}
                onChangeText={titleControl.onChange}
              />
            </Input>
          }

        />

      }
    </View>
  )
  const Time = (
    <View className='flex flex-col gap-4 mb-2'>
      <View>
        <SectionHead text='Thời gian'>
          <Icon as={CalendarDaysIcon} className='text-primary-400 w-6 h-6' />
        </SectionHead>
        <Text className='text-lg font-normal italic'>
          Liên hệ với bên cung cấp dịch vụ của bạn trước
        </Text>
      </View>
      <ControllableInput key={'date'} control={dateControl} label="Ngày" errorText='Ngày không thể trống'
        input={
          <DatePicker
            value={dateControl.value}
            onChange={dateControl.onChange}
            placeholder='Chọn ngày'
          />
        }
      />

      <ControllableInput key={'start'} control={startControl} label="Bắt đầu" errorText='Giờ bắt đầu không thể trống hoặc muộn hơn kết thúc'
        input={
          <TimePicker
            value={startControl.value}
            onChange={startControl.onChange}
            placeholder='Chọn giờ bắt đầu'
          />
        }
        isRequired={false}
      />


    </View>
  )
  const Cost = (
    <View className='flex flex-col mb-2'>
      <SectionHead text='Chi phí'>
        <Icon as={CoinsIcon} className='text-primary-400 w-6 h-6' />
      </SectionHead>
      <ControllableInput key={'cost'} control={costControl} label="Chi phí" errorText=''
        isRequired={false}
        input={
          <Input size="lg">
            <InputField
              // type="text"
              inputMode="numeric"
              placeholder="Nhập chi phí dự kiến. Đơn vị hiện là VND"
              value={costControl.value}
              onChangeText={(v) => {
                const formatValue = formatNumber(v)
                costControl.onChange(formatValue)
              }}

            />
            <InputSlot >
              <Text className='px-4'>₫</Text>
            </InputSlot>
          </Input>
        }
      />
    </View>
  )

  const ButtonGroup = (
    <View className='flex flex-row gap-4 justify-end'>
      <Button className='rounded-lg' variant='outline' action='secondary' size='lg'
        onPress={() => {
          titleControl.reset()
          dateControl.reset()
          startControl.reset()
          endControl.reset()
          costControl.reset()
          setVendor(undefined)
        }}
      >
        <ButtonText>Đặt lại</ButtonText>
      </Button>
      <Button
        className='rounded-lg'
        size='lg'
        onPress={handleSubmit}
      >
        <ButtonText>Hoàn thành</ButtonText>
      </Button>
    </View>
  )
  return (
    <SafeAreaView className="h-full bg-white">
      {createScheduleMutation.isPending ?
        <Loading texts={[{
          condition: true,
          text: 'Đang tạo...'
        }]} />
        :
        <ScrollView className='px-4' overScrollMode='never'>
          <View className="bg-white h-[48px] pt-2 pb-4 flex flex-row justify-between">
            <BackButton backFn={() => {
              router.navigate(`/(_main)/asset/${asset_id}/${type === ScheduleType.MAINTENANCE ? 'maintenance' : 'fix'}` as Href)
            }} />
          </View>
          <View className='flex flex-col gap-4 py-4'>
            {Title}
            {Location}
            {Vendors}
            {Time}
            {Cost}
            {ButtonGroup}
          </View>
        </ScrollView>
      }

    </SafeAreaView>
  )
}