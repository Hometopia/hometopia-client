// includes: global context, gluestack provider, query client provider 

import { createContext, useContext, useEffect, useState } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Platform } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { AuthService } from "@/api/AuthService";
import { useToast } from "@/components/ui/toast";
import * as Location from 'expo-location'
import QueryProvider from "./QueryProvider";
import { LocalConfig, keyStorage } from './AppLocalConfig'
import { StatusBar } from "expo-status-bar";
import { AssetDisplayModeType } from "@/constants/types";

interface ContextProps {
  loading: boolean,
  isLogged: boolean | null,
  updateLoginState: () => void,
  location: Location.LocationObject | null,
  locationErrorMsg: string | null,
  getCurrentLocation: () => void,
  themeMode: "light" | "dark" | "system",
  setAppThemeMode: Function,
  assetDisplayMode: AssetDisplayModeType,
  setAppAssetDisplayMode: Function
}
const GlobalContext = createContext<ContextProps>({
  loading: false,
  isLogged: null,
  updateLoginState: () => { },
  location: null,
  locationErrorMsg: null,
  getCurrentLocation: () => { },
  themeMode: "system",
  setAppThemeMode: Function,
  assetDisplayMode: 'location',
  setAppAssetDisplayMode: Function
})
export const useGlobalContext = () => useContext(GlobalContext)

export default function GlobalProvider({ children }: { children: React.ReactNode }) {

  const updateLoginState = async () => {
    try {
      setLoading(true)
      setIsLogged(await AuthService.isSignIn())
    }
    catch (error) {
      console.error('updateLoginState fail with error: ', error)
    }
    finally {
      setLoading(false)
    }

  }
  //theme mode
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">()
  const setAppThemeMode = (mode: "light" | "dark" | "system") => {
    LocalConfig.saveWithKey(keyStorage.THEME_MODE, mode)
    setThemeMode(mode)
  }
  //asset display mode
  const [assetDisplayMode, setAssetDisplayMode] = useState<AssetDisplayModeType>()
  const setAppAssetDisplayMode = (mode: AssetDisplayModeType) => {
    LocalConfig.saveWithKey(keyStorage.ASSET_DISPLAY_MODE, mode)
    setAssetDisplayMode(mode)
  }
  //
  const [loading, setLoading] = useState<boolean>(true)
  const [isLogged, setIsLogged] = useState<boolean | null>(null)

  //location
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null)
  async function getCurrentLocation() {

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  }
  useEffect(() => {
    getCurrentLocation()
    const fetchThemeMode = async () => {
      const mode = await LocalConfig.getWithKey(keyStorage.THEME_MODE)
      if (mode) {
        setThemeMode(mode as "light" | "dark" | "system")
      } else {
        setThemeMode("light")
      }
    }
    const fetchAssetDisplayMode = async () => {
      const mode = await LocalConfig.getWithKey(keyStorage.ASSET_DISPLAY_MODE)
      if (mode) {
        setAssetDisplayMode(mode as AssetDisplayModeType)
      } else {
        setAssetDisplayMode('location')
      }
    }
    fetchThemeMode()
    fetchAssetDisplayMode()
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        loading,
        isLogged, updateLoginState,
        location, locationErrorMsg, getCurrentLocation,
        themeMode, setAppThemeMode,
        assetDisplayMode, setAppAssetDisplayMode
      } as ContextProps}
    >
      <GluestackUIProvider mode={themeMode}>
        <QueryProvider>
          {children}
          <StatusBar
            style={
              themeMode === 'dark' ? 'light' : 'dark'
            }
            backgroundColor={
              themeMode === 'dark' ? '#000' : '#fff'
            }
          />
        </QueryProvider>
      </GluestackUIProvider>
    </GlobalContext.Provider>
  );
}
