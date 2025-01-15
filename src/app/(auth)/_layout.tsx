import LogoFull from "@/components/custom/LogoFull";
import { Stack } from "expo-router";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";




export default function AuthLayout() {
  const { top } = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ paddingTop: top }} className="h-full flex flex-col bg-white" >
      <View style={{ marginLeft: 16, marginTop: 24 }}>
        <LogoFull />
      </View>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </SafeAreaView>
  );
}
