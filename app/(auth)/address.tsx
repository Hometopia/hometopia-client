import { SafeAreaView, View } from 'react-native'
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectFlatList,
  SelectScrollView,
} from "@/components/ui/select";
import { AlertCircleIcon, ChevronDownIcon } from "lucide-react-native";
import LogoFull from '@/components/custom/LogoFull';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { AddressService } from '@/api/AddressService';
import { Spinner } from '@/components/ui/spinner';
import React, { useEffect } from 'react'
import useFormControl from '@/hooks/useFormControl';
import useFormSubmit from '@/hooks/useFormSubmit';
import { AuthService } from '@/api/AuthService';
import { LoginForm, RegisterForm } from '@/api/types/request';

type AddressItemType = { code: number, name: string }

const AddressSectionSelect = ({
  items,
  placeholder,
}: {
  items: { code: number, name: string }[],
  placeholder: string
}) => (
  <Select>
    <SelectTrigger variant="outline" size="lg" className='flex flex-row justify-between'>
      <SelectInput placeholder={placeholder} />
      <SelectIcon className="mr-3" as={ChevronDownIcon} />
    </SelectTrigger>
    <SelectPortal>
      <SelectBackdrop />
      <SelectContent>
        <SelectDragIndicatorWrapper >
          <SelectDragIndicator />
        </SelectDragIndicatorWrapper>
        {/* {items.map((item) => (
          <SelectItem
            className='text-typography-900'
            key={item.code}
            label={item.name}
            value={item.code.toString()} />
        ))} */}
        {/* <SelectFlatList
          className='h-56'
          data={items}
          renderItem={({ item }) => <SelectItem
            className='text-typography-900'
            key={item.code}
            label={item.name}
            value={item.code.toString()} />}

        /> */}
      </SelectContent>

    </SelectPortal>
  </Select>
);

