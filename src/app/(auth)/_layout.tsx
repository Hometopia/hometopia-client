import ColorModeSwitch from "@/components/custom/ColorModeSwitch";
import LogoFull from "@/components/custom/LogoFull";
import { useGlobalContext } from "@/contexts/GlobalProvider";
import { Stack } from "expo-router";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthLayout() {
  const globalValues = useGlobalContext()
  const { top } = useSafeAreaInsets()
  return (
    <SafeAreaView style={{ paddingTop: top }} className="h-full flex flex-col bg-background-0" >
      <View style={{ marginHorizontal: 16, marginTop: 24 }} className="flex flex-row justify-between">
        <LogoFull theme={globalValues.themeMode === 'dark' ? 'dark' : 'light'} />
        <ColorModeSwitch mode={globalValues.themeMode} onChange={globalValues.setAppThemeMode} />
      </View>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </SafeAreaView>
  );
}
