import { SplashScreen, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Text, View } from "react-native";
import { useGlobalContext } from "@/contexts/GlobalProvider";
import { Spinner } from "@/components/ui/spinner";


export default function Welcome() {
  const router = useRouter();

  const { isLogged, loading, updateLoginState } = useGlobalContext();

  useEffect(() => {
    updateLoginState()
  }, []);

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync()
    }
  }, [loading])

  useFocusEffect(
    useCallback(() => {
      if (!loading) {
        if (isLogged)
          router.replace("/asset")
        else
          router.replace("/onboarding")
      }

    }, [loading]),
  );

  return (
    <View className="h-full bg-white flex justify-center items-center">
      <Spinner size="large" className="text-primary-400" />
    </View>
  )
}
