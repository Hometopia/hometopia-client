import { useGlobalContext } from "@/contexts/GlobalProvider";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { Image } from "../ui/image";
import { Spinner } from "../ui/spinner";

export default function SimpleWidget({
  className = 'w-[185px]',
  label = "Label",
  number,
}: {
  className?: string;
  label?: string;
  number?: number;
}) {

  return (
    <VStack
      className={`${className} relative rounded-2xl justify-center items-center gap-2`}
    >
      <Text className="text-md font-medium text-typography-0">{label}</Text>
      {(number !== undefined) ?
        <Text className="justify-center px-4 text-4xl text-typography-0 font-bold">
          {number}
        </Text> :
        <Spinner size="large" className="text-white" />
      }
      <Image
        className="absolute w-full h-full top-0 left-0 -z-10 rounded-2xl"
        source={require('@/assets/images/illustration/holo-1.png')}
        alt="holo-1"
      />
    </VStack>
  );
}
