import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Href, Link, router, useRouter } from "expo-router";
import { verifyInstallation } from "nativewind";
import { Image } from "@/components/ui/image";
import { SafeAreaView, View } from "react-native";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import LogoFull from "@/components/custom/LogoFull";
import { AuthService } from "@/api/AuthService";
import { tokenKeyStorage, LoginSession } from "@/api/SecureStore";
import { useGlobalContext } from "@/contexts/GlobalProvider";
import ColorModeSwitch from "@/components/custom/ColorModeSwitch";


export default function OnBoarding() {
  const globalValues = useGlobalContext()
  return (
    <SafeAreaView style={{ paddingTop: 24 }} className="h-full bg-background-0">
      <VStack className="h-full items-center justify-start py-8">
        <LogoFull theme={globalValues.themeMode === 'dark' ? 'dark' : 'light'} />
        <View className="grow flex flex-col gap-8  items-center justify-center px-8">
          <Image
            source={globalValues.themeMode === 'dark' ?
              require("../../assets/images/onboarding-img-dark.png") :
              require("../../assets/images/onboarding-img-light.png")
            }
            size="2xl"
            alt="onboarding-img"
          />
          <Text className="text-typography-900 text-2xl font-semibold text-center pb-8">
            Khám phá ứng dụng truyệt vời dành cho ngôi nhà của bạn
          </Text>
          <View className="flex flex-col gap-4 self-stretch items-center">
            <Button
              size="xl"
              className="self-stretch rounded-lg"
              onPress={() => router.replace('/(auth)/sign-up' as Href)}
            >
              <ButtonText>Đăng ký</ButtonText>
            </Button>
            {/* <Button size="xl" className="self-stretch" onPress={() => router.replace('/(_main)/dashboard' as Href)}>
              <ButtonText>Bắt đầu mà không cần tài khoản</ButtonText>
            </Button> */}
            <Text className="text-lg">Đã có tài khoản</Text>
            <Button
              className="self-stretch rounded-lg"
              variant="outline"
              action="primary"
              size="xl"
              onPress={() => router.replace('/(auth)/sign-in')}
            >
              <ButtonText>Đăng nhập</ButtonText>
            </Button>
          </View>
        </View>
        <ColorModeSwitch mode={globalValues.themeMode} onChange={globalValues.setAppThemeMode} />
      </VStack>
    </SafeAreaView >
  );
}
