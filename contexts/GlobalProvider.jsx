import { createContext, useContext, useEffect, useState } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Platform } from "react-native";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export default function GlobalProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const platform = Platform.OS;
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  //styles
  const primaryColor = "0 93 180"

  // useEffect(() => {
  //   setIsLogged(false);
  // }, []);

  return (
    <GlobalContext.Provider
      value={{ loading, platform, isLogged, setIsLogged, primaryColor }}
    >
      <GluestackUIProvider mode="light">{children}</GluestackUIProvider>
    </GlobalContext.Provider>
  );
}
