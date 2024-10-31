import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { BoltIcon, BoxIcon, CalendarCogIcon, FileChartColumnIcon, LayoutDashboardIcon, PanelLeftClose, PanelLeftCloseIcon, PanelLeftOpenIcon, TagIcon, WrenchIcon } from "lucide-react-native";
import { ReactElement, useEffect, useState } from "react";
import { IMAGE_URL } from "@/constants/public";
import { Href, usePathname, useRouter } from "expo-router";
import { NavigationItemType } from "@/constants/types";
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { HStack } from "../ui/hstack";


enum SidebarItemState {
  default = 0, hover = 1, active = 2
}

export default function Sidebar({ data }: { data: NavigationItemType[] }) {

  const router = useRouter()
  const pathname = usePathname()
  const [active, setActive] = useState(pathname.split('/').filter(Boolean))
  const [collapse, setCollapse] = useState(false)
  const [state, setState] = useState(data.map(i => {
    if (i.slug === active.at(0))
      return {
        key: i.slug,
        state: SidebarItemState.active,
      }
    return {
      key: i.slug,
      state: SidebarItemState.default,
    }
  }))

  useEffect(() => {
    setActive(pathname.split('/').filter(Boolean))
  }, [pathname])

  useEffect(() => {
    setState(data.map(i => {
      if (i.slug === active.at(0))
        return {
          key: i.slug,
          state: SidebarItemState.active,
        }
      return {
        key: i.slug,
        state: SidebarItemState.default,
      }
    }))
  }, [active])

  const handleActive = (item: NavigationItemType) => {
    setState(prev => prev.map(i => {
      if (i.key === item.slug) {
        i.state = SidebarItemState.active
      }
      else
        i.state = SidebarItemState.default
      return i
    }))
  }


  const stateColor = [
    'text-typography-600',
    'text-typography-600',
    'text-typography-0',
  ]

  const bgStateColor = [
    'bg-white',
    'bg-background-50',
    'bg-primary-400',
  ]


  const handleHover = (item: NavigationItemType) => {
    if (item.slug === active.at(0)) return
    setState(prev => prev.map(i => {
      if (i.key === item.slug) {
        i.state = SidebarItemState.hover
      }
      return i
    }))
  }
  const handleMouseLeave = (item: NavigationItemType) => {
    if (item.slug === active.at(0)) return
    setState(prev => prev.map(i => {
      if (i.key === item.slug) {
        i.state = SidebarItemState.default
      }
      return i
    }))
  }
  return (
    <VStack style={collapse ? { width: 'auto' } : { width: 200 }} className={`h-full px-4 py-6 border-r border-outline-300 justify-between`}>
      <VStack className="gap-6">
        <VStack className="items-end gap-4">
          <div className="flex justify-center" style={collapse ? { width: '100%' } : { width: 'fit-content' }} onClick={() => setCollapse(prev => !prev)}>
            {collapse ? <PanelLeftOpenIcon className="text-typography-600 hover:cursor-pointer" /> :
              <PanelLeftCloseIcon className="text-typography-600 hover:cursor-pointer" />}
          </div>
          <div style={collapse ? { justifyContent: 'center' } : { justifyContent: 'flex-start' }} className="w-full flex">
            {collapse ? <img src={`${IMAGE_URL}/logo-only.svg`} className="h-[30px]" /> :
              <img src={`${IMAGE_URL}/logo-full.svg`} className="h-[30px]" />}
          </div>
        </VStack>
        <VStack className="gap-2">
          {data.map((i, index) =>
            <div
              key={i.slug}
              className={`py-2 px-3 rounded-md flex items-center gap-3 ${bgStateColor.at(state.at(index)?.state as number)} hover:cursor-pointer`}
              onMouseEnter={() => handleHover(i)}
              onMouseLeave={() => handleMouseLeave(i)}
              onClick={() => {
                handleActive(i)
                router.push(`/${i.slug}` as Href<string | object>)
              }}>
              <i.icon className={` ${stateColor.at(state.at(index)?.state as number)}`} strokeWidth={2} size={20} />
              {collapse ? <></> : <Text className={`text-sm font-normal capitalize ${stateColor.at(state.at(index)?.state as number)}`} >{i.label}</Text>}
            </div>)}
        </VStack>
      </VStack>
      <HStack className="w-full">
        <Avatar size='sm'>
          <AvatarFallbackText>name</AvatarFallbackText>
          <AvatarImage source={require('@/assets/images/favicon.png')} />
          <AvatarBadge />
        </Avatar>
        {collapse ? <></> : <Text>Name</Text>}
      </HStack>
    </VStack>
  )
}
