import "../../global.css";
import GlobalProvider, { useGlobalContext } from "@/contexts/GlobalProvider";
import { router, Stack, useFocusEffect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import * as Linking from "expo-linking";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(() => {
    const handleDeepLink = (event: Linking.EventType) => {
      const url = event.url
      const path = Linking.parse(url).path
      if (path) {
        router.push(`/${path}`);
      }
    }

    Linking.addEventListener("url", handleDeepLink)
    // return () => Linking.removeEventListener("url", handleDeepLink);
  }, [])

  return (
    <GlobalProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      />

    </GlobalProvider>
  );
}
