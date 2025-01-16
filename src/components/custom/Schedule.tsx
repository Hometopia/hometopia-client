import { View, TouchableOpacity } from 'react-native'
import { Text } from '../ui/text';
import React from 'react'
import { Agenda, AgendaEntry, AgendaSchedule, DateData } from 'react-native-calendars'
import { dateToYYYYMMDD, getTime } from '@/helpers/time';
import { Card } from '../ui/card';
import { ScheduleResponseType } from '@/api/types/response';
import { Icon } from '../ui/icon';
import { ClockIcon } from 'lucide-react-native';
import { ScheduleTypeName } from '@/constants/data_enum';

type SchedulePropsType = {
  data: ScheduleResponseType[],
  selected: string,
  touchFn: Function
}
type CustomAgendaSchedule = {
  [date: string]: ScheduleResponseType[]
}

const responseToAgendaType = (data: ScheduleResponseType[]): CustomAgendaSchedule => {
  let tranfData: CustomAgendaSchedule = {}
  data.map(i => {
    const strTime = dateToYYYYMMDD(new Date(i.start))
    if (!tranfData[strTime]) {
      tranfData[strTime] = []
    }
    tranfData[strTime].push(i)
  })
  return tranfData
}

export default function Schedule({ data, selected, touchFn }: SchedulePropsType) {
  const [items, setItems] = React.useState<CustomAgendaSchedule>(responseToAgendaType(data));

  const renderItem = (item: ScheduleResponseType) => {
    return (
      <TouchableOpacity
        style={{ marginRight: 16, marginTop: 16 }}
        onPress={() => touchFn(item.id)}
      >
        <Card className='bg-white shadow-xl'>
          <View className='flex flex-col gap-2'>
            <View className='flex flex-col gap-2 items-start'>
              <Text className='text-2xl font-semibold pb-2'>{item.title}</Text>
              <View className='px-4 py-1 rounded-full bg-primary-400/15 flex flex-row gap-2 items-center self-start'>
                <Icon as={ClockIcon} size='md' className='text-primary-400' />
                <Text className='text-md font-normal text-primary-300'>
                  {getTime(new Date(item.start))} - {getTime(new Date(item.end))}
                </Text>
              </View>
              <View className='px-4 py-1 rounded-full bg-warning-400/15 flex flex-row gap-2 items-center self-start'>
                <Text className='text-md font-normal text-warning-400'>
                  {ScheduleTypeName[item.type as keyof typeof ScheduleTypeName]}
                </Text>
              </View>
            </View>
            <View className='flex flex-col px-4 py-2'>
              <Text className='text-lg font-normal text-typography-600'>Tài sản: {item.asset.name}</Text>
              <Text className='text-lg font-normal text-typography-600'>Dịch vụ: {item.vendor.name}</Text>
              <Text className='text-lg font-normal text-typography-600'>Website: {item.vendor.website}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    )
  }

  const renderEmptyDate = () => {
    return (
      <View className='flex h-40 pt-8'>
        <Text>Trống</Text>
      </View>
    )
  }

  return (
    <Agenda
      items={items}
      loadItemsForMonth={(date: DateData) => {

      }}
      selected={selected}
      renderItem={renderItem}
      renderEmptyData={renderEmptyDate}
      showClosingKnob={true}
    />
  )
}