import { Image } from "../ui/image"

export default function LogoFull({
  theme = 'light'
}: {
  theme?: 'light' | 'dark'
}) {

  return (
    <Image
      className="w-[12rem] h-[3rem]"
      source={theme === 'light' ?
        require("../../../assets/images/logo-full-light.png") :
        require("../../../assets/images/logo-full-dark.png")}
      alt="hometopia full logo"
    />
  )
}