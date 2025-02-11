import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, Tabs, useNavigation } from 'expo-router'
import { BellIcon, BoxIcon, CalendarCogIcon, CalendarIcon, FileChartColumnIcon, LayoutDashboardIcon, TagIcon, WrenchIcon } from 'lucide-react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { primaryColor } from '@/constants/color';
import { Image } from '@/components/ui/image';
import { Icon } from '@/components/ui/icon';
import { useGlobalContext } from '@/contexts/GlobalProvider';
import { useQuery } from '@tanstack/react-query';
import { ScheduleService } from '@/api/ScheduleService';
import { CategoryService } from '@/api/CategoryService';
import { DEFAULT_PAGE_SIZE } from '@/constants/config';
import { AssetService } from '@/api/AssetService';

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
    slug: "calendar",
    label: "Lịch",
    title: "Lịch",
    icon: CalendarIcon,
  },
  {
    slug: "category",
    label: "Danh mục",
    title: "Danh mục",
    icon: TagIcon,
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
    slug: "location/[location_id]",
    title: "Danh mục tài sản"
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
  },
  {
    slug: "years",
    title: "Thống kê các năm"
  },
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
  const globalValues = useGlobalContext()

  //refetch data
  const scheduleListQuery = useQuery({
    queryKey: ['schedule-list'],
    queryFn: () => ScheduleService.getListSchedule()
  })
  const categoryFullList = useQuery({
    queryKey: ['categoryFullList'],
    queryFn: () => CategoryService.getAllCategory()
  })
  const assetListQuery = useQuery({
    queryKey: ['asset-list', 1, DEFAULT_PAGE_SIZE, '', '', '',],
    queryFn: () => AssetService.getAssetList(1, DEFAULT_PAGE_SIZE, '', '', '')
  })
  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        unmountOnBlur: true,
        // tabBarActiveBackgroundColor: `rgba(${primaryColor[400].replace(/ /g, ', ')}, 0.2)`,
        tabBarActiveTintColor: `rgba(${primaryColor[400].replace(/ /g, ', ')}, 1.0)`,
        // tabBarInactiveBackgroundColor: globalValues.themeMode === 'dark' ? 'rgb(18 18 18)' : '#fff',
        tabBarItemStyle: {
          borderRadius: 6,
        },
        tabBarStyle: {
          height: 32 + 24 + 16,
          paddingHorizontal: 16,
          paddingBottom: 24,
          paddingTop: 12,
          backgroundColor: globalValues.themeMode === 'dark' ? 'rgb(18 18 18)' : '#fff',
          borderColor: globalValues.themeMode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
        },
        tabBarShowLabel: false,
        // headerStatusBarHeight: 48,
        headerTitleStyle: {
          fontSize: 18,
          color: globalValues.themeMode === 'dark' ? '#fff' : '#000'
        },
        headerStyle: {
          backgroundColor: globalValues.themeMode === 'dark' ? 'rgb(18 18 18)' : '#fff'
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
            tabBarIcon: ({ size, color, focused }) =>
              <View className='flex flex-col gap-0 items-center'>
                <i.icon
                  size={size}
                  color={color}
                  fill={focused ? color : 'rgba(0,0,0,0)'} />
                <Text className={focused ?
                  'text-xs text-primary-400' :
                  'text-xs text-typography-400'
                }>{i.label}</Text>
              </View>
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