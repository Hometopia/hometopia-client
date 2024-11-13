import { View } from "react-native";
import { Image } from "../ui/image";
import { IMAGE_URL } from "@/constants/public";
import { Button, ButtonText } from "../ui/button";
import { useState } from "react";
import { useGlobalContext } from "@/contexts/GlobalProvider";
import { Pressable } from "../ui/pressable";

export default function ImageUploader({ className }: { className?: string }) {
  const [active, setActive] = useState(false)
  const { platform } = useGlobalContext()
  if (platform === 'web')
    return (
      <div
        className={`${className ? className : 'w-[240px] h-[240px]'} relative overflow-hidden rounded-md`}
        onMouseEnter={() => setActive(prev => prev = true)}
        onMouseLeave={() => setActive(prev => prev = false)}
      >
        <View
          className={`${active ? `flex` : `hidden`} absolute z-50 h-full w-full items-center justify-center bg-black/[0.2]`
          }
        >
          <Button className="w-fit">
            <ButtonText>Tải lên</ButtonText>
          </Button>
        </View>
        <Image
          className="h-full w-full"
          source={require(`@/assets/images/dev/asset-1.jpg`)}
          alt="asset-1"
        />
      </div>
    )
  else
    return (
      <Pressable
        className={`${className ? className : 'w-[240px] h-[240px]'} relative overflow-hidden rounded-md`}
        onPress={() => setActive(prev => !prev)}
      >
        <View
          className={`${active ? `flex` : `hidden`} absolute z-50 h-full w-full items-center justify-center bg-black/[0.2]`
          }
        >
          <Button className="w-fit">
            <ButtonText>Tải lên</ButtonText>
          </Button>
        </View>
        <Image
          className="h-full w-full"
          source={require(`@/assets/images/dev/asset-1.jpg`)}
          alt="asset-1"
        />
      </Pressable>
    )
}
