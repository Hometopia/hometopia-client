import { View, Text } from 'react-native'
import React from 'react'
import { Input, InputField, InputIcon, InputSlot } from '../ui/input'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { dateToYYYYMMDD } from '@/helpers/time';
import { CalendarDaysIcon } from 'lucide-react-native';

export default function DatePicker({
  value, onChange, placeholder
}: {
  value: string,
  onChange: Function,
  placeholder: string
}) {
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  return (
    <>
      <Input isReadOnly={true} className="text-center" size="lg" onTouchEnd={() => setDatePickerVisibility(true)}>
        <InputField
          type="text"
          placeholder={placeholder}
          value={value} />
        <InputSlot>
          <InputIcon as={CalendarDaysIcon} className='mr-3' />
        </InputSlot>
      </Input>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          onChange(dateToYYYYMMDD(date))
          setDatePickerVisibility(false)
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </>
  )
}