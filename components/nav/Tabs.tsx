import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { BoltIcon, BoxIcon, CalendarCogIcon, FileChartColumnIcon, LayoutDashboardIcon, PanelLeftClose, PanelLeftCloseIcon, PanelLeftOpenIcon, TagIcon, WrenchIcon } from "lucide-react-native";
import { ReactElement, useEffect, useState } from "react";
import { IMAGE_URL } from "@/constants/public";
import { Href, usePathname, useRouter } from "expo-router";
import { TabItemType } from "@/constants/types";
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { HStack } from "../ui/hstack";
import { useGlobalContext } from "@/contexts/GlobalProvider";
import { View } from "react-native";
import { Pressable } from "../ui/pressable";


enum TabItemState {
  default = 0, hover = 1, active = 2
}


export default function Tabs({ data, size = 'pc', endPoint }: { data: TabItemType[], size?: string, endPoint: string }) {

  const router = useRouter()
  const pathname = usePathname()
  const [active, setActive] = useState(pathname.split('/').filter(Boolean))
  const [collapse, setCollapse] = useState(false)
  const [state, setState] = useState(data.map(i => {
    if (i.slug === active.at(0))
      return {
        key: i.slug,
        state: TabItemState.active,
      }
    return {
      key: i.slug,
      state: TabItemState.default,
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
          state: TabItemState.active,
        }
      return {
        key: i.slug,
        state: TabItemState.default,
      }
    }))
  }, [active])

  const handleActive = (item: TabItemType) => {
    setState(prev => prev.map(i => {
      if (i.key === item.slug) {
        i.state = TabItemState.active
      }
      else
        i.state = TabItemState.default
      return i
    }))
  }


  const stateColor = [
    'text-typography-600',
    'text-typography-600',
    'text-primary-500',
  ]

  const bgStateColor = [
    'bg-white',
    'bg-background-200',
    'bg-primary-400',
  ]


  const handleHover = (item: TabItemType) => {
    // if (item.slug === active.at(0)) return
    setState(prev => prev.map(i => {
      if (i.key === item.slug) {
        i.state = TabItemState.hover
      }
      return i
    }))
  }
  const handleMouseLeave = (item: TabItemType) => {
    // if (item.slug === active.at(0)) return
    setState(prev => prev.map(i => {
      if (i.key === item.slug) {
        i.state = TabItemState.default
        console.log("hey, i'm leave")
      }
      return i
    }))
  }
  const { platform } = useGlobalContext();

  return (
    <HStack className={`w-full h-fit`}>
      {data.map((i, index) => {
        // if (platform === 'web') {
        //   return (
        //     <div
        //       key={i.slug}
        //       className={`py-2 px-4 rounded-md flex items-center gap-3 ${bgStateColor.at(state.at(index)?.state as number)} hover:cursor-pointer`}
        //       onMouseEnter={() => handleHover(i)}
        //       onMouseLeave={() => handleMouseLeave(i)}
        //       onClick={() => {
        //         handleActive(i)
        //         // router.push(`/${data.slug}` as Href<string | object>)
        //         console.log(endPoint)
        //       }}>
        //       <Text>{i.label}</Text>
        //     </div>)
        // }
        return (
          <Pressable
            key={i.slug}
            className={`py-2 px-4 rounded-md flex items-center gap-3 `}
            onPress={() => {
              handleActive(i)
              // router.push(`/${data.slug}` as Href<string | object>)
              console.log(endPoint)
            }}
          >
            <Text className={`text-sm ${stateColor.at(state.at(index)?.state as number)}`}>{i.label}</Text>
          </Pressable>
        )
      })}
    </HStack >
  )
}
