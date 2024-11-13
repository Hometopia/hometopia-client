import { useFocusEffect, useRouter } from "expo-router";
import { useGlobalContext } from "@/contexts/GlobalProvider";
import { useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";

//const
import { IMAGE_URL } from "@/constants/public";
import { Button, ButtonText } from "@/components/ui/button";

const NavItem = ({ label }: { label: string }) => (
  <div className="bg-transparent px-4 py-3 text-gray-500 hover:text-black">
    {label}
  </div>
);

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Hometopia | Landing";
  }, []);

  const { platform, isLogged } = useGlobalContext();
  useFocusEffect(
    useCallback(() => {
      if (isLogged) router.replace("/asset");
      else if (platform !== "web") {
        router.replace("/onboarding");
      }
    }, []),
  );

  return (
    <div>
      <nav className="mx-16 flex justify-between py-4">
        <img className="h-10" src={`${IMAGE_URL}/logo-full.svg`} />
        <ul className="flex list-none">
          <li>
            <NavItem label="Features" />
          </li>
          <li>
            <NavItem label="Resources" />
          </li>
          <li>
            <NavItem label="About" />
          </li>
        </ul>
        <ul className="flex list-none gap-4">
          <li>
            <Button
              className="w-[90px]"
              size="lg"
              variant="link"
              action="primary"
              onPress={() => router.navigate("/(auth)/sign-in")}
            >
              <ButtonText>Login</ButtonText>
            </Button>
          </li>
          <li>
            <Button
              size="lg"
              variant="solid"
              action="primary"
              onPress={() => router.navigate("/(auth)/sign-up")}
            >
              <ButtonText>Get started</ButtonText>
            </Button>
          </li>
        </ul>
      </nav>
      <main>
        <div className="flex flex-col items-center pb-8">
          <div className="flex justify-center gap-[130px] px-24 py-16">
            <span className="w-[537px] text-4xl font-bold">
              Giải pháp quản lí tài sản hiệu quả cho gia đình.{" "}
            </span>
            <img
              className="h-[150px] w-[150px] origin-left-center hover:animate-rotateScaleDrop"
              src={`${IMAGE_URL}/3dicons.png`}
            />
          </div>
          <div className="w-1/3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 text-center transition delay-150 duration-300 ease-in-out hover:-translate-y-2 hover:scale-110 hover:shadow-[0_4px_9px_0_rgb(0,0,0,0.1)]">
            <span className="cursor-default text-sm color-white">
              Phần mềm này được tạo ra với mục đích tốt nghiệp :3
            </span>
          </div>
        </div>
      </main>
      <img
        className="fixed top-0 -z-50 w-full"
        src={`${IMAGE_URL}/landing-bg.png`}
      />
    </div>
  );
}
