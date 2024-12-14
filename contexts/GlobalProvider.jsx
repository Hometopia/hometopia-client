import { createContext, useContext, useEffect, useState } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Platform } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from '@dev-plugins/react-query';

const GlobalContext = createContext()
const queryClient = new QueryClient()

export const useGlobalContext = () => useContext(GlobalContext)

export default function GlobalProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const platform = Platform.OS;
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  useReactQueryDevTools(queryClient)

  // useEffect(() => {
  //   setIsLogged(false);
  // }, []);

  return (
    <GlobalContext.Provider
      value={{ loading, platform, isLogged, setIsLogged }}
    >
      <GluestackUIProvider mode="light">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </GluestackUIProvider>
    </GlobalContext.Provider>
  );
}
