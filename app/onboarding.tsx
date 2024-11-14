import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { verifyInstallation } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";


export default function OnBoarding() {
  return (
    <SafeAreaView className="h-full">
      <VStack className="h-full items-center justify-center ">
        <Text className="text-9xl">It's mobile, bitch!</Text>
        <Link
          className="h-10 w-[100px] bg-primary-500 text-typography-0"
          href="/(auth)/sign-up"
        >
          Sign up
        </Link>
        <Link
          className="h-10 w-[100px] bg-primary-500 text-typography-0"
          href="/(nav)/dashboard"
        >
          Drawer
        </Link>
      </VStack>
    </SafeAreaView>
  );
}
