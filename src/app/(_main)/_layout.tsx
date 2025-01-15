import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { BoxIcon, CalendarCogIcon, FileChartColumnIcon, LayoutDashboardIcon, TagIcon, WrenchIcon } from 'lucide-react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { primaryColor } from '@/constants/color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    slug: "index",
    title: "Dashboard",
  },
  {
    slug: "asset",
    title: "Danh sách tài sản",
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
    slug: "reports",
    title: "Báo cáo",
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

  let routeName = getFocusedRouteNameFromRoute(route);

  if (routeName === undefined) {
    routeName = item.slug
  }

  // return routeName

  return navigationHeaders.find((i) => i.slug === routeName?.toString())?.title || 'what';

}

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        unmountOnBlur: true,
        tabBarActiveBackgroundColor: `rgba(${primaryColor[400].replace(/ /g, ', ')}, 0.2)`,
        tabBarActiveTintColor: `rgba(${primaryColor[400].replace(/ /g, ', ')}, 1.0)`,
        tabBarInactiveBackgroundColor: `#fff`,
        tabBarItemStyle: {
          borderRadius: 6,
        },
        tabBarIconStyle: {
          color: `rgb(${primaryColor[400]})`
        },
        tabBarStyle: {
          height: 32 + 24 + 16,
          display: 'flex',
          flexDirection: 'row',
          gap: 8,
          paddingHorizontal: 16,
          paddingBottom: 24,
          paddingTop: 12
        },
        tabBarShowLabel: false
      }}
    >
      {tabsData.map(i => (
        <Tabs.Screen
          key={i.slug}
          name={i.slug}
          options={({ route }) => ({
            tabBarLabel: undefined,
            title: getHeaderTitle(route, i),
            tabBarIcon: ({ focused, size, color }) => <i.icon size={size} color={color} />
            ,
          })}
        />
      ))}
    </Tabs>
  )
}