import { View, Text } from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Image } from "@/components/ui/image";
import { IMAGE_URL } from "@/constants/public";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} className="h-full px-4">
        <View className="mb-6 px-2">
          <Image
            className="h-[30px] w-[120px]"
            source={require("@/assets/images/logo-full.png")}
            alt="image"
          />
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View>
        <Text>Footer</Text>
      </View>
    </View>
  );
}
