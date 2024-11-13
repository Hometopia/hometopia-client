import { Stack } from "expo-router";
import { IMAGE_URL } from "@/constants/public";

export default function AuthLayout_Web() {
  return (
    <div className="flex h-full bg-white">
      <div className="flex grow flex-col px-10 py-8">
        <div className="w-full">
          <img className="h-10" src={`${IMAGE_URL}/logo-full.svg`} alt="" />
        </div>
        <Stack screenOptions={{ headerShown: false }}></Stack>
      </div>
      <div className="h-full w-[480px] overflow-hidden">
        <img
          className="h-full w-full object-cover object-left"
          src={`${IMAGE_URL}/dreamlike.png`}
          alt="display-img"
        />
      </div>
    </div>
  );
}
