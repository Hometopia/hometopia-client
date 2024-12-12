import HistoryLog from '@/components/custom/HistoryLog'
import { Text } from '@/components/ui/text'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements';

const data = 3
const backupData = {
  time: '20/09/2024 07:32 PM',
  msg: 'Đây là message'
}
export default function AssetLifecycle() {
  const headerHeight = useHeaderHeight()
  return (
    <SafeAreaView className='h-full bg-white'>
      <ScrollView className="flex flex-col my-4 px-4 gap-4">
        {Array.from({ length: data }, (_, index) => (
          <HistoryLog key={index} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
