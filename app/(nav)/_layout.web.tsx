import Sidebar from "@/components/nav/Sidebar";
import { VStack } from "@/components/ui/vstack";
import { NavigationItemType } from "@/constants/types";
import { Stack } from "expo-router";
import { BoltIcon, BoxIcon, CalendarCogIcon, FileChartColumnIcon, LayoutDashboardIcon, TagIcon, WrenchIcon } from "lucide-react-native";
import { useState } from "react";

const navData: NavigationItemType[] = [
  {
    slug: 'dashboard', label: 'Dashboard', title: 'Dashboard', icon: LayoutDashboardIcon
  },
  {
    slug: 'asset', label: 'Tài sản', title: 'Danh sách tài sản', icon: BoxIcon
  },
  {
    slug: 'categories', label: 'Danh mục', title: 'Danh mục', icon: TagIcon
  },
  {
    slug: 'fix', label: 'Sửa chữa', title: 'Sửa chữa', icon: WrenchIcon
  },
  {
    slug: 'maintenance', label: 'Bảo trì', title: 'Bảo trì', icon: BoltIcon
  },
  {
    slug: 'calendar', label: 'Lịch', title: 'Lịch', icon: CalendarCogIcon
  },
  {
    slug: 'reports', label: 'Báo cáo', title: 'Báo cáo', icon: FileChartColumnIcon
  },
]

export default function NavLayout_Web() {
  return (
    <div className="flex h-full bg-white">
      <Sidebar data={navData} />
      <Stack
        screenOptions={{
          headerShown: false
        }}
      />
    </div>
  );
}
