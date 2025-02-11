import { useState } from "react";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { AlertCircleIcon, EyeClosedIcon, EyeIcon } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";
import { Pressable, SafeAreaView, View } from "react-native";
import { router } from "expo-router";
import useFormControl from "@/hooks/useFormControl";
import { isValidEmail, isValidPassword } from "@/helpers/validation";
import useFormSubmit from "@/hooks/useFormSubmit";
import { AuthService } from "@/api/AuthService";
import { Toast, ToastDescription, ToastTitle, useToast } from "@/components/ui/toast";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { LoginForm } from "@/api/types/request";
import { useMutation } from "@tanstack/react-query";
import Loading from "@/components/feedback/Loading";
import BaseScreenContainer from "@/components/container/BaseScreenContainer";
import { Spinner } from "@/components/ui/spinner";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)

  const emailControl = useFormControl("", (value): boolean => {
    return isValidEmail(value)
    return true
  })
  const passwordControl = useFormControl("", (value): boolean => {
    return isValidPassword(value)
  })

  const signInMutation = useMutation({
    mutationFn: (form: LoginForm) => AuthService.signIn(form),
    onSuccess: (res) => {
      if (res === true) {
        router.replace('/')
      } else {
        handleToast()
      }
    },
    onError: (err) => { }
  })

  const handleNavigateToSignUp = () => {
    router.navigate('/(auth)/sign-up')
  }
  const handleNavigateToForgotPassword = () => {
    router.navigate('/(auth)/forgot-password')
  }

  const validateAll = () => {
    emailControl.validate()
    passwordControl.validate()
  }

  const toast = useToast()
  const [toastId, setToastId] = useState(0)
  const handleToast = () => {
    if (!toast.isActive(toastId.toString())) {
      showNewToast()
    }
  }
  const showNewToast = () => {
    const newId = Math.random()
    setToastId(newId)
    toast.show({
      id: newId.toString(),
      placement: "bottom",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id
        return (
          <View className="bg-transparent px-4 py-6">
            <Toast
              action="error"
              variant="solid"
              nativeID={uniqueToastId}
              style={{ paddingBottom: 40, paddingTop: 16 }}
              className="gap-6 bg-error-50 w-full flex flex-row justify-between px-4 rounded-lg"
            >
              <HStack space="md">
                <VStack space="xs">
                  <ToastTitle className="text-xl font-semibold text-error-500">
                    Đăng nhập thất bại !
                  </ToastTitle>
                  <ToastDescription size="lg" className="text-error-400">
                    Email hoặc mật khẩu không đúng.
                  </ToastDescription>
                </VStack>
              </HStack>
              <HStack className="min-[450px]:gap-3 gap-1">
                <Pressable onPress={() => toast.close(id)}>
                  <Icon as={CloseIcon} />
                </Pressable>
              </HStack>
            </Toast>
          </View>

        )
      },
    })
  }

  const submit = async () => {
    if (
      emailControl.isValid &&
      passwordControl.isValid
    ) {
      signInMutation.mutate({
        username: emailControl.value.trim(),
        password: passwordControl.value,
      } as LoginForm)
    }
  }

  const { handleSubmit } = useFormSubmit(validateAll, submit)
  return (
    <BaseScreenContainer>
      <View className="h-full flex flex-col items-center justify-center">
        <VStack className="flex w-96 flex-col justify-center gap-12">
          <Text className="text-center text-3xl font-bold text-typography-900">
            Đăng nhập
          </Text>
          <VStack className="gap-8">
            <VStack className="gap-4">
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
                    placeholder=""
                    autoCapitalize='none'
                    keyboardType='visible-password'
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
                    autoCapitalize='none'
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
            <Button className="rounded-lg" size="xl" onPress={handleSubmit}>
              {signInMutation.isPending ?
                <Spinner size='small' color='#fff' />
                :
                <ButtonText>Đăng nhập</ButtonText>
              }
            </Button>
          </VStack>


          <VStack className="items-center">
            {/* <Button
              className="w-fit"
              variant="link"
              size="xs"
              onPress={handleNavigateToForgotPassword}
              disabled
            >
              <ButtonText className="text-md text-primary-500">
                Quên mật khẩu
              </ButtonText>
            </Button> */}
            <Divider className="my-4 w-16" />
            <HStack className="items-center gap-4">
              <Text className="text-md text-typography-500">
                Chưa có tài khoản ?
              </Text>
              <Button className="w-fit" variant="link" size="xs" onPress={handleNavigateToSignUp}>
                <ButtonText className="text-md text-primary-500">
                  Đăng ký ngay
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </View>
    </BaseScreenContainer>
  );
}
