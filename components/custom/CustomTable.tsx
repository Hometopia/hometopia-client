import { View, ScrollView } from 'react-native'
import React from 'react'
import { Text } from '../ui/text'

type CustomTablePropsType = {
  width: number,
  children?: React.ReactNode
}
const tableContainerStyle = (width?: number) => width ? `flex flex-row w-[${width}px]` : `flex flex-row w-full`

export const CustomTable = ({
  width, children
}: CustomTablePropsType) => (
  <ScrollView horizontal={true} overScrollMode='never'>
    <View className="rounded-lg overflow-hidden">
      <View className={tableContainerStyle(width)}>
        {children}
      </View>
    </View>
  </ScrollView>
)
export const TableCol = ({
  head, type, data
}: { head: string, type: 'text' | 'element', data: any[] }) => (
  <View className="flex flex-col grow">
    <View className='px-6 py-4 bg-background-50 h-14'>
      <Text className="text-md font-bold text-typography-900">
        {head}
      </Text>
    </View>
    {data.map((i: any, index: number) =>
      <View key={index} className='px-6 py-4 h-24 flex flex-row items-center border-b border-outline-100'>
        {type === 'text' ?
          <Text className="text-md font-normal text-typography-900">
            {i}
          </Text>
          :
          i
        }
      </View>
    )}
  </View>
)


