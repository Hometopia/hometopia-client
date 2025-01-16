import { useRouter, useFocusEffect, usePathname, Href } from "expo-router";
import { useCallback } from "react"
export default function AssetDetails() {
  const pathname = usePathname()
  const router = useRouter()

  useFocusEffect(
    useCallback(() => {
      router.replace(`${pathname}/general` as Href)
    }, [])
  )
  return null
}
