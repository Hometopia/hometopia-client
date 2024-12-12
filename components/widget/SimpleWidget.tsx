import { useGlobalContext } from "@/contexts/GlobalProvider";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { Image } from "../ui/image";

export default function SimpleWidget({
  className = 'w-[185px]',
  label = "Label",
  number = 123,
}: {
  className?: string;
  label?: string;
  number?: number;
}) {
  const { platform } = useGlobalContext()
  if (platform === 'web')
    return (
      <VStack
        className={`${className} relative h-fit rounded-2xl px-4 pb-3 pt-2 shadow-hard-2 bg-transparent`}
      >
        <Text className="text-xs text-typography-0">{label}</Text>
        <Text className="w-full text-center text-3xl text-typography-0">
          {number}
        </Text>
        <Image
          className="absolute w-full h-full top-0 left-0 -z-10 rounded-2xl"
          source={require('@/assets/images/illustration/holo-1.png')}
          alt="holo-1"
        />
      </VStack>
    )
  else
    return (
      <VStack
        className={`${className} relative rounded-2xl justify-center items-center gap-2`}
      >
        <Text className="text-md font-medium text-typography-0">{label}</Text>
        <Text className="justify-center px-4 text-4xl text-typography-0 font-bold">
          {number}
        </Text>
        <Image
          className="absolute w-full h-full top-0 left-0 -z-10 rounded-2xl"
          source={require('@/assets/images/illustration/holo-1.png')}
          alt="holo-1"
        />
      </VStack>
    );
}
