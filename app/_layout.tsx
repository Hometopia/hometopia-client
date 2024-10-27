import "../global.css";
import GlobalProvider from "@/contexts/GlobalProvider";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const [loaded, setLoaded] = useState(false)

  // useEffect(() => {
  //   setLoaded(true)
  // }, []);

  // if (!loaded) {
  //   return null;
  // }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="(nav)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="landing" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
}
