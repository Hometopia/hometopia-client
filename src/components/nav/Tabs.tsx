import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { Href, useFocusEffect, usePathname, useRouter } from "expo-router";
import { TabItemType } from "@/constants/types";
import { HStack } from "../ui/hstack";
import { useGlobalContext } from "@/contexts/GlobalProvider";
import { View } from "react-native";
import { Pressable } from "../ui/pressable";

enum TabItemState {
  default = 0,
  hover = 1,
  active = 2,
}

export default function Tabs({
  data,
  onPress,
}: {
  data: TabItemType[]
  onPress?: any
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(
    pathname
      .split("/")
      .filter(Boolean)
      .at(pathname.split("/").filter(Boolean).length - 1),
  );
  const [state, setState] = useState<{ key: string; state: TabItemState }[]>(
    [],
  );

  useFocusEffect(
    useCallback(() => {
      setActive(
        pathname
          .split("/")
          .filter(Boolean)
          .at(pathname.split("/").filter(Boolean).length - 1),
      );
    }, [pathname]),
  );

  useEffect(() => {
    setState(
      data.map((i) => {
        if (i.slug === active)
          return {
            key: i.slug,
            state: TabItemState.active,
          };
        else
          return {
            key: i.slug,
            state: TabItemState.default,
          };
      }),
    );
  }, [active]);

  const handleActive = (item: TabItemType) => {
    setState((prev) =>
      prev.map((i) => {
        if (i.key === item.slug) i.state = TabItemState.active;
        else i.state = TabItemState.default;
        return i;
      }),
    );
  };

  const stateColor = [
    "text-typography-400",
    "text-typography-600",
    "text-primary-400",
  ];

  const borderStateStyle = ["", "", "border-b-2 border-primary-400"];

  const handleHover = (item: TabItemType) => {
    if (item.slug === active) return
    setState((prev) =>
      prev?.map((i) => {
        if (i.key === item.slug) {
          i.state = TabItemState.hover;
        }
        return i;
      }),
    );
  };
  const handleMouseLeave = (item: TabItemType) => {
    if (item.slug === active) return
    setState((prev) =>
      prev?.map((i) => {
        if (i.key === item.slug) {
          i.state = TabItemState.default;
          console.log("hey, i'm leave");
        }
        return i;
      }),
    );
  };
  const { platform } = useGlobalContext();

  return (
    <HStack className={``}>
      {data.map((i, index) => {
        if (platform === 'web') {
          return (
            <div
              key={i.slug}
              className={`flex items-center px-4 py-2 ${borderStateStyle.at(state?.at(index)?.state as number)} hover:cursor-pointer`}
              onMouseEnter={() => handleHover(i)}
              onMouseLeave={() => handleMouseLeave(i)}
              onClick={() => {
                handleActive(i)
                router.push(
                  `${pathname.substring(0, pathname.lastIndexOf("/"))}/${i.slug}` as Href<`${string}/${string}`>,
                )
              }}>
              <Text
                className={`text-md font-medium ${stateColor.at(state?.at(index)?.state as number)}`}
              >
                {i.label}
              </Text>
            </div>)
        }
        return (
          <Pressable
            key={i.slug}
            className={`flex items-center px-4 py-2 ${borderStateStyle.at(state?.at(index)?.state as number)}`}
            onPress={() => {
              handleActive(i);
              router.replace(
                `${pathname.substring(0, pathname.lastIndexOf("/"))}/${i.slug}` as Href<`${string}/${string}`>,
              );
              onPress(index)
            }}
          >
            <Text
              className={`text-lg font-medium ${stateColor.at(state?.at(index)?.state as number)}`}
            >
              {i.label}
            </Text>
          </Pressable>
        );
      })}
    </HStack>
  );
}
