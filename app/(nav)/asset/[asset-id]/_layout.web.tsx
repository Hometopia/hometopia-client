import ActionMenu from "@/components/custom/ActionMenu";
import QRButton from "@/components/custom/QRButton";
import Tabs from "@/components/nav/Tabs";
import { Button, ButtonGroup, ButtonIcon } from "@/components/ui/button";
import { TabItemType } from "@/constants/types";
import { Stack, usePathname, useRouter } from "expo-router";
import { ChevronLeftIcon } from "lucide-react-native";

const tabData: TabItemType[] = [
  {
    slug: "general",
    label: "Thông tin chung",
  },
  {
    slug: "depreciation",
    label: "Khấu hao",
  },
  {
    slug: "lifecycle",
    label: "Vòng đời",
  },
  {
    slug: "maintenance",
    label: "Bảo trì",
  },
  {
    slug: "fix",
    label: "Sửa chữa",
  },
  {
    slug: "failure-symptom",
    label: "Triệu chứng hư hỏng",
  },
];
export default function AssetDetailsLayout() {
  const router = useRouter();
  return (
    <div className="flex h-full flex-col gap-4 bg-white p-6 pr-0">
      <div className="flex justify-between pr-6">
        <Button
          className="rounded-full"
          variant="outline"
          action="secondary"
          onPress={() => router.navigate("/asset")}
        >
          <ButtonIcon as={ChevronLeftIcon} />
        </Button>
        <div className="flex gap-4">
          <QRButton />
          <ActionMenu />
        </div>
      </div>
      <Tabs data={tabData} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      ></Stack>
    </div>
  );
}
