import "../global.css";
import GlobalProvider, { useGlobalContext } from "@/contexts/GlobalProvider";
import { Stack, useFocusEffect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useEffect, useState } from "react";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(() => {
    //guess tailwind css availability time
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 200)

  }, []);


  return (
    <GlobalProvider>
      <Stack
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="landing" />
      </Stack>
    </GlobalProvider>
  );
}
