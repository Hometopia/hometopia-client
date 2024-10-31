import CustomDrawerContent from '@/components/nav/CustomDrawerContent';
import { config } from '@/components/ui/gluestack-ui-provider/config';
import { Drawer } from 'expo-router/drawer';
import { BoltIcon, BoxIcon, CalendarCogIcon, FileChartColumnIcon, LayoutDashboardIcon, TagIcon, WrenchIcon } from 'lucide-react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const navData = [
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

export default function NavLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerActiveBackgroundColor: `rgb(0 119 230)`,
          drawerActiveTintColor: '#fff',
          drawerInactiveBackgroundColor: '#fff',
          drawerInactiveTintColor: '#333',
          drawerItemStyle: {
            borderRadius: 6,
          },
          drawerStyle: {
            width: 300,
            display: 'flex',
          },
        }}
      >
        {navData.map(i => (
          <Drawer.Screen
            key={i.slug}
            name={i.slug}
            options={{
              drawerLabel: i.label,
              title: i.title,
              drawerIcon: ({ size, color }) => (
                <i.icon size={size} color={color} />
              )
            }}
          />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  );
}
