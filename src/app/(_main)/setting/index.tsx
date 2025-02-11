import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native'
import React from 'react'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import MainContainer from '@/components/container/MainContainer'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { AuthService } from '@/api/AuthService'
import { router } from 'expo-router'
import { LogOutIcon, MoonIcon, SmartphoneIcon, SunDimIcon, SunIcon } from 'lucide-react-native'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { Icon } from '@/components/ui/icon'
import { useQueryClient } from '@tanstack/react-query'

const SettingItem = ({
  label = 'Label', input
}: {
  label: string,
  input: JSX.Element | null
}) => {
  return (
    <View className='py-4 flex flex-col border-b border-outline-50'>
      <Text className='px-4 pb-4 text-lg text-typography-600 uppercase'>
        {label}
      </Text>
      {input}
    </View>
  )
}

//
const ColorModeInput = ({
  mode, onChange
}: {
  mode: "light" | "dark" | "system",
  onChange: Function
}) => {
  const ColorModeItem = ({
    value, label, onChange
  }: {
    value: "light" | "dark" | "system",
    label: string,
    onChange: Function
  }) => (
    <TouchableOpacity
      className={mode !== value ?
        'px-4 py-2 rounded-md bg-background-50 grow flex flex-row justify-center gap-2' :
        'px-4 py-2 rounded-md bg-primary-400/10 grow flex flex-row justify-center gap-2'}
      onPress={() => onChange()}
    >
      <Icon
        className={mode === value ? 'text-primary-400' : 'text-typography-400'}
        as={value === 'system' ? SmartphoneIcon : value === 'light' ? SunIcon : MoonIcon}
        size='md' />
      <Text className={mode !== value ?
        'text-typography-400' :
        'text-primary-400'
      }>
        {label}
      </Text>
    </TouchableOpacity>
  )
  return (
    <View className='flex flex-row gap-2 rounded-2xl overflow-hidden'>
      {/* <ColorModeItem value={"system"} label="Thiết bị" onChange={() => onChange("system")} /> */}
      <ColorModeItem value={"light"} label="Sáng" onChange={() => onChange("light")} />
      <ColorModeItem value={"dark"} label="Tối" onChange={() => onChange("dark")} />
    </View>
  )
}

export default function Setting() {
  const globalValues = useGlobalContext()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    AuthService.signOut()
    queryClient.clear()
    router.replace('/onboarding')
  }
  return (
    <BaseScreenContainer>
      <MainContainer>
        <View className='flex flex-col gap-4'>
          <View className='flex flex-col gap-4'>
            <SettingItem
              label='hiển thị'
              input={
                <ColorModeInput mode={globalValues.themeMode} onChange={globalValues.setAppThemeMode} />
              }
            />
          </View>
          <Button className='rounded-lg' variant='outline' action='secondary' size='lg'
            onPress={handleLogout}>
            <ButtonIcon as={LogOutIcon} />
            <ButtonText>Đăng xuất</ButtonText>
          </Button>
        </View>

      </MainContainer>
    </BaseScreenContainer>
  )
}