import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { Table, TableBody, TableData, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function AssetDepreciation() {
  return (
    <SafeAreaView className='h-full bg-white'>
      <ScrollView className="flex flex-col my-4 px-4 gap-4 ">
        <View>
          <Text className="p-0 pb-1 text-base font-medium text-typography-400 align-top">Giá trị hiện tại:</Text>
          <Text className="p-0 pb-3 text-lg font-medium text-primary-400">11.000.000 VND</Text>
        </View>
        <View>
          <Text className="p-0 pb-1 text-base font-medium text-typography-400 align-top">Năm hiện tại:</Text>
          <Text className="p-0 pb-3 text-lg text-typography-900">1</Text>
        </View>
        <View>
          <Text className="p-0 pb-1 text-base font-medium text-typography-400 align-top">Giá mua:</Text>
          <Text className="p-0 pb-3 text-lg text-typography-900">12.000.000 VND</Text>
        </View>
        <View>
          <Text className="p-0 pb-1 text-base font-medium text-typography-400 align-top">Thời gian khấu hao:</Text>
          <Text className="p-0 pb-3 text-lg text-typography-900">10 năm</Text>
        </View>
        <Table className='w-full rounded-lg overflow-hidden'>
          <TableHeader>
            <TableRow className="bg-background-100">
              <TableHead>Giá trị</TableHead>
              <TableHead>Năm thứ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableData>12.000.000 VND</TableData>
              <TableData>0</TableData>
            </TableRow>
            <TableRow>
              <TableData>11.000.000 VND</TableData>
              <TableData>1</TableData>
            </TableRow>
          </TableBody>
        </Table>
      </ScrollView>
    </SafeAreaView>
  )
}