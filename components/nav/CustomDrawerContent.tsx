import { View, Text } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { useRouter } from 'expo-router'
import { Image } from '@/components/ui/image'
import { IMAGE_URL } from '@/constants/public'
import { useSafeAreaInsets } from 'react-native-safe-area-context'


export default function CustomDrawerContent(props: any) {
  const router = useRouter()
  const { top, bottom } = useSafeAreaInsets()
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} className='px-4 h-full '>
        <View className='px-2 mb-6'>
          <Image
            className='w-[120px] h-[30px]'
            source={require('@/assets/images/logo-full.png')}
            alt="image"
          />
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View>
        <Text>Footer</Text>
      </View>
    </View>
  )
}