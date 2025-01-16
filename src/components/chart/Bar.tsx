import { View, Text } from 'react-native'
import React from 'react'
import { BarChart, barDataItem } from 'react-native-gifted-charts'

type BarChartPropsType = {
  data: barDataItem[]
}
export default function Bar({
  data
}: BarChartPropsType) {
  const maxValue = () => {
    let max = data[0].value ? data[0].value : 0
    data.forEach(i => {
      if (i.value) {
        if ((i.value > max)) max = i.value
      }
    })
    return (max * 1.2) / 1000
  }
  return (
    <View>
      <BarChart
        maxValue={maxValue()}
        barWidth={32}
        noOfSections={5}
        barBorderRadius={4}
        frontColor="lightgray"
        data={data.map((i: barDataItem) => ({ ...i, value: i.value && i.value / 1000 }))}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisLabelSuffix='k'
      />
    </View>
  )
}