import { useEffect } from "react";
import SignInForm from "@/components/form/SignInForm";
import { useRouter } from "expo-router";
import ForgotPasswordForm from "@/components/form/ForgotPassword";


export default function ForgotPassword_Web() {

  const router = useRouter()

  useEffect(() => {
    document.title = "Hometopia | Quên mật khẩu";
  }, []);


  return (
    <div className="h-full w-full flex justify-center items-center bg-white">
      <ForgotPasswordForm
        submit={() => router.navigate('./')}
        signUp={() => router.push('/(auth)/sign-up')}
        signIn={() => router.push('/(auth)/sign-in')}
      />
    </div>
  )
}