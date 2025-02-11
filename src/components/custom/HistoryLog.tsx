import { View } from 'react-native'
import { Text } from '../ui/text'
import { compareAsc } from 'date-fns'

type HistoryLogProps = {
  createdAt: Date,
  description: string
}

export default function HistoryLog({
  createdAt, description
}: HistoryLogProps) {
  return (
    <View className='flex flex-row items-start gap-4'>
      <View className='flex flex-col gap-0 items-center pt-2'>
        <View className={compareAsc(createdAt, new Date()) > 0 ?
          'w-3 h-3 rounded-full bg-background-300/50' :
          'w-3 h-3 rounded-full bg-background-300'} />
        <View className={compareAsc(createdAt, new Date()) > 0 ?
          'w-[2px] h-24 bg-background-300/50 flex ' : 'w-[2px] h-24 bg-background-300 flex '} />
      </View>
      <View className='flex flex-col gap-0'>
        <View className='flex flex-row justify-start gap-4'>
          <View className={compareAsc(createdAt, new Date()) > 0 ?
            "py-1 px-4 rounded-full bg-background-100/50" :
            "py-1 px-4 rounded-full bg-background-100"
          }>
            <Text className={compareAsc(createdAt, new Date()) > 0 ?
              'text-sm text-typography-500/50' :
              'text-sm text-typography-500'
            }>
              {createdAt.toLocaleDateString()}
            </Text>
          </View>
          {compareAsc(createdAt, new Date()) > 0 &&
            <View className="py-1 px-4 rounded-full bg-primary-400/10">
              <Text className='text-sm text-primary-400'>Sắp đến !</Text>
            </View>
          }
        </View>
        {/* <View className='py-4 w-full flex flex-row justify-start items-end'> */}
        <View className='relative flex flex-row justify-end items-end px-4 py-4 '>
          <Text className={compareAsc(createdAt, new Date()) > 0 ?
            'text-md text-typography-900/50 ' :
            'text-md text-typography-900 '}>
            {description}
          </Text>
        </View>
      </View>
    </View>
  )
}