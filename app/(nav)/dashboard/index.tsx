import { VStack } from "@/components/ui/vstack";
import { Text } from "react-native";
import { Image } from "@/components/ui/image";
import { IMAGE_URL } from '@/constants/public'

export default function Dashboard() {
  return (
    <VStack className="items-center justify-center h-full">
      <Text style={{ color: "var(--color-primary-400)" }}>Dashboard</Text>

    </VStack>
  )
}
