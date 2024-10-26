import AddressForm from "@/components/form/AddressForm";
import { VStack } from "@/components/ui/vstack";
import { Text } from "react-native";


export default function SignUp() {
  return (
    <VStack className="items-center justify-center h-full">
      <AddressForm />
    </VStack>

  )
}
