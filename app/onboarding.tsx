import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";

export default function OnBoarding() {
  return (
    <VStack className="h-full items-center justify-center">
      <Text>It's mobile, bitch!</Text>
      {/* <Link
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
      </Link> */}
    </VStack>
  );
}
