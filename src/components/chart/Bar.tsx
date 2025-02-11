import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { BarChart, barDataItem } from 'react-native-gifted-charts'
import { primaryColor } from '@/constants/color'

type BarChartPropsType = {
  data: barDataItem[],
  onItemPress: Function,
  theme?: 'light' | 'dark'
}
export default function Bar({
  data, onItemPress, theme = 'light'
}: BarChartPropsType) {
  const maxValue = () => {
    let max = data[0].value ? data[0].value : 0
    data.forEach(i => {
      if (i.value) {
        if ((i.value > max)) max = i.value
      }
    })
    return (max * 2) / 1000
  }
  return (
    <View>
      {/* <ScheduleListModal /> */}
      <BarChart
        maxValue={maxValue()}
        barWidth={48}
        noOfSections={5}
        barBorderRadius={8}
        frontColor={`rgba(${primaryColor[400].replace(/ /g, ', ')}, 0.8)`}
        data={data.map((i: barDataItem) => (
          {
            ...i,
            value: i.value && i.value / 1000,
            topLabelComponent: () => (
              <Text className='text-lg text-typography-800'>{Number(i.value) / 1000}</Text>
            ),
            labelTextStyle: {
              color: theme === 'dark' ?
                `rgba(255, 255, 255, 0.8)` : `rgba(0, 0, 0, 0.8)`
            },
          }
        ))}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisLabelSuffix='k'
        yAxisLabelWidth={56}
        yAxisTextStyle={{
          color: theme === 'dark' ?
            `rgba(255, 255, 255, 0.8)` : `rgba(0, 0, 0, 0.8)`
        }}
        onPress={(item: barDataItem) => {
          if (item.value && item.value > 0)
            onItemPress(item)

        }}
      // isAnimated
      />
    </View>
  )
}