import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal'
import { CloseIcon, Icon } from '../ui/icon'
import { Button, ButtonIcon, ButtonText } from '../ui/button'
import { ScheduleResponseType } from '@/api/types/response'
import useFormControl from '@/hooks/useFormControl'
import useFormSubmit from '@/hooks/useFormSubmit'
import { Input, InputField, InputSlot } from '../ui/input'
import ControllableInput from './ControllableInput'
import DatePicker from './DatePicker'
import { currencyFormatter, deformatNumber, formatNumber } from '@/helpers/currency'
import { dateToISOString, dateToYYYYMMDD, YYYYMMDDtoLocalDate } from '@/helpers/time'
import { ScheduleType } from '@/api/types/request'
import { FileInfoType } from '@/api/types/common'
import { useFocusEffect } from 'expo-router'
import { CustomTable, TableCol } from './CustomTable'
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from '../ui/table'
import Loading from '../feedback/Loading'

export default function ScheduleListModal(
  {
    showModal,
    setShowModal,
    data,
    loading = false
  }: {
    showModal: boolean,
    setShowModal: Function,
    data: ScheduleResponseType[],
    loading?: boolean
  }
) {

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false)
      }}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-typography-900 text-lg font-medium">
            Lịch sử
          </Text>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="lg"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ScrollView className='h-80' overScrollMode='never' horizontal >
          <View className=' flex flex-col gap-4 my-4'>
            <Table className='w-[500px] rounded-lg overflow-hidden'>
              <TableHeader>
                <TableRow className="bg-background-100">
                  <TableHead>Tài sản</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Chi phí</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.filter(i => i.cost).map(i => (
                  <TableRow key={i.id}>
                    <TableData>{i.asset.name}</TableData>
                    <TableData>{YYYYMMDDtoLocalDate(dateToYYYYMMDD(new Date(i.start)))}</TableData>
                    <TableData>{currencyFormatter().format(i.cost)}</TableData>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </View>
        </ScrollView>
      </ModalContent>
    </Modal>
  )
}