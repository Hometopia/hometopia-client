import { useState } from "react";
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
import { useGlobalContext } from "@/contexts/GlobalProvider";
import { Select as CustomSelect } from "@/components/custom/Select";

const AddressSectionSelect = ({
  items,
}: {
  items: { label: string; value: string }[];
}) => (
  <Select>
    <SelectTrigger variant="outline" size="md">
      <SelectInput placeholder="Tỉnh / Thành phố" />
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

export default function AddressForm() {
  const { platform, isLogged } = useGlobalContext();
  const [city, setCity] = useState("");
  return (
    <VStack className="flex w-96 flex-col justify-center gap-12">
      <VStack className="gap-4">
        <Text className="text-center text-3xl font-bold text-typography-900">
          Địa chỉ
        </Text>
        <Text className="text-center text-sm font-normal text-typography-500">
          Cho chúng tôi biết địa chỉ của bạn. Điều này sẽ giúp chúng tôi có thể
          tìm kiếm các dịch vụ gần nơi bạn ở.
        </Text>
      </VStack>

      <FormControl className="z-10 gap-8">
        <VStack className="z-10 gap-4">
          <VStack className="z-auto">
            <Text className="text-sm text-typography-500">
              Tỉnh / Thành phố
            </Text>
            {platform === "web" ? (
              <CustomSelect
                placeholder="Tỉnh / Thành phố"
                value={city}
                onChange={setCity}
              />
            ) : (
              <AddressSectionSelect items={[]} />
            )}
          </VStack>
          <VStack className="z-auto">
            <Text className="text-sm text-typography-500">Quận / Huyện</Text>
            {platform === "web" ? (
              <CustomSelect placeholder="Quận / Huyện" />
            ) : (
              <AddressSectionSelect items={[]} />
            )}
          </VStack>
          <VStack className="z-auto">
            <Text className="text-sm text-typography-500">Phường / Xã</Text>
            {platform === "web" ? (
              <CustomSelect placeholder="Phường / Xã" />
            ) : (
              <AddressSectionSelect items={[]} />
            )}
          </VStack>
          <VStack className="z-auto">
            <Text className="text-sm text-typography-500">Địa chỉ</Text>
            <Input>
              <InputField type="text" placeholder="Địa chỉ" />
            </Input>
          </VStack>
        </VStack>
        <Button size="md">
          <ButtonText>Hoàn thành</ButtonText>
        </Button>
      </FormControl>
      <VStack className="items-center">
        <HStack className="items-center gap-4">
          <Text className="text-sm text-typography-500">Đã có tài khoản ?</Text>
          <Button className="w-fit" variant="link" size="xs">
            <ButtonText className="text-sm text-primary-500">
              Đăng nhập ngay
            </ButtonText>
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
}
