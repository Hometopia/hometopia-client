import { useEffect, useState } from "react";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { AlertCircleIcon, EyeClosedIcon, EyeIcon } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { router, useRouter } from "expo-router";
import { SafeAreaView, View } from "react-native";
import LogoFull from "@/components/custom/LogoFull";
import useFormControl from "@/hooks/useFormControl";
import { isValidEmail, isValidPassword } from "@/helpers/validation";
import useFormSubmit from "@/hooks/useFormSubmit";
import { AuthService } from "@/api/AuthService";
import { LoginForm, RegisterForm } from "@/api/types/request";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const emailControl = useFormControl("", (value): boolean => {
    return isValidEmail(value)
  })
  const passwordControl = useFormControl("", (value): boolean => {
    return isValidPassword(value)
  })
  const firstNameControl = useFormControl("", (value): boolean => {
    return value !== ""
  })
  const lastNameControl = useFormControl("", (value): boolean => {
    return value !== ""
  })

  const handleNavigateToSignIn = () => {
    // router.navigate('/(auth)/sign-in')

  }

  const validateAll = () => {
    firstNameControl.validate()
    lastNameControl.validate()
    emailControl.validate()
    passwordControl.validate()
  }

  const goToNextStep = async () => {
    if (
      firstNameControl.isValid &&
      lastNameControl.isValid &&
      emailControl.isValid &&
      passwordControl.isValid
    ) {
      let res = await AuthService.signUp({
        "username": emailControl.value,
        "firstName": firstNameControl.value,
        "lastName": lastNameControl.value,
        "email": emailControl.value,
        "password": passwordControl.value,
      } as RegisterForm)

      if (res.status == 201) {
        let isLogin = await AuthService.signIn({
          username: emailControl.value,
          password: passwordControl.value,
        } as LoginForm)

        if (isLogin) {
          router.replace('/')
        }
        else {

        }
      }
    }
  }

  const { handleSubmit } = useFormSubmit(validateAll, goToNextStep)

  return (
    <SafeAreaView className="h-full bg-white">
      <VStack className="h-full items-center justify-center">
        <VStack className="flex w-96 flex-col justify-center gap-12">
          <Text className="text-center text-3xl font-bold text-typography-900">
            Tạo tài khoản
          </Text>

          <VStack className="gap-4">
            <HStack className="self-stretch gap-4 justify-stretch">
              <FormControl
                className="grow"
                isRequired={true}
                isInvalid={!firstNameControl.isValid}
              >
                <FormControlLabel>
                  <FormControlLabelText className="text-md text-typography-500">
                    Tên
                  </FormControlLabelText>
                </FormControlLabel>
                <Input className="text-center" size="lg">
                  <InputField
                    type="text"
                    placeholder="A"
                    value={firstNameControl.value}
                    onChangeText={firstNameControl.onChange}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    Không thể trống
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl
                className="grow"
                isRequired={true}
                isInvalid={!lastNameControl.isValid}
              >
                <FormControlLabel>
                  <FormControlLabelText className="text-md text-typography-500">
                    Họ
                  </FormControlLabelText>
                </FormControlLabel>
                <Input className="text-center" size="lg">
                  <InputField
                    type="text"
                    placeholder="Nguyễn Văn"
                    value={lastNameControl.value}
                    onChangeText={lastNameControl.onChange} />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    Không thể trống
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </HStack>
            <FormControl
              isRequired={true}
              isInvalid={!emailControl.isValid}
            >
              <FormControlLabel>
                <FormControlLabelText className="text-md text-typography-500">
                  Email
                </FormControlLabelText>
              </FormControlLabel>
              <Input className="text-center" size="lg">
                <InputField
                  type="text"
                  placeholder="example@gmail.com"
                  value={emailControl.value}
                  onChangeText={emailControl.onChange} />
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  Email không hợp lệ
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl
              isRequired={true}
              isInvalid={!passwordControl.isValid}
            >
              <FormControlLabel>
                <FormControlLabelText className="text-md text-typography-500">
                  Mật khẩu
                </FormControlLabelText>
              </FormControlLabel>
              <Input className="text-center" size="lg">
                <InputField
                  type={showPassword ? "text" : "password"}
                  value={passwordControl.value}
                  onChangeText={passwordControl.onChange} />
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
              <FormControlHelper>
                <FormControlHelperText size="lg">
                  Ít nhất 6 ký tự và không bao gồm khoảng trắng
                </FormControlHelperText>
              </FormControlHelper>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} className="text-error-400" />
                <FormControlErrorText>
                  Mật khẩu phải có ít nhất 6 ký tự và không bao gồm khoảng trắng.
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </VStack>
          <Button size="lg" onPress={handleSubmit}>
            <ButtonText>Đăng ký</ButtonText>
          </Button>
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


