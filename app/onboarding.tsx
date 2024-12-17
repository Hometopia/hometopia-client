import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Link, useRouter } from "expo-router";
import { verifyInstallation } from "nativewind";
import { Image } from "@/components/ui/image";
import { SafeAreaView, View } from "react-native";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import LogoFull from "@/components/custom/LogoFull";
import { AuthService, LoginForm } from "@/api/AuthService";
import { tokenKeyStorage, LoginSession } from "@/api/SecureStore";
import { useGlobalContext } from "@/contexts/GlobalProvider";


export default function OnBoarding() {
  const router = useRouter()
  const { updateLoginState } = useGlobalContext()
  return (
    <SafeAreaView style={{ paddingTop: 24 }} className="h-full bg-white">
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
            onPress={() => router.navigate('/(auth)/sign-up')}
          >
            <ButtonText>Đăng ký ngay</ButtonText>
          </Button>
          <Text className="text-lg">Đã có tài khoản</Text>
          <Button
            className="self-stretch"
            variant="outline"
            action="primary"
            size="xl"
            onPress={() => router.navigate('/(auth)/sign-in')}
          // onPress={async () => {
          //   let login = await AuthService.signIn({
          //     username: "qwvjbjqb@mg.com",
          //     password: "292003",
          //   } as LoginForm)

          //   if (login) {
          //     // updateLoginState()
          //     router.navigate('/')
          //   }
          // }}
          >
            <ButtonText>Đăng nhập</ButtonText>
          </Button>
        </View>
      </VStack>
    </SafeAreaView >
  );
}
