import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, Tabs, useNavigation } from 'expo-router'
import { BellIcon, BoxIcon, CalendarCogIcon, FileChartColumnIcon, LayoutDashboardIcon, TagIcon, WrenchIcon } from 'lucide-react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { primaryColor } from '@/constants/color';
import { Image } from '@/components/ui/image';
import { Icon } from '@/components/ui/icon';

const tabsData = [
  {
    slug: "dashboard",
    label: "Dashboard",
    title: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    slug: "asset",
    label: "Tài sản",
    title: "Danh sách tài sản",
    icon: BoxIcon,
  },
  {
    slug: "category",
    label: "Danh mục",
    title: "Danh mục",
    icon: TagIcon,
  },
  {
    slug: "calendar",
    label: "Lịch",
    title: "Lịch",
    icon: CalendarCogIcon,
  },
  {
    slug: "setting",
    label: "Cài đặt",
    title: "Cài đặt",
    icon: WrenchIcon,
  },
]
const navigationHeaders = [
  {
    slug: "dashboard",
    title: "Dashboard",
  },
  {
    slug: "asset",
    title: "Tài sản",
  },
  {
    slug: "category",
    title: "Danh mục",
  },
  {
    slug: "calendar",
    title: "Lịch",
  },
  {
    slug: "setting",
    title: "Cài đặt",
  },
  {
    slug: "create-asset",
    title: "Tạo tài sản mới",
  },
  {
    slug: "create-category",
    title: "Tạo danh mục mới",
  },
  {
    slug: "[asset_id]",
    title: "Chi tiết tài sản",
  },
  {
    slug: "[suggested]",
    title: "Danh mục đề xuất",
  },
  {
    slug: "[schedule_details]/index",
    title: "Chi tiết lịch"
  },
  {
    slug: "create-schedule",
    title: "Tạo lịch"
  }
]
const getHeaderTitle = (route: any, item: any) => {
  // console.log(route)
  let routeName = getFocusedRouteNameFromRoute(route)

  if (routeName === undefined || routeName === 'index') {
    routeName = item.slug
  }

  // return routeName

  return navigationHeaders.find((i) => i.slug === routeName?.toString())?.title || 'what';

}

export default function MainLayout() {
  const _navigation = useNavigation()
  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        unmountOnBlur: true,
        tabBarActiveBackgroundColor: `rgba(${primaryColor[400].replace(/ /g, ', ')}, 0.2)`,
        tabBarActiveTintColor: `rgba(${primaryColor[400].replace(/ /g, ', ')}, 1.0)`,
        tabBarInactiveBackgroundColor: `#fff`,
        tabBarItemStyle: {
          borderRadius: 6,
        },
        tabBarStyle: {
          height: 32 + 24 + 16,
          paddingHorizontal: 16,
          paddingBottom: 24,
          paddingTop: 12
        },
        tabBarShowLabel: false,
        // headerStatusBarHeight: 48,
        headerTitleStyle: {
          fontSize: 18
        },
        headerLeft: () =>
          <View className="flex flex-row justify-center w-[60px]">
            <Image
              className="h-[30px] w-[30px]"
              source={require("../../../assets/images/icon.png")}
              alt="image"
            />
          </View>,
        headerRight: () =>
          <TouchableOpacity className="rounded-full p-3 mr-4"
            onPress={() => router.push('/notification')}
          >
            <Icon as={BellIcon} className="text-typography-800" size="xl" />
          </TouchableOpacity>

      }}
    >
      {tabsData.map(i => (
        <Tabs.Screen
          key={i.slug}
          name={i.slug}
          options={({ route }) => ({
            tabBarLabel: undefined,
            title: getHeaderTitle(route, i),
            tabBarIcon: ({ focused, size, color }) => focused ?
              <i.icon size={size} color={color} fillRule='nonzero' fill={color} /> : <i.icon size={size} color={color} />
            ,
          })}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault()
              _navigation.reset({
                index: 0,
                routes: [{ name: i.slug }] as never
              })
            },
          })}
        />
      ))}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  )
}