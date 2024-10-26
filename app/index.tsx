import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { Text } from "react-native";
import { useGlobalContext } from "@/contexts/GlobalProvider";

export default function Welcome() {
  const router = useRouter();

  const { platform, isLogged } = useGlobalContext();

  useFocusEffect(
    useCallback(() => {
      if (isLogged) router.replace("/assets");
      else if (platform === "web") {
        router.replace("/landing");
      } else router.replace("/onboarding");
    }, []),
  );

  return <Text>Welcome! Now, you're stuck here</Text>;
}
