import CustomDrawerContent from "@/components/nav/CustomDrawerContent";
import { config } from "@/components/ui/gluestack-ui-provider/config";
import { Drawer } from "expo-router/drawer";
import {
  BoltIcon,
  BoxIcon,
  CalendarCogIcon,
  FileChartColumnIcon,
  LayoutDashboardIcon,
  TagIcon,
  WrenchIcon,
} from "lucide-react-native";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Image } from "@/components/ui/image";
import { IMAGE_URL } from "@/constants/public";
import { Text } from "@/components/ui/text";
import { BlurView } from "expo-blur";

const navData = [
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
    slug: "categories",
    label: "Danh mục",
    title: "Danh mục",
    icon: TagIcon,
  },
  {
    slug: "fix",
    label: "Sửa chữa",
    title: "Sửa chữa",
    icon: WrenchIcon,
  },
  {
    slug: "maintenance",
    label: "Bảo trì",
    title: "Bảo trì",
    icon: BoltIcon,
  },
  {
    slug: "calendar",
    label: "Lịch",
    title: "Lịch",
    icon: CalendarCogIcon,
  },
  {
    slug: "reports",
    label: "Báo cáo",
    title: "Báo cáo",
    icon: FileChartColumnIcon,
  },
];


export default function NavLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="dashboard"
        drawerContent={CustomDrawerContent}
        screenOptions={{
          unmountOnBlur: true,
          drawerActiveBackgroundColor: `rgb(26 145 255)`,
          drawerActiveTintColor: "#fff",
          drawerInactiveBackgroundColor: `#fff`,
          drawerInactiveTintColor: "#333",
          drawerItemStyle: {
            borderRadius: 6,
          },
          drawerStyle: {
            width: 300,
            display: "flex",
          },
          headerTitleAlign: 'center',
          headerRight: () =>
            <View className="flex flex-row justify-center w-[60px]">
              <Image
                className="h-[30px] w-[30px]"
                source={require("@/assets/images/icon.png")}
                alt="image"
              />
            </View>
        }}
      >
        {
          navData.map((i) => (
            <Drawer.Screen
              key={i.slug}
              name={i.slug}
              options={{
                drawerLabel: i.label,
                title: i.title,
                drawerIcon: ({ size, color }) => (
                  <i.icon size={size} color={color} />
                ),
              }}
            />
          ))
        }
      </Drawer >
    </GestureHandlerRootView >
  );
}
