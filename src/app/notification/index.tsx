import { View, SafeAreaView, ScrollView, FlatList, ActivityIndicator, TouchableHighlight, TouchableOpacity } from 'react-native'
import React from 'react'
import BackButton from '@/components/custom/BackButton'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { CalendarIcon, ConstructionIcon, EyeClosed, EyeIcon } from 'lucide-react-native'
import { Icon } from '@/components/ui/icon'
import { Badge, BadgeText } from '@/components/ui/badge'
import { NotificationType } from '@/api/types/common'
import { useMutation, useQuery } from '@tanstack/react-query'
import { NotificationService } from '@/api/NotificationService'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { Spinner } from '@/components/ui/spinner'
import { useGlobalContext } from '@/contexts/GlobalProvider'

export default function Notification() {
  const globalValues = useGlobalContext()
  const { top } = useSafeAreaInsets()

  const infiniteScroll = useInfiniteScroll<NotificationType>({
    fetchFn: (page: number, size: number) =>
      NotificationService.getListNotification(page, size, false),
    pageSize: 15
  })

  const calcUnreadNoti = (data: NotificationType[]) => {
    return data.filter((i: NotificationType) => !i.isRead).length
  }

  const markAsReadMutation = useMutation({
    mutationFn: (ids: string[]) => NotificationService.markAsRead(ids),
    onSuccess: (res) => {
    },
    onError: () => { }
  })

  const handleMarkIsRead = (data: NotificationType) => {
    markAsReadMutation.mutate([data.id])
    const index = infiniteScroll.data.findIndex(i => i.id === data.id)
    var tmp = infiniteScroll.data
    tmp[index].isRead = true
    infiniteScroll.setData([...tmp])
  }
  const handleMarkAllRead = () => {
    markAsReadMutation.mutate(infiniteScroll.data.map((i: NotificationType) => i.id))
    infiniteScroll.setData(infiniteScroll.data.map((i: NotificationType) => {
      return { ...i, isRead: true } as NotificationType
    }))
  }

  const NotiItem = ({ data }: { data: NotificationType }) => {
    return (
      <TouchableOpacity disabled={data.isRead}
        onPress={() => {
          handleMarkIsRead(data)
          router.push(`/(_main)/asset/${data.hyperLink.id}`)
        }}
        className={
          !data.isRead ?
            'flex flex-col gap-2 px-4 py-6 bg-white/10 border-b border-outline-100'
            :
            'flex flex-col gap-2 px-4 py-6 bg-transparent border-b border-outline-100'
        }>
        <Text className={!data.isRead ? 'text-sm text-typography-400' : 'text-sm text-typography-300'}>
          {(new Date(data.createdAt)).toLocaleString()}
        </Text>
        <View className='flex flex-row gap-3 items-center justify-start'>
          <View className={!data.isRead ? 'rounded-full p-3 bg-primary-400/10' : 'rounded-full p-3 bg-background-400/10'}>
            <Icon as={data.hyperLink.entity === 'Schedule' ? CalendarIcon : ConstructionIcon}
              className={!data.isRead ? 'text-primary-400 h-8 w-8' : 'text-typography-300 h-8 w-8'} />
          </View>
          <View className='flex flex-col gap-2 shrink'>
            <Text className={!data.isRead ? 'text-lg text-primary-400 font-semibold' : 'text-lg text-typography-300 font-semibold'}>{data.title}</Text>
            <Text className={!data.isRead ? 'text-md text-typography-500' : 'text-md text-typography-300'}>{data.message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  return (
    <SafeAreaView style={{ paddingTop: Number(top) }} className='h-full bg-background-0'>
      <View className="px-4 py-4 flex flex-row justify-start items-center">
        <BackButton backFn={() => {
          router.back()
        }} />
        <Text className='grow text-center text-xl font-bold'>Thông báo</Text>
        <View className='relative flex flex-col mr-2'>
          <Badge
            className={
              calcUnreadNoti(infiniteScroll.data) ?
                "absolute top-[-8px] right-[-8px] z-10 h-[22px] w-[32px] bg-red-600 rounded-full"
                :
                "hidden"
            }
            variant="solid"
          >
            <BadgeText className="text-white text-center w-full">{calcUnreadNoti(infiniteScroll.data)}</BadgeText>
          </Badge>
          <Button
            variant='link'
            action='secondary'
            className='bg-background-50 h-10 w-10 rounded-full'
            onPress={() => {
              if (calcUnreadNoti(infiniteScroll.data)) {
                handleMarkAllRead()
              }
            }}
          >
            {markAsReadMutation.isPending ?
              <Spinner className='text-typography-400' size='small' />
              :
              <ButtonIcon as={calcUnreadNoti(infiniteScroll.data) ? EyeClosed : EyeIcon} className='h-6 w-6' />
            }
          </Button>
        </View>
      </View>
      <FlatList
        // className='bg-background-50'
        data={infiniteScroll.data}
        renderItem={({ item }) => <NotiItem key={item.id} data={item} />}
        onEndReached={infiniteScroll.fetchNextPage}
        onEndReachedThreshold={0.8}
        ListFooterComponent={!infiniteScroll.isLastPage ? <Spinner size='large' className='text-primary-400 py-4' /> : <View></View>}
        overScrollMode='never'
        keyExtractor={item => item.id}
        removeClippedSubviews={true}
      />

    </SafeAreaView>
  )
}