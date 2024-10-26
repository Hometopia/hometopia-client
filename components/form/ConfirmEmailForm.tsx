import { useState } from "react";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { EyeClosedIcon, EyeIcon } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";

export default function ConfirmEmailForm({
  submit,
  signIn,
  resend
}: {
  submit: any,
  signIn: any,
  resend: any
}) {
  return (
    <VStack className="flex flex-col w-96 justify-center gap-12">
      <VStack className="gap-4">
        <Text className="text-center text-3xl font-bold text-typography-900">Xác minh email</Text>
        <Text className="text-center text-sm font-normal text-typography-500">Chúng tôi sẽ gửi mã đến email 21520953@gm.uit.edu.vn.
          Điền mã vào ô dưới đây để xác minh email của bạn.</Text>
      </VStack>

      <FormControl className="gap-8">
        <VStack className="gap-4">
          <VStack>
            <Text className="text-sm text-typography-500">Mã xác minh</Text>
            <Input className="text-center">
              <InputField type="text" />
            </Input>
          </VStack>
        </VStack>
        <Button size='md' onPress={submit}>
          <ButtonText>Xác minh</ButtonText>
        </Button>
      </FormControl>
      <VStack className="items-center">
        <HStack className="items-center gap-4">
          <Text className='text-sm text-typography-500' >Không nhận được mã ?</Text>
          <Button className="w-fit" variant="link" size='xs' onPress={resend}>
            <ButtonText className='text-sm text-primary-500'>Gửi lại</ButtonText>
          </Button>
        </HStack>
        <Divider className="my-4 w-16" />
        <HStack className="items-center gap-4">
          <Text className='text-sm text-typography-500' >Đã có tài khoản ?</Text>
          <Button className="w-fit" variant="link" size='xs' onPress={signIn}>
            <ButtonText className='text-sm text-primary-500'>Đăng nhập ngay</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </VStack>
  )
}