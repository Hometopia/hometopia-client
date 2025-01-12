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
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/api/UserService";
import Loading from "@/components/feedback/Loading";
import { UserProfileResponseType } from "@/api/types/response";

const draweData = [
  // {
  //   slug: "dashboard",
  //   label: "Dashboard",
  //   title: "Dashboard",
  //   icon: LayoutDashboardIcon,
  // },
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

const navigationHeaders = [
  {
    slug: "index",
    title: "Danh sách tài sản",
  },
  {
    slug: "categories",
    title: "Danh mục",
  },
  {
    slug: "fix",
    title: "Sửa chữa",
  },
  {
    slug: "maintenance",
    title: "Bảo trì",
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

export default function NavLayout() {
  const userProfile = useQuery({
    queryKey: ['user'],
    queryFn: () => UserService.getMyProfile(),
    staleTime: Infinity,
    gcTime: Infinity
  })
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {userProfile.isPending ?
        <Loading texts={[
          {
            condition: true,
            text: 'Đang tải...'
          }
        ]} />
        :
        <Drawer
          initialRouteName="dashboard"
          drawerContent={(props) =>
            <CustomDrawerContent props={props} user={userProfile.data.data as UserProfileResponseType} />
          }
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
            draweData.map((i) => (
              <Drawer.Screen
                key={i.slug}
                name={i.slug}
                options={({ route }) => ({
                  drawerLabel: i.label,
                  title: getHeaderTitle(route, i),
                  drawerIcon: ({ size, color }) => (
                    <i.icon size={size} color={color} />
                  ),
                })}
              />
            ))
          }
        </Drawer >
      }

    </GestureHandlerRootView >
  );
}
