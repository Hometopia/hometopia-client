import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { Text } from "react-native";
import { useGlobalContext } from "@/contexts/GlobalProvider";

export default function Welcome() {
  const router = useRouter();

  const { platform, isLogged } = useGlobalContext();

  useFocusEffect(
    useCallback(() => {
      console.log("ưtf")
      if (isLogged) router.replace("/asset");
      else if (platform === "web") {
        router.replace("/landing");
      } else {
        console.log("mobile, bitch")
        router.replace("/onboarding");
      }

    }, []),
  );

  return <Text>Welcome! Now, you're stuck here</Text>;
}
