import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";

export default function OnBoarding() {
  return (
    <VStack className="items-center justify-center h-full">
      <Text>It's mobile, bitch!</Text>
      <Link href='/(auth)/sign-up'>Sign up</Link>
    </VStack>
  )
}
