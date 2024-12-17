import { View, Text, TouchableOpacity } from "react-native";
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
import { Button } from "../ui/button";
import { AuthService } from "@/api/AuthService";
import { Icon } from "../ui/icon";
import { LogOutIcon } from "lucide-react-native";

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: top, paddingBottom: bottom }} >
      <DrawerContentScrollView {...props} className="h-full px-4">
        <View className="mb-4 px-2">
          <Image
            className="h-[30px] w-[120px]"
            source={require("@/assets/images/logo-full.png")}
            alt="image"
          />
        </View>
        <View className="flex flex-row justify-center py-2">
          <Text className="text-lg text-primary-400">Username</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View className="px-4 py-8">
        <TouchableOpacity
          className="flex flex-row gap-4 bg-background-50 px-4 py-4 rounded-xl items-center"
          onPress={() => {
            AuthService.signOut()
            router.replace('/')
          }}
        >
          <Icon as={LogOutIcon} size="lg" className="text-typography-800" />
          <Text className="text-typography-800 text-lg">Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
