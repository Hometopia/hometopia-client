import { View, Text } from 'react-native'
import React from 'react'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import MainContainer from '@/components/container/MainContainer'
import { Button, ButtonText } from '@/components/ui/button'
import { AuthService } from '@/api/AuthService'
import { router } from 'expo-router'

export default function Setting() {
  return (
    <BaseScreenContainer>
      <MainContainer>
        <Button variant='outline' action='secondary' size='lg'
          onPress={() => {
            AuthService.signOut()
            router.replace('/onboarding')
          }}>
          <ButtonText>Đăng xuất</ButtonText>
        </Button>
      </MainContainer>
    </BaseScreenContainer>
  )
}