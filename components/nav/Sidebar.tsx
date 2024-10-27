import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { BoltIcon, BoxIcon, CalendarCogIcon, FileChartColumnIcon, LayoutDashboardIcon, PanelLeftClose, PanelLeftCloseIcon, PanelLeftOpenIcon, TagIcon, WrenchIcon } from "lucide-react-native";
import { ReactElement, useEffect, useState } from "react";
import { IMAGE_URL } from "@/constants/public";
import { Href, useRouter } from "expo-router";
import { NavigationItemType } from "@/constants/types";
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { HStack } from "../ui/hstack";


enum SidebarItemState {
  default = 0, hover = 1, active = 2
}

const SidebarItem = ({
  active = false,
  setActive,
  collapse = false,
  item,
}: {
  active?: boolean,
  setActive: any,
  collapse?: boolean,
  item: NavigationItemType
}) => {

  const router = useRouter()
  const [state, setState] = useState(active ? SidebarItemState.active : SidebarItemState.default)


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

  const handleHover = () => {
    setState(active ? SidebarItemState.active : SidebarItemState.hover)
  }
  const handleMouseLeave = () => {
    setState(active ? SidebarItemState.active : SidebarItemState.default)
  }

  return (
    <div className={`py-2 px-4 rounded-md flex items-center gap-2 ${bgStateColor.at(state)} hover:cursor-pointer`}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        setActive(item)
        router.push(item.href as Href<string | object>)
      }}>
      <item.icon className={` ${stateColor.at(state)}`} strokeWidth={2} size={20} />
      {collapse ? <></> : <Text className={`text-sm font-medium capitalize ${stateColor.at(state)}`} >{item.label}</Text>}
    </div>
  )
}


export default function Sidebar({ data, active, setActive }: { data: NavigationItemType[], active: NavigationItemType, setActive: any }) {

  const router = useRouter()
  const [collapse, setCollapse] = useState(false)
  const [state, setState] = useState(data.map(i => ({
    key: i.key,
    state: SidebarItemState.default,
  })))

  const handleActive = (item: NavigationItemType) => {
    setState(prev => prev.map(i => {
      if (i.key === item.key) {
        i.state = SidebarItemState.active
      }
      else
        i.state = SidebarItemState.default
      return i
    }))
  }

  useEffect(() => {
    handleActive(active)
  }, [])

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
    if (item.key === active.key) return
    setState(prev => prev.map(i => {
      if (i.key === item.key) {
        i.state = SidebarItemState.hover
      }
      return i
    }))
  }
  const handleMouseLeave = (item: NavigationItemType) => {
    if (item.key === active.key) return
    setState(prev => prev.map(i => {
      if (i.key === item.key) {
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
              key={i.key}
              className={`py-2 px-4 rounded-md flex items-center gap-2 ${bgStateColor.at(state.at(index)?.state as number)} hover:cursor-pointer`}
              onMouseEnter={() => handleHover(i)}
              onMouseLeave={() => handleMouseLeave(i)}
              onClick={() => {
                setActive(i)
                handleActive(i)
                router.push(i.href as Href<string | object>)
              }}>
              <i.icon className={` ${stateColor.at(state.at(index)?.state as number)}`} strokeWidth={2} size={20} />
              {collapse ? <></> : <Text className={`text-sm font-normal capitalize ${stateColor.at(state.at(index)?.state as number)}`} >{i.label}</Text>}
            </div>)}
        </VStack>
      </VStack>
      <HStack className="w-full">
        <Avatar size='md'>
          <AvatarFallbackText>name</AvatarFallbackText>
          {/* <AvatarImage source={require('@/assets/images/favicon.png')} /> */}
          <AvatarBadge />
        </Avatar>
        <Text>Name</Text>
      </HStack>
    </VStack>
  )
}
