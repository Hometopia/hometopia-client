import { useState } from "react";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { EyeClosedIcon, EyeIcon } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";

export default function ForgotPasswordForm({
  submit,
  signUp,
  signIn,
}: {
  submit: any;
  signUp: any;
  signIn: any;
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <VStack className="flex w-96 flex-col justify-center gap-12">
      <Text className="text-center text-3xl font-bold text-typography-900">
        Quên mật khẩu
      </Text>
      <FormControl className="gap-8">
        <VStack className="gap-4">
          <VStack>
            <Text className="text-sm text-typography-500">Email</Text>
            <Input className="text-center">
              <InputField type="text" />
            </Input>
          </VStack>
          <VStack>
            <Text className="text-sm text-typography-500">Mật khẩu</Text>
            <Input className="text-center">
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
        <Button size="md" onPress={submit}>
          <ButtonText>Submit</ButtonText>
        </Button>
      </FormControl>
      <VStack className="items-center">
        <HStack className="items-center gap-4">
          <Text className="text-sm text-typography-500">Đã có tài khoản ?</Text>
          <Button className="w-fit" variant="link" size="xs" onPress={signIn}>
            <ButtonText className="text-sm text-primary-500">
              Đăng nhập ngay
            </ButtonText>
          </Button>
        </HStack>
        <Divider className="my-4 w-16" />
        <HStack className="items-center gap-4">
          <Text className="text-sm text-typography-500">
            Chưa có tài khoản ?
          </Text>
          <Button className="w-fit" variant="link" size="xs" onPress={signUp}>
            <ButtonText className="text-sm text-primary-500">
              Đăng ký ngay
            </ButtonText>
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
}
