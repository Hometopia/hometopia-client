import { router, SplashScreen, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Text, View } from "react-native";
import { useGlobalContext } from "@/contexts/GlobalProvider";
import { Spinner } from "@/components/ui/spinner";


export default function Welcome() {
  // const { isLogged, loading, updateLoginState } = useGlobalContext()

  // useEffect(() => {
  //   updateLoginState()
  // }, []);

  useEffect(() => {
    // if (!loading) {
    SplashScreen.hideAsync()
    // }
  }, [])

  // useFocusEffect(
  //   useCallback(() => {
  //     if (!loading) {
  //       //test
  //       // router.replace("/test")
  //       //
  //       if (isLogged)
  //         router.replace("/asset")
  //       else
  //         router.replace("/onboarding")
  //     }

  //   }, [loading]),
  // );

  useFocusEffect(
    useCallback(() => {
      router.replace("/onboarding")
    }, []),
  );

  return (
    <View className="h-full bg-white flex justify-center items-center">
      <Spinner size="large" className="text-primary-400" />
    </View>
  )
}
