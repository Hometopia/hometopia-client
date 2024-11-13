import { View } from 'react-native'
import { Text } from '../ui/text'

const backupData = {
  time: '20/09/2024 07:32 PM',
  msg: 'Đây là message'
}

export default function HistoryLog() {
  return (
    <View className='w-full flex flex-row items-start gap-4'>
      <View className='flex flex-col self-stretch gap-0 items-center mt-2 '>
        {/* <View className='w-[2px] h-12 bg-background-300 hidden sm:flex' /> */}
        <View className='w-3 h-3 rounded-full bg-background-300'></View>
        <View className='w-[2px] h-full bg-background-300 flex ' />
      </View>
      <View className='flex flex-col sm:flex-row gap-0 sm:gap-10 sm:pb-8'>
        <View className="w-fit h-fit py-1 px-4 rounded-full bg-background-100">
          <Text className='text-sm text-typography-500'>{backupData.time}</Text>
        </View>
        <Text className='py-4 sm:py-0 text-md text-typography-900'>{backupData.msg}</Text>
      </View>
    </View>
  )
}