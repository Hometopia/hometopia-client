import { IMAGE_URL } from "@/constants/public"
import { useEffect, useState } from "react";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { EyeClosedIcon, EyeIcon } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import SignInForm from "@/components/form/SignInForm";

export default function SignIn_Web() {

  useEffect(() => {
    document.title = "Hometopia | Đăng nhập";
  }, []);

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex h-full">
      <div className="flex flex-col grow items-center py-8 px-10">
        <div className="w-full">
          <img className="h-10" src={`${IMAGE_URL}/logo-full.svg`} alt="" />
        </div>
        <SignInForm />
      </div>
      <div className="w-[480px] h-full overflow-hidden ">
        <img
          className="w-full h-full object-cover object-left"
          src={`${IMAGE_URL}/dreamlike.png`}
          alt="display-img" />
      </div>

    </div>
  )
}