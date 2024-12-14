import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Link, useRouter } from "expo-router";
import { verifyInstallation } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "@/components/ui/image";
import { View } from "react-native";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import LogoFull from "@/components/custom/LogoFull";


export default function OnBoarding() {
  const router = useRouter()
  return (
    <SafeAreaView className="h-full bg-white">
      <VStack className="h-full items-center justify-start py-8">
        <LogoFull />
        <View className="grow flex flex-col gap-8  items-center justify-center px-8">
          <Image
            source={require("@/assets/images/onboarding-img.png")}
            size="2xl"
            alt="onboarding-img"
          />
          <Text className="text-typography-900 text-2xl font-semibold text-center">
            Khám phá ứng dụng truyệt vời dành cho ngôi nhà của bạn
          </Text>
          <Button
            className="self-stretch"
            variant="solid"
            action="primary"
            size="xl"
            onPress={() => router.replace('/(auth)/sign-up')}
          >
            <ButtonText>Đăng ký ngay</ButtonText>
          </Button>
          <Button
            className="self-stretch"
            variant="outline"
            action="primary"
            size="xl"
            onPress={() => router.replace('/(nav)/categories')}
          >
            <ButtonText>Dô cái screen đang code nè</ButtonText>
          </Button>
        </View>
      </VStack>
    </SafeAreaView>
  );
}
