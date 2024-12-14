import { SafeAreaView, View } from 'react-native'
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { ChevronDownIcon } from "lucide-react-native";
import LogoFull from '@/components/custom/LogoFull';
import { router } from 'expo-router';

const AddressSectionSelect = ({
  items,
  placeholder,
}: {
  items: { label: string; value: string }[],
  placeholder: string
}) => (
  <Select>
    <SelectTrigger variant="outline" size="lg" className='flex flex-row justify-between'>
      <SelectInput placeholder={placeholder} />
      <SelectIcon className="mr-3" as={ChevronDownIcon} />
    </SelectTrigger>
    <SelectPortal>
      <SelectBackdrop />
      <SelectContent>
        <SelectDragIndicatorWrapper>
          <SelectDragIndicator />
        </SelectDragIndicatorWrapper>
        {items.map((item) => (
          <SelectItem label={item.label} value={item.value} />
        ))}
      </SelectContent>
    </SelectPortal>
  </Select>
);

export default function Address() {

  const handleNavigateToSignIn = () => {
    router.navigate('/(auth)/sign-in')
  }
  const handleSubmit = () => {
    router.replace('/(nav)/dashboard')
  }
  return (
    <SafeAreaView className="h-full bg-white">
      <View className="h-full flex flex-col items-center justify-center">

        <VStack className="flex w-96 flex-col justify-center gap-12">
          <VStack className="gap-4">
            <Text className="text-center text-3xl font-bold text-typography-900">
              Địa chỉ
            </Text>
            <Text className="text-center text-lg font-normal text-typography-500">
              Cho chúng tôi biết địa chỉ của bạn. Điều này sẽ giúp chúng tôi có thể
              tìm kiếm các dịch vụ gần nơi bạn ở.
            </Text>
          </VStack>

          <FormControl className="z-10 gap-8">
            <VStack className="z-10 gap-4">
              <VStack className="z-auto">
                <Text className="text-md text-typography-500">
                  Tỉnh / Thành phố
                </Text>
                <AddressSectionSelect placeholder="Tỉnh / Thành phố" items={[]} />
              </VStack>
              <VStack className="z-auto">
                <Text className="text-md text-typography-500">Quận / Huyện</Text>
                <AddressSectionSelect placeholder="Quận / Huyện" items={[]} />
              </VStack>
              <VStack className="z-auto">
                <Text className="text-md text-typography-500">Phường / Xã</Text>
                <AddressSectionSelect placeholder="Phường / Xã" items={[]} />
              </VStack>
              <VStack className="z-auto">
                <Text className="text-md text-typography-500">Địa chỉ</Text>
                <Input size='lg'>
                  <InputField type="text" placeholder="Địa chỉ" />
                </Input>
              </VStack>
            </VStack>
            <Button size="lg" onPress={handleSubmit}>
              <ButtonText>Hoàn thành</ButtonText>
            </Button>
          </FormControl>

          <VStack className="items-center">
            <HStack className="items-center gap-4">
              <Text className="text-md text-typography-500">Đã có tài khoản ?</Text>
              <Button className="w-fit" variant="link" size="xs">
                <ButtonText className="text-md text-primary-500">
                  Đăng nhập ngay
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </View>
    </SafeAreaView>
  )
}