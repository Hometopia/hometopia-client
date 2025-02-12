import { View, SafeAreaView, ScrollView, StyleSheet, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Href, Link, router, useLocalSearchParams } from 'expo-router'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { ScheduleResponseType } from '@/api/types/response'
import { ArrowLeftIcon, ArrowRightIcon, Calendar, CalendarCheckIcon, ChevronDownIcon, ChevronLeftIcon, EditIcon, TrashIcon } from 'lucide-react-native'
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ScheduleService } from '@/api/ScheduleService'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import MainContainer from '@/components/container/MainContainer'
import DeleteDialog from '@/components/custom/DeleteDialog'
import { compareAsc } from 'date-fns'
import Loading from '@/components/feedback/Loading'

export default function ScheduleDetails() {
  const { schedule_details, from } = useLocalSearchParams()


  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const queryClient = useQueryClient()

  const scheduleQuery = useQuery({
    queryKey: ['scheldule-details', schedule_details],
    queryFn: () => ScheduleService.getSchedule(schedule_details as string)
  })

  const scheduleUpdateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: ScheduleRequestType }) =>
      ScheduleService.updateSchedule(id, data),
    onSuccess: (res) => {
      scheduleQuery.refetch()
      if (from && from === 'asset')
        queryClient.refetchQueries({ queryKey: ['schedule-history', scheduleQuery.data.data.items[0].type, scheduleQuery.data.data.items[0].asset.id] })
      queryClient.refetchQueries({
        queryKey: ['schedule-list']
      })
    }
  })
  const scheduleDeleteMutation = useMutation({
    mutationFn: (id: string) => ScheduleService.deleteSchedule(id),
    onSuccess: (res) => {
      if (from && from === 'asset')
        queryClient.refetchQueries({
          queryKey: ['schedule-upcoming', scheduleQuery.data.data.items[0].type, scheduleQuery.data.data.items[0].asset.id]
        })
      queryClient.refetchQueries({
        queryKey: ['schedule-list']
      })
      backFn()
    }
  })
  // 
  const backFn = () => {
    if (!from) router.back()
    if (from === 'asset')
      router.push(`/(_main)/asset/${scheduleQuery.data.data.items[0].asset.id}/${scheduleQuery.data.data.items[0].type === ScheduleType.MAINTENANCE ? 'maintenance' : 'fix'}` as Href)
    else if (from === 'asset-back') {
      router.navigate({
        pathname: '/(_main)/calendar',
        params: {
          selected: dateToYYYYMMDD(new Date(scheduleQuery.data.data.items[0].start))
        }
      })
    }
  }
  useEffect(() => {
    const backAction = () => {
      backFn()
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => backHandler.remove()
  }, [])
  return (
    <BaseScreenContainer>
      {scheduleQuery.isFetched && <ScheduleDetailUpdateModal
        showModal={showModal}
        setShowModal={setShowModal}
        data={scheduleQuery.data.data.items[0]}
        updateFn={(id: string, data: ScheduleRequestType) => {
          scheduleUpdateMutation.mutate({ id, data })
        }} />}
      {scheduleQuery.isFetched &&
        <DeleteDialog text='lịch'
          show={showDeleteDialog}
          setShow={setShowDeleteDialog}
          deleteFn={() => {
            scheduleDeleteMutation.mutate(scheduleQuery.data.data.items[0].id)
          }} />
      }
      <MainContainer>
        <View className="h-[48px] pt-2 pb-4 flex flex-row justify-between">
          <Button
            variant="outline"
            action="default"
            className="border-outline-200 p-2  rounded-lg"
            onPress={backFn}
          >
            <ButtonIcon as={ChevronLeftIcon} className="h-6 w-6 text-typography-700" />
          </Button>
          <Menu
            className='p-2 '
            placement="bottom right"
            offset={5}
            disabledKeys={['Settings']}
            trigger={({ ...triggerProps }) => {
              return (
                <Button
                  variant="outline"
                  action="default"
                  className="border-outline-200 rounded-lg"
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
            <MenuItem key="Delete" textValue="Delete" onPress={() => setShowDeleteDialog(true)}>
              <Icon as={TrashIcon} size="md" className="mr-2 text-error-400" />
              <MenuItemLabel className='text-error-400' size="lg">Xóa</MenuItemLabel>
            </MenuItem>
          </Menu>
        </View>
        {scheduleQuery.isFetched ?
          <View style={{ paddingTop: 8 }} className="mb-4 flex flex-col gap-4 items-start">
            <Box className='p-4 flex-row gap-2 justify-center items-center bg-primary-400/15 rounded-xl self-stretch'>
              <Icon as={compareAsc(new Date(scheduleQuery.data.data.items[0].start), new Date()) === -1 ? CalendarCheckIcon : Calendar}
                size='xl' className='text-primary-400' />
              <Text className='text-lg text-primary-400 font-semibold'>
                {YYYYMMDDtoLocalDate(dateToYYYYMMDD(new Date(scheduleQuery.data.data.items[0].start)))}
              </Text>
            </Box>
            <Text className='text-2xl font-semibold mt-4 '>{scheduleQuery.data.data.items[0].title}</Text>
            <View className='px-4 py-1 rounded-full bg-warning-400/15 flex flex-row gap-2 items-center self-start'>
              <Text className='text-md font-normal text-warning-400'>
                {ScheduleTypeName[scheduleQuery.data.data.items[0].type as keyof typeof ScheduleTypeName]}
              </Text>
            </View>
            <View className='flex flex-row justify-between self-stretch'>
              <View>
                <Text className='text-lg font-bold'>Tên tài sản</Text>
                <Text className='text-lg'>{scheduleQuery.data.data.items[0].asset.name}</Text>
              </View>
              <Button className='bg-primary-400/10 rounded-lg' onPress={() =>
                router.push(`/(_main)/asset/${scheduleQuery.data.data.items[0].asset.id}`)}>
                <ButtonIcon as={ArrowRightIcon} className='text-primary-400' />
                <ButtonText className='text-primary-400'>Xem tài sản</ButtonText>
              </Button>
            </View>
            <View>
              <Text className='text-lg font-bold'>Chi phí dự kiến</Text>
              <Text className='text-lg'>{scheduleQuery.data.data.items[0].cost ? currencyFormatter().format(scheduleQuery.data.data.items[0].cost) : 'Không có'}</Text>
            </View>
            <View className='self-stretch'>
              <Text className='text-lg font-bold'>Bên cung cấp dịch vụ</Text>
              <View className='h-60 rounded-lg my-2'>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={StyleSheet.absoluteFillObject}
                  initialRegion={{
                    latitude: extractLatLng(scheduleQuery.data.data.items[0].vendor.link).latitude,
                    longitude: extractLatLng(scheduleQuery.data.data.items[0].vendor.link).longitude,
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
                      latitude: extractLatLng(scheduleQuery.data.data.items[0].vendor.link).latitude,
                      longitude: extractLatLng(scheduleQuery.data.data.items[0].vendor.link).longitude
                    }}
                    title={scheduleQuery.data.data.items[0].vendor.name}
                    description="Vị trí này được lấy từ Google Maps"
                  />
                </MapView>
              </View>
              <View className='flex flex-col py-2 gap-4'>
                <View className='flex flex-col'>
                  <Text className='text-lg font-bold'>Tên:</Text>
                  <Text className='text-lg'>{scheduleQuery.data.data.items[0].vendor.name}</Text>
                </View>
                <View className='flex flex-col'>
                  <Text className='text-lg font-bold'>Website:</Text>
                  <Link className='text-lg text-info-500 focus:text-info-500/50'
                    href={scheduleQuery.data.data.items[0].vendor.website as Href}>
                    {scheduleQuery.data.data.items[0].vendor.website}
                  </Link>
                </View>
                <View className='flex flex-col'>
                  <Text className='text-lg font-bold'>Điện thoại:</Text>
                  <Text className='text-lg'>{scheduleQuery.data.data.items[0].vendor.phoneNumber}</Text>
                </View>
              </View>
            </View>

          </View>
          :
          <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
        }
      </MainContainer>
    </BaseScreenContainer>
  )
}