export default function Address() {

  const { firstName, lastName, email, password } = useLocalSearchParams()


  const provinceControl = useFormControl("", (value): boolean => {
    return (value === '') ? false : true
  })
  const districtControl = useFormControl("", (value): boolean => {
    return (value === '') ? false : true
  })
  const wardControl = useFormControl("", (value): boolean => {
    return (value === '') ? false : true
  })
  const lineControl = useFormControl("", (value): boolean => {
    return (value === '') ? false : true
  })

  useEffect(() => {
    districtControl.onChange("")
    wardControl.onChange("")
  }, [provinceControl.value])

  useEffect(() => {
    wardControl.onChange("")
  }, [districtControl.value])

  const provincesQuery = useQuery({
    queryKey: ['provinces'],
    queryFn: AddressService.getProvinceList,
  })

  const districtsQuery = useQuery({
    queryKey: ['districts', provinceControl.value],
    queryFn: () => {
      if (provinceControl.value !== '') {
        return AddressService.getDistrictList(provinceControl.value)
      }
    },
    enabled: (provinceControl.value !== "") ? true : false,
  })

  const wardsQuery = useQuery({
    queryKey: ['wards', districtControl.value],
    queryFn: () => {
      if (districtControl.value !== '') {
        return AddressService.getWardList(districtControl.value)
      }
    },
    enabled: (districtControl.value !== "") ? true : false,
  })


  const handleNavigateToSignIn = () => {
    router.navigate('/(auth)/sign-in')
  }
  const validateAll = () => {
    provinceControl.validate()
    districtControl.validate()
    wardControl.validate()
    lineControl.validate()
  }
  const submit = async () => {
    if (
      provinceControl.isValid &&
      districtControl.isValid &&
      wardControl.isValid &&
      lineControl.isValid
    ) {

      let res = await AuthService.signUp({
        "username": email,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password,
        "address": {
          "line": lineControl.value,
          "provinceId": Number(provinceControl.value),
          "districtId": Number(districtControl.value),
          "wardId": Number(wardControl.value)
        }
      } as RegisterForm)

      if (res.status == 201) {
        let isLogin = await AuthService.signIn({
          username: email,
          password: password,
        } as LoginForm)

        if (isLogin) {
          router.replace('/')
        }
        else {

        }
      }
    }
  }

  const { handleSubmit } = useFormSubmit(validateAll, submit)
  return (
    <SafeAreaView className="h-full bg-white">
      <View className="h-full flex flex-col items-center justify-center">
        {(provincesQuery.isPending) ?
          <Spinner /> :
          <VStack className="flex w-96 flex-col justify-center gap-12">
            <VStack className="gap-4">
              <Text className="text-center text-3xl font-bold text-typography-900">
                Địa chỉ
              </Text>
              <Text className="text-center text-lg font-normal text-typography-500">
                Cho chúng tôi biết địa chỉ của bạn. Điều này sẽ giúp chúng tôi có thể
                tìm kiếm các dịch vụ gần nơi bạn ở.
              </Text>
            </VStack>

            <VStack className="z-10 gap-8">
              <VStack className="z-10 gap-4">
                <FormControl className="z-auto" isInvalid={!provinceControl.isValid}>
                  <FormControlLabel>
                    <FormControlLabelText className="text-md text-typography-500">
                      Tỉnh / Thành phố
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Select
                    onValueChange={(v) => provinceControl.onChange(v)}
                    selectedValue={provinceControl.value}
                  >
                    <SelectTrigger variant="outline" size="lg" className='flex flex-row justify-between'>
                      <SelectInput placeholder="Tỉnh / Thành phố" />
                      <SelectIcon className="mr-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper >
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>

                        <SelectScrollView style={{ height: 600 }}>
                          {provincesQuery.data.items.map((item: AddressItemType) => (
                            <SelectItem
                              className='text-typography-900'
                              key={item.code}
                              label={item.name}
                              value={item.code.toString()} />
                          ))}
                        </SelectScrollView>
                      </SelectContent>

                    </SelectPortal>
                  </Select>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                      Không thể trống
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
                <FormControl className="z-auto" isInvalid={!districtControl.isValid}>
                  <FormControlLabel>
                    <FormControlLabelText className="text-md text-typography-500">
                      Quận / Huyện
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Select
                    onValueChange={(v) => districtControl.onChange(v)}
                    selectedValue={districtControl.value}
                  >
                    <SelectTrigger variant="outline" size="lg" className='flex flex-row justify-between'>
                      <SelectInput
                        placeholder="Quận / Huyện"
                        value={
                          (districtsQuery.data !== undefined) ?
                            districtsQuery.data.items.find((i: { code: number, name: string }) => i.code.toString() === districtControl.value)?.name :
                            ""
                        } />
                      <SelectIcon className="mr-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper >
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>

                        <SelectScrollView style={{ height: 600 }}>
                          {districtsQuery.data?.items.map((item: AddressItemType) => (
                            <SelectItem
                              className='text-typography-900'
                              key={item.code}
                              label={item.name}
                              value={item.code.toString()} />
                          ))}
                        </SelectScrollView>
                      </SelectContent>

                    </SelectPortal>
                  </Select>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                      Không thể trống
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
                <FormControl className="z-auto" isInvalid={!wardControl.isValid}>
                  <FormControlLabel>
                    <FormControlLabelText className="text-md text-typography-500">
                      Phường / Xã
                    </FormControlLabelText>
                  </FormControlLabel>

                  <Select
                    onValueChange={(v) => wardControl.onChange(v)}
                    selectedValue={wardControl.value}
                  >
                    <SelectTrigger variant="outline" size="lg" className='flex flex-row justify-between'>
                      <SelectInput
                        placeholder="Phường / Xã"
                        value={
                          (wardsQuery.data !== undefined) ?
                            wardsQuery.data.items.find((i: { code: number, name: string }) => i.code.toString() === wardControl.value)?.name :
                            ""
                        } />
                      <SelectIcon className="mr-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper >
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>

                        <SelectScrollView style={{ height: 600 }}>
                          {wardsQuery.data?.items.map((item: AddressItemType) => (
                            <SelectItem
                              className='text-typography-900'
                              key={item.code}
                              label={item.name}
                              value={item.code.toString()} />
                          ))}
                        </SelectScrollView>
                      </SelectContent>

                    </SelectPortal>
                  </Select>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                      Không thể trống
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
                <FormControl className="z-auto" isInvalid={!lineControl.isValid}>
                  <FormControlLabel>
                    <FormControlLabelText className="text-md text-typography-500">
                      Địa chỉ
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input size='lg'>
                    <InputField
                      type="text"
                      placeholder="số nhà, tên đường, ấp ..."
                      value={lineControl.value}
                      onChangeText={lineControl.onChange}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                      Không thể trống
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              </VStack>
              <Button size="lg" onPress={handleSubmit}>
                <ButtonText>Hoàn thành</ButtonText>
              </Button>
            </VStack>

            <VStack className="items-center">
              <HStack className="items-center gap-4">
                <Text className="text-md text-typography-500">Đã có tài khoản ?</Text>
                <Button className="w-fit" variant="link" size="xs" onPress={handleNavigateToSignIn}>
                  <ButtonText className="text-md text-primary-500">
                    Đăng nhập ngay
                  </ButtonText>
                </Button>
              </HStack>
            </VStack>
          </VStack>}

      </View>
    </SafeAreaView >
  )
}