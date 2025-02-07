import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Href, Link, router, useLocalSearchParams } from 'expo-router'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { ScheduleResponseType } from '@/api/types/response'
import { ArrowLeftIcon, ArrowRightIcon, CalendarCheckIcon, ChevronDownIcon, ChevronLeftIcon, EditIcon, TrashIcon } from 'lucide-react-native'
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu'
import { Icon } from '@/components/ui/icon'
import { Box } from '@/components/ui/box'
import { dateToYYYYMMDD, getTime, YYYYMMDDtoLocalDate } from '@/helpers/time'
import { ScheduleType, ScheduleTypeName } from '@/constants/data_enum'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { extractLatLng } from '@/helpers/map'
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BR } from '@expo/html-elements'
import ScheduleDetailUpdateModal from '@/components/custom/ScheduleDetailUpdateModal'
import { currencyFormatter } from '@/helpers/currency'
import { ScheduleType as ScheduleRequestType } from '@/api/types/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ScheduleService } from '@/api/ScheduleService'

export default function ScheduleDetails() {
  const { schedule_details, data, from } = useLocalSearchParams()
  const [parseData, setParseData] = useState<ScheduleResponseType>(JSON.parse(data as string))
  const [coordinator, setCoordinator] = useState(extractLatLng(JSON.parse(data as string).vendor.link))

  const [showModal, setShowModal] = useState(false)

  const queryClient = useQueryClient()

  const scheduleUpdateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: ScheduleRequestType }) =>
      ScheduleService.updateSchedule(id, data),
    onSuccess: (res) => {

      if (from && from === 'asset')
        queryClient.refetchQueries({ queryKey: ['schedule-history', parseData.type, parseData.asset.id] })
    }
  })
  const scheduleDeleteMutation = useMutation({
    mutationFn: (id: string) => ScheduleService.deleteSchedule(id),
    onSuccess: (res) => {
      if (from && from === 'asset')
        queryClient.refetchQueries({
          queryKey: ['schedule-upcoming', parseData.type, parseData.asset.id]
        })
    }
  })
  // const 
  return (
    <SafeAreaView className="h-full bg-white">
      <ScheduleDetailUpdateModal
        showModal={showModal}
        setShowModal={setShowModal}
        data={parseData}
        updateFn={(id: string, data: ScheduleRequestType) => {
          scheduleUpdateMutation.mutate({ id, data })
          setParseData({
            ...parseData,
            title: data.title,
            start: data.start,
            end: data.end || data.start,
            cost: data.cost,

          })
        }}
      />
      <ScrollView className='pb-2 px-4' overScrollMode='never'>
        <View className="bg-white h-[48px] pt-2 pb-4 flex flex-row justify-between">
          <Button
            variant="outline"
            action="default"
            className="border-outline-200 p-2"
            onPress={() => {
              if (from && from === 'asset')
                router.navigate(`/(_main)/asset/${parseData.asset.id}/${parseData.type === ScheduleType.MAINTENANCE ? 'maintenance' : 'fix'}` as Href)
              else
                router.back()
            }}
          >
            <ButtonIcon as={ChevronLeftIcon} className="h-6 w-6 text-typography-700" />
          </Button>
          <Menu
            className='p-2'
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
            <MenuItem key="Edit" textValue="Edit" onPress={() => setShowModal(true)}>
              <Icon as={EditIcon} size="md" className="mr-2" />
              <MenuItemLabel size="lg">Chỉnh sửa</MenuItemLabel>
            </MenuItem>
            <MenuItem key="Delete" textValue="Delete">
              <Icon as={TrashIcon} size="md" className="mr-2" />
              <MenuItemLabel size="lg">Xóa</MenuItemLabel>
            </MenuItem>
          </Menu>
        </View>
        <View style={{ paddingTop: 8 }} className="mb-4 flex flex-col gap-4 items-start">
          <Box className='p-4 flex-row gap-2 justify-center items-center bg-primary-400/15 rounded-xl self-stretch'>
            <Icon as={CalendarCheckIcon} size='xl' className='text-primary-400' />
            <Text className='text-lg text-primary-400 font-semibold'>
              {YYYYMMDDtoLocalDate(dateToYYYYMMDD(new Date(parseData.start)))}
            </Text>
          </Box>
          <Text className='text-2xl font-semibold mt-4 '>{parseData.title}</Text>
          <View className='px-4 py-1 rounded-full bg-warning-400/15 flex flex-row gap-2 items-center self-start'>
            <Text className='text-md font-normal text-warning-400'>
              {ScheduleTypeName[parseData.type as keyof typeof ScheduleTypeName]}
            </Text>
          </View>
          <View className='flex flex-row justify-between self-stretch'>
            <View>
              <Text className='text-lg font-bold'>Tên tài sản</Text>
              <Text className='text-lg'>{parseData.asset.name}</Text>
            </View>
            <Button className='bg-primary-400/15' onPress={() =>
              router.navigate(`/(_main)/asset/${parseData.asset.id}`)}>
              <ButtonIcon as={ArrowRightIcon} className='text-primary-400' />
              <ButtonText className='text-primary-400'>Xem tài sản</ButtonText>
            </Button>
          </View>
          <View>
            <Text className='text-lg font-bold'>Chi phí dự kiến</Text>
            <Text className='text-lg'>{parseData.cost ? currencyFormatter().format(parseData.cost) : 'Không có'}</Text>
          </View>
          <View className='self-stretch'>
            <Text className='text-lg font-bold'>Bên cung cấp dịch vụ</Text>
            <View className='h-60 rounded-lg my-2'>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
                initialRegion={{
                  latitude: coordinator.latitude,
                  longitude: coordinator.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                <Marker
                  coordinate={{ latitude: coordinator.latitude, longitude: coordinator.longitude }}
                  title="LAPTOP MINH THUẬN"
                  description="Vị trí này được lấy từ Google Maps"
                />
              </MapView>
            </View>
            <View className='flex flex-col py-2 gap-4'>
              <View className='flex flex-col'>
                <Text className='text-lg font-bold'>Tên:</Text>
                <Text className='text-lg'>{parseData.vendor.name}</Text>
              </View>
              <View className='flex flex-col'>
                <Text className='text-lg font-bold'>Website:</Text>
                <Link className='text-lg text-info-500 focus:text-info-500/50'
                  href={parseData.vendor.website as Href}>
                  {parseData.vendor.website}
                </Link>
              </View>
              <View className='flex flex-col'>
                <Text className='text-lg font-bold'>Điện thoại:</Text>
                <Text className='text-lg'>{parseData.vendor.phoneNumber}</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}