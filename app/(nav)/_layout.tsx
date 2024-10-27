import CustomDrawerContent from '@/components/nav/CustomDrawerContent';
import { config } from '@/components/ui/gluestack-ui-provider/config';
import { Drawer } from 'expo-router/drawer';
import { BoltIcon, BoxIcon, CalendarCogIcon, FileChartColumnIcon, LayoutDashboardIcon, TagIcon, WrenchIcon } from 'lucide-react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const navData = [
  {
    name: 'dashboard', drawerLabel: 'Dashboard', title: 'Dashboard', icon: LayoutDashboardIcon
  },
  {
    name: 'assets', drawerLabel: 'Tài sản', title: 'Danh sách tài sản', icon: BoxIcon
  },
  {
    name: 'categories', drawerLabel: 'Danh mục', title: 'Danh mục', icon: TagIcon
  },
  {
    name: 'fix', drawerLabel: 'Sửa chữa', title: 'Sửa chữa', icon: WrenchIcon
  },
  {
    name: 'maintenance', drawerLabel: 'Bảo trì', title: 'Bảo trì', icon: BoltIcon
  },
  {
    name: 'calendar', drawerLabel: 'Lịch', title: 'Lịch', icon: CalendarCogIcon
  },
  {
    name: 'reports', drawerLabel: 'Báo cáo', title: 'Báo cáo', icon: FileChartColumnIcon
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
            key={i.name}
            name={i.name}
            options={{
              drawerLabel: i.drawerLabel,
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
