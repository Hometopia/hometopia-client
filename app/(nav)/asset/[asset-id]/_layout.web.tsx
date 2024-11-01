import Tabs from "@/components/nav/Tabs";
import { TabItemType } from "@/constants/types";
import { Stack, usePathname } from "expo-router";

const tabData: TabItemType[] = [
  {
    slug: 'general', label: 'Thông tin chung'
  },
  {
    slug: 'depreciation', label: 'Khấu hao'
  },
]
export default function AssetDetailsLayout() {
  const pathname = usePathname()
  return (
    <div className="flex h-full bg-white">
      <Tabs data={tabData} endPoint={pathname} />
      <Stack />
    </div>

  )
}