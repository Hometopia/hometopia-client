import { IMAGE_URL } from "@/constants/public"
import { useEffect } from "react";
import SignInForm from "@/components/form/SignInForm";
import { useNavigation, useRouter } from "expo-router";


export default function SignIn_Web() {
  const navigator = useNavigation()
  const router = useRouter()

  useEffect(() => {
    document.title = "Hometopia | Đăng nhập";
  }, []);


  return (
    <div className="h-full w-full flex justify-center items-center bg-white">
      <SignInForm
        submit={() => router.push('/(auth)/sign-in')}
        signUp={() => router.push('/(auth)/sign-up')}
        forgotPassword={() => router.push('/(auth)/forgot-password')}
      />
    </div>
  )
}