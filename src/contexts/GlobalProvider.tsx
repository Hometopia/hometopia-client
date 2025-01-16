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

interface ContextProps {
  loading: boolean,
  isLogged: boolean | null,
  updateLoginState: () => void,
  location: Location.LocationObject | null,
  locationErrorMsg: string | null,
  getCurrentLocation: () => void
}
const GlobalContext = createContext<ContextProps>({
  loading: false,
  isLogged: null,
  updateLoginState: () => { },
  location: null,
  locationErrorMsg: null,
  getCurrentLocation: () => { }
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
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        loading,
        isLogged, updateLoginState,
        location, locationErrorMsg, getCurrentLocation
      } as ContextProps}
    >
      <GluestackUIProvider mode="light">
        <QueryProvider>
          {children}
        </QueryProvider>
      </GluestackUIProvider>
    </GlobalContext.Provider>
  );
}
