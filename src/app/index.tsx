import { router, SplashScreen, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Text, View } from "react-native";
import { useGlobalContext } from "@/contexts/GlobalProvider";
import { Spinner } from "@/components/ui/spinner";


export default function Welcome() {
  const values = useGlobalContext()

  useEffect(() => {
    values.updateLoginState()
  }, []);

  useEffect(() => {
    // if (!loading) {
    SplashScreen.hideAsync()
    // }
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (!values.loading) {
        if (values.isLogged)
          router.replace("/asset")
        else
          router.replace("/onboarding")
      }

    }, [values.loading]),
  );

  return (
    <View className="h-full bg-white flex justify-center items-center">
      <Spinner size="large" className="text-primary-400" />
    </View>
  )
}
