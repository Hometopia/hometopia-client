import { View } from 'react-native'
import { Text } from '../ui/text'

type HistoryLogProps = {
  createdAt: Date,
  description: string
}

export default function HistoryLog({
  createdAt, description
}: HistoryLogProps) {
  return (
    <View className='w-full flex flex-row items-start gap-4'>
      <View className='flex flex-col gap-0 items-center pt-2'>
        <View className='w-3 h-3 rounded-full bg-background-300'></View>
        <View className='w-[2px] h-24 bg-background-300 flex ' />
      </View>
      <View className='flex flex-col gap-0'>
        <View className="w-fit h-fit py-1 px-4 rounded-full bg-background-100">
          <Text className='text-sm text-typography-500'>{createdAt.toLocaleString()}</Text>
        </View>
        <Text className='py-4 text-md text-typography-900'>{description}</Text>
      </View>
    </View>
  )
}