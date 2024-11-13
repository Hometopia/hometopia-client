import { View, Text } from 'react-native'
import { Button, ButtonGroup, ButtonIcon, ButtonText } from '../ui/button'
import { Calendar, CalendarDaysIcon } from 'lucide-react-native'
import { useState } from 'react'


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
export default function Callout(
  {
    what,
    size = "pc",
    data,
  }: {
    what: string,
    size?: string,
    data?: any
  }
) {
  const [blank, setBlank] = useState(true)

  const styles = {
    blank: {
      pc: 'w-full flex flex-row justify-end items-center px-4 py-3 gap-4 rounded-xl bg-background-50 text-md',
      mobile: 'w-full flex flex-row justify-end items-center px-2 py-3 gap-4 rounded-md bg-background-50 text-sm'
    },
    full: {
      pc: 'w-full flex flex-row justify-start items-center px-4 py-3 gap-4 rounded-xl bg-background-50 text-md',
      mobile: 'w-full flex flex-col justify-end items-end px-2 py-3 gap-4 rounded-md bg-background-50 text-sm'
    }
  }

  if (blank) {
    return (
      <View className={(size === 'pc') ? styles.blank.pc : styles.blank.mobile}>
        <Text className='text-inherit'>{(what === "maintenance") ? backupData.maintenance.blank : backupData.fix.blank}</Text>
        <Button size='sm' action='primary'>
          <ButtonIcon as={CalendarDaysIcon} size='md' />
          <ButtonText>Xếp lịch</ButtonText>
        </Button>
      </View>
    )

  }
  else {
    return (
      <View className={(size === 'pc') ? styles.full.pc : styles.full.mobile}>
        <Text className='text-inherit'>{(what === "maintenance") ? backupData.maintenance.full : backupData.fix.full}</Text>
        <ButtonGroup className='flex flex-row'>
          <Button size='sm' variant='outline' action='primary'>
            <ButtonIcon className='text-primary-500' as={CalendarDaysIcon} size='md' />
            <ButtonText>Xem</ButtonText>
          </Button>
          <Button size='sm' variant='outline' action='secondary'>
            <ButtonText>Hủy bỏ</ButtonText>
          </Button>
        </ButtonGroup>
      </View>
    )
  }
}