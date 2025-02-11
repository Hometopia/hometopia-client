import { View, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Text } from '../ui/text'
import { LinearGradient } from "expo-linear-gradient"
import { Divider } from '../ui/divider'

const ActionButton = ({
  isDisabled,
  text = 'action',
  variant = 'primary',
  onPress
}: {
  isDisabled: boolean,
  text?: string,
  variant?: 'primary' | 'negative' | 'warning',
  onPress: Function
}) => {
  // const variantColor = variant === 'primary' ? ''
  return (
    <TouchableOpacity
      className={'rounded-xl border py-2 px-4' + ` ${variant === 'primary' ? 'border-primary-400' :
        variant === 'negative' ? 'border-error-400' : 'border-warning-400'
        }`}
      onPress={() => onPress()}
    >
      <Text className={'text-md' + ` ${variant === 'primary' ? 'text-primary-400' :
        variant === 'negative' ? 'text-error-400' : 'text-warning-400'
        }`}>{text}</Text>
    </TouchableOpacity>
  )
}
export default function SelectedListActionPanel({
  theme = 'light', number = 0, selectAllFn, unSelectAllFn, actionText, actionFn, actionVariant = 'negative'
}: {
  theme: 'dark' | 'light'
  number: number
  selectAllFn?: Function,
  unSelectAllFn?: Function,
  actionText?: string,
  actionFn?: Function,
  actionVariant?: 'primary' | 'negative' | 'warning'
}) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme === 'dark' ?
          ["rgba(0,0,0,1.0)", "rgba(0,0,0,0)"] :
          ["rgba(255,255,255,1.0)", "rgba(255,255,255,0)"]} // Mờ dần từ bottom -> top
        start={{ x: 0, y: 0.4 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBackground}
      />
      {/* Floating Action Button */}
      <View className='absolute bottom-4 flex flex-col items-center'>
        <View className='flex flex-row gap-2'>
          <ActionButton
            isDisabled={false}
            text='Chọn tất'
            onPress={() => selectAllFn && selectAllFn()} />
          <ActionButton
            isDisabled={false}
            text='Bỏ chọn'
            variant='warning'
            onPress={() => unSelectAllFn && unSelectAllFn()} />
          <Divider orientation='vertical' className='mx-2' />
          <ActionButton
            isDisabled={false}
            text={actionText}
            variant={actionVariant}
            onPress={() => actionFn && actionFn()} />
        </View>
        <Text className='text-typography-600 mt-2'>Đã chọn ({number})</Text>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  gradientBackground: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 120, // Điều chỉnh chiều cao gradient
  },
})