import { Image } from "../ui/image"
export default function LogoFull() {
  return (
    <Image
      className="w-[12rem] h-[3rem]"
      source={require("@/assets/images/logo-full.png")}
      alt="hometopia full logo"
    />
  )
}