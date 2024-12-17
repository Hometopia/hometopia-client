// includes: global context, gluestack provider, query client provider 

import { createContext, useContext, useEffect, useState } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Platform } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { AuthService } from "@/api/AuthService";

const GlobalContext = createContext()
const queryClient = new QueryClient()

export const useGlobalContext = () => useContext(GlobalContext)



export default function GlobalProvider({ children }) {

  const updateLoginState = async () => {
    try {
      setIsLogged(await AuthService.isSignIn())
    }
    catch (error) {
      console.error('updateLoginState fail with error: ', error)
    }
    finally {
      setLoading(false)
    }

  }

  const [loading, setLoading] = useState(true)
  const platform = Platform.OS
  const [isLogged, setIsLogged] = useState(null)
  useReactQueryDevTools(queryClient)

  return (
    <GlobalContext.Provider
      value={{ loading, platform, isLogged, updateLoginState }}
    >
      <GluestackUIProvider mode="light">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </GluestackUIProvider>
    </GlobalContext.Provider>
  );
}
