import { Stack } from "expo-router"
import { IMAGE_URL } from "@/constants/public"

export default function AuthLayout_Web() {
  return (
    <div className="flex h-full bg-white">
      <div className="flex flex-col grow py-8 px-10">
        <div className="w-full">
          <img className="h-10" src={`${IMAGE_URL}/logo-full.svg`} alt="" />
        </div>
        <Stack>
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        </Stack>
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
