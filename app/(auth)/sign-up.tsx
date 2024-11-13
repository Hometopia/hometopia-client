import AddressForm from "@/components/form/AddressForm";
import { VStack } from "@/components/ui/vstack";
import { Text } from "react-native";

export default function SignUp() {
  return (
    <VStack className="h-full items-center justify-center">
      <AddressForm />
    </VStack>
  );
}
