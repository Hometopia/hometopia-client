import { View, Text } from 'react-native'
import { Button, ButtonGroup, ButtonIcon, ButtonText } from '../ui/button'
import { Calendar, CalendarDaysIcon, TrashIcon } from 'lucide-react-native'
import { useState } from 'react'
import { ScheduleResponseType } from '@/api/types/response'
import { dateToYYYYMMDD } from '@/helpers/time'
import ProgressBar from './ProgressBar'


const backupData = {
  maintenance: {
    blank: "Tài sản này chưa được lên lịch bảo trì.",
    full: "Bảo trì sẽ bắt đầu vào ngày 20/09/2025. Còn 1 năm nữa."
  },
  fix: {
    blank: "Nếu tài sản này có vẻ như đang hỏng, lên lịch sửa chữa ngay",
    full: "Sửa chữa sẽ bắt đầu vào ngày 20/11/2024. Còn 1 tháng nữa. "
  }
}

const ScheduleData = (scheduleData: ScheduleResponseType) => {
  return {
    maintenance: {
      blank: "Tài sản này chưa được lên lịch bảo trì.",
      full: `Bảo trì sẽ bắt đầu vào ngày ${dateToYYYYMMDD(new Date(scheduleData.start))}.`
    },
    fix: {
      blank: "Nếu tài sản này có vẻ như đang hỏng, lên lịch sửa chữa ngay",
      full: `Sửa chữa sẽ bắt đầu vào ngày ${dateToYYYYMMDD(new Date(scheduleData.start))}.`
    }
  }
}
export default function Callout(
  {
    what,
    size = "pc",
    data,
    scheduleFn,
    lookFn,
    cancelFn,
    loading = false
  }: {
    what: 'maintenance' | 'fix',
    size?: string,
    data: ScheduleResponseType[],
    scheduleFn: () => void,
    lookFn: () => void,
    cancelFn: () => void,
    loading?: boolean
  }
) {
  const [blank, setBlank] = useState(data?.length ? false : true)

  const styles = {
    blank: 'relative w-full flex flex-row justify-end items-end px-4 py-3 gap-2 rounded-md bg-background-50 text-sm'
    ,
    full: 'relative w-full flex flex-col justify-end items-end px-4 py-3 gap-2 rounded-md bg-background-50 text-sm'

  }

  const Overlay = (
    <View
      className='absolute bg-background-0/70 z-50 top-0 left-0 w-full h-full flex flex-col justify-center px-8'
    >
      <ProgressBar trigger={true} />
    </View>
  )


  if (blank) {
    return (
      <View>
        {loading && Overlay}
        <View className={styles.blank}>
          <View className='shrink'>
            <Text className='text-inherit text-typography-500'>
              {(what === "maintenance") ? backupData.maintenance.blank : backupData.fix.blank}
            </Text>
          </View>
          <Button size='sm' action='primary' onPress={scheduleFn}>
            <ButtonIcon as={CalendarDaysIcon} size='md' />
            <ButtonText >Xếp lịch</ButtonText>
          </Button>
        </View>
      </View>

    )

  }
  else {
    return (
      <View>
        {loading && Overlay}
        <View className={styles.full}>
          <View className='w-full flex flex-row justify-start'>
            {data &&
              <Text className='text-inherit text-typography-500'>
                {(what === "maintenance") ? ScheduleData(data[0]).maintenance.full
                  :
                  ScheduleData(data[0]).fix.full}
              </Text>
            }

          </View>
          <ButtonGroup className='flex flex-row'>
            <Button size='sm' variant='outline' action='negative' onPress={() => {
              cancelFn()
              setBlank(prev => prev = true)
            }}>
              <ButtonIcon as={TrashIcon} size='md' />
              <ButtonText className='text-error-400'>Hủy lịch</ButtonText>
            </Button>
            <Button size='sm' variant='outline' action='primary' onPress={lookFn}>
              <ButtonIcon className='text-primary-400' as={CalendarDaysIcon} size='md' />
              <ButtonText>Xem</ButtonText>
            </Button>
            {/* <Button size='sm' variant='outline' action='secondary'>
            <ButtonText onPress={() => setBlank(prev => prev = true)}>Hủy bỏ</ButtonText>
          </Button> */}
          </ButtonGroup>
        </View>
      </View>
    )
  }
}