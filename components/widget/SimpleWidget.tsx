import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export default function SimpleWidget({ size = 180, label = 'Label', number = 123 }: { size?: number, label?: string, number?: number }) {
  return (
    <VStack style={{ width: size }} className="h-fit px-4 pt-2 pb-3 rounded-2xl bg-gradient-to-b from-blue-500 to-cyan-400 shadow-hard-2">
      <Text className="text-xs text-typography-0">{label}</Text>
      <Text className="text-3xl text-typography-0 w-full text-center ">{number}</Text>
    </VStack>
  )
}