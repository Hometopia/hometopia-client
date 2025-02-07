import { View, Text } from 'react-native'
import { Progress, ProgressFilledTrack } from '../ui/progress'
import { useEffect, useState } from 'react'

export default function ProgressBar({
  trigger, text = 'Chờ một chút...'
}: {
  trigger: boolean,
  text?: string
}) {

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (trigger) {
      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            return 100
          }
          const diff = 2
          return Math.min(oldProgress + diff, 100)
        })
      }, 10)

      return () => {
        clearInterval(interval)
      }
    }
  }, [trigger]);
  return (
    <View className='flex flex-col gap-2 items-center'>
      <Text className='text-md'>{text}</Text>
      <Progress value={progress} className="w-full h-2 bg-primary-400/10">
        <ProgressFilledTrack className="h-2 bg-primary-400" />
      </Progress>
    </View>
  )
}