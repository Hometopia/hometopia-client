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
import { primaryColor } from '@/constants/color';

type SchedulePropsType = {
  data: ScheduleResponseType[],
  selected: string,
  touchFn: Function,
  theme?: 'light' | 'dark'
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

export default function Schedule({ data, selected, touchFn, theme = 'light' }: SchedulePropsType) {
  const [items, setItems] = React.useState<CustomAgendaSchedule>(responseToAgendaType(data));

  const renderItem = (item: ScheduleResponseType) => {
    if (item.vendor === null)
      return null
    return (
      <TouchableOpacity
        style={{ marginRight: 16, marginTop: 16 }}
        onPress={() => touchFn(item.id)}
      >
        <Card className='bg-background-0 border border-outline-100 rounded-xl'>
          <View className='flex flex-col gap-2'>
            <View className='flex flex-col gap-2 items-start'>
              <Text className='text-2xl font-semibold pb-2'>{item.title}</Text>

              <View className='px-4 py-1 rounded-full bg-warning-400/15 flex flex-row gap-2 items-center self-start'>
                <Text className='text-md font-normal text-warning-400'>
                  {ScheduleTypeName[item.type as keyof typeof ScheduleTypeName]}
                </Text>
              </View>
            </View>
            <View className='flex flex-col py-2'>
              <Text className='text-lg font-normal text-typography-600 italic'>Tài sản: {item.asset.name}</Text>
              <Text className='text-lg font-normal text-typography-600 italic'>Dịch vụ: {item.vendor.name}</Text>
              <Text className='text-lg font-normal text-typography-600 italic'>Website: {item.vendor.website}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    )
  }

  const renderEmptyDate = () => {
    return (
      <View className='h-full flex flex-col justify-center items-center'>
        <Text className='text-typography-600'>Trống</Text>
      </View>
    )
  }

  return (
    <Agenda
      showOnlySelectedDayItems
      items={items}
      selected={selected}
      renderItem={renderItem}
      renderEmptyData={renderEmptyDate}
      showClosingKnob={true}
      theme={{
        "stylesheet.agenda.main": {
          reservations: {
            backgroundColor: theme === 'dark' ? 'rgb(18 18 18)' : '#fff',
            flex: 1,
            marginTop: 64 + 32,
            paddingVertical: 16,
          },
        },
        calendarBackground: theme === 'dark' ? 'rgb(18 18 18)' : '#fff',
        selectedDayBackgroundColor: `rgba(${primaryColor[400].replace(/ /g, ', ')}, 1.0)`,
      }}
    />
  )
}