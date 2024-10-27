import Sidebar from "@/components/nav/Sidebar";
import { VStack } from "@/components/ui/vstack";
import { NavigationItemType } from "@/constants/types";
import { Stack } from "expo-router";
import { BoltIcon, BoxIcon, CalendarCogIcon, FileChartColumnIcon, LayoutDashboardIcon, TagIcon, WrenchIcon } from "lucide-react-native";
import { useState } from "react";

const navData: NavigationItemType[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboardIcon,
    href: '/(nav)/dashboard'
  },
  {
    key: 'assets',
    label: 'Tài sản',
    icon: BoxIcon,
    href: '/(nav)/assets'
  },
  {
    key: 'categories',
    label: 'Danh mục',
    icon: TagIcon,
    href: '/(nav)/categories'
  },
  {
    key: 'fix',
    label: 'Sửa chữa',
    icon: WrenchIcon,
    href: '/(nav)/fix'
  },
  {
    key: 'maintenance',
    label: 'Bảo trì',
    icon: BoltIcon,
    href: '/(nav)/maintenance'
  },
  {
    key: 'calendar',
    label: 'Lịch',
    icon: CalendarCogIcon,
    href: '/(nav)/calendar'
  },
  {
    key: 'reports',
    label: 'Báo cáo',
    icon: FileChartColumnIcon,
    href: '/(nav)/reports'
  },
]

export default function NavLayout_Web() {
  const [active, setActive] = useState(navData.at(0) as NavigationItemType)
  return (
    <div className="flex h-full bg-white">
      <Sidebar data={navData} active={active} setActive={setActive} />
      <Stack
        screenOptions={{
          headerShown: false
        }}
      />
    </div>
  );
}
