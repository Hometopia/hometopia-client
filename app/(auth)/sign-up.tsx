import { useState } from "react";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { EyeClosedIcon, EyeIcon } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { useRouter } from "expo-router";
import { SafeAreaView, View } from "react-native";
import LogoFull from "@/components/custom/LogoFull";

export default function SignUp() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const handleNavigateToSignIn = () => {
    router.navigate('/(auth)/sign-in')
  }
  const handleSubmit = () => {
    router.navigate('/(auth)/confirm-email')
  }
  return (
    <SafeAreaView className="h-full bg-white">
      <VStack className="h-full items-center justify-center">
        <VStack className="flex w-96 flex-col justify-center gap-12">
          <Text className="text-center text-3xl font-bold text-typography-900">
            Tạo tài khoản
          </Text>
          <FormControl className="gap-8">
            <VStack className="gap-4">
              <VStack>
                <Text className="text-md text-typography-500">Email</Text>
                <Input className="text-center" size="lg">
                  <InputField type="text" />
                </Input>
              </VStack>
              <VStack>
                <Text className="text-md text-typography-500">Mật khẩu</Text>
                <Input className="text-center" size="lg">
                  <InputField type={showPassword ? "text" : "password"} />
                  <InputSlot
                    className="pr-3"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <InputIcon
                      as={showPassword ? EyeIcon : EyeClosedIcon}
                      className="text-typography-500"
                    />
                  </InputSlot>
                </Input>
              </VStack>
              <VStack>
                <Text className="text-md text-typography-500">
                  Xác minh mật khẩu
                </Text>
                <Input className="text-center" size="lg">
                  <InputField type={showPassword ? "text" : "password"} />
                  <InputSlot
                    className="pr-3"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <InputIcon
                      as={showPassword ? EyeIcon : EyeClosedIcon}
                      className="text-typography-500"
                    />
                  </InputSlot>
                </Input>
              </VStack>
            </VStack>
            <Button size="lg" onPress={handleSubmit}>
              <ButtonText>Đăng ký</ButtonText>
            </Button>
          </FormControl>
          <VStack className="items-center">
            <HStack className="items-center gap-4">
              <Text className="text-md text-typography-500">Đã có tài khoản ?</Text>
              <Button className="w-fit" variant="link" size="xs" onPress={handleNavigateToSignIn}>
                <ButtonText className="text-md text-primary-500">
                  Đăng nhập ngay
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
}
