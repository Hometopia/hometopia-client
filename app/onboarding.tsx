import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";

export default function OnBoarding() {
  return (
    <VStack className="items-center justify-center h-full">
      <Text>It's mobile, bitch!</Text>
      <Link className="w-[100px] h-10 bg-primary-500 text-typography-0" href='/(auth)/sign-up'>Sign up</Link>
      <Link className="w-[100px] h-10 bg-primary-500 text-typography-0" href='/(nav)/dashboard'>Drawer</Link>
    </VStack>
  )
}
