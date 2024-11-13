import { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";

import SignUpForm from "@/components/form/SignUpForm";
import ConfirmEmailForm from "@/components/form/ConfirmEmailForm";
import { Button, ButtonIcon } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react-native";
import AddressForm from "@/components/form/AddressForm";

export default function SignUp_Web() {
  const navigator = useNavigation();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    document.title = "Hometopia | Đăng ký";
  }, []);

  //stepper
  const steps = [
    <SignUpForm
      submit={() => setActiveStep((prev) => prev + 1)}
      signIn={() => router.navigate("/sign-in")}
    />,
    <ConfirmEmailForm
      submit={() => setActiveStep((prev) => prev + 1)}
      signIn={() => router.navigate("/sign-in")}
      resend={() => router.navigate("/sign-in")}
    />,
    <AddressForm />,
  ];

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-white">
      <Button
        className="absolute left-0 top-4 rounded-full"
        variant="outline"
        action="secondary"
        isDisabled={activeStep > 0 ? false : true}
        onPress={() => setActiveStep((prev) => prev - 1)}
      >
        <ButtonIcon as={ChevronLeftIcon} />
      </Button>
      {steps[activeStep]}
    </div>
  );
}
