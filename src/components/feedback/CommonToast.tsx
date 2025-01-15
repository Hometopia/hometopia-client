import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Toast, ToastDescription, ToastTitle, useToast } from '../ui/toast'
import { HStack } from '../ui/hstack'
import { VStack } from '../ui/vstack'
import { CloseIcon, Icon } from '../ui/icon'

type ToastProps = {
  toast: any
  title: string
  description: string
  variant: "error" | "success"
}

export default function CommonToast({
  toast,
  title,
  description,
  variant,
}: ToastProps) {

  //styles

  const styles = {
    error: {
      toast: "gap-6 bg-error-50 w-full flex flex-row justify-between px-4 rounded-lg",
      title: "text-xl font-semibold text-error-500",
      desc: "text-error-400"
    },
    success: {
      toast: "gap-6 bg-success-50 w-full flex flex-row justify-between px-4 rounded-lg",
      title: "text-xl font-semibold text-success-500",
      desc: "text-success-400"
    }
  }
  //
  const [toastId, setToastId] = useState(0)
  const handleToast = () => {
    if (!toast.isActive(toastId.toString())) {
      showNewToast()
    }
  }
  const showNewToast = () => {
    const newId = Math.random()
    setToastId(newId)
    toast.show({
      id: newId.toString(),
      placement: 'bottom',
      duration: 2000,
      render: ({ id }: { id: any }) => {
        const uniqueToastId = "toast-" + id
        return (
          <View className="bg-transparent px-4 py-6">
            <Toast
              action="error"
              variant="solid"
              nativeID={uniqueToastId}
              style={{ paddingBottom: 40, paddingTop: 16 }}
              className={variant === "error" ? styles.error.toast : styles.success.toast}
            >
              <HStack space="md">
                <VStack space="xs">
                  <ToastTitle className={variant === "error" ? styles.error.title : styles.success.title}>
                    {title}
                  </ToastTitle>
                  <ToastDescription size="lg" className={variant === "error" ? styles.error.desc : styles.success.desc}>
                    {description}
                  </ToastDescription>
                </VStack>
              </HStack>
              <HStack className="min-[450px]:gap-3 gap-1">
                <Pressable onPress={() => toast.close(id)}>
                  <Icon as={CloseIcon} />
                </Pressable>
              </HStack>
            </Toast>
          </View>

        )
      },
    })
  }
  return {
    handleToast
  }
}