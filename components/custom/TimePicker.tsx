import { View, Text } from 'react-native'
import React from 'react'
import { Input, InputField, InputIcon, InputSlot } from '../ui/input';
import { Clock3Icon } from 'lucide-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { dateToYYYYMMDD, getTime } from '@/helpers/time';

export default function TimePicker({
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
          <InputIcon as={Clock3Icon} className='mr-3' />
        </InputSlot>
      </Input>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode='time'
        onConfirm={(date) => {
          onChange(getTime(date))
          setDatePickerVisibility(false)
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </>
  )
}