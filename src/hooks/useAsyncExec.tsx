import { useEffect } from "react";

export const useAsyncExec = ({
  condition,
  callback,
}: {
  condition: boolean,
  callback: Function
}) => {
  useEffect(() => {
    if (condition) {
      callback()
    }
  }, [condition])

  return null
}