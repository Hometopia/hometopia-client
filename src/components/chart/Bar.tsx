import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { BarChart, barDataItem } from 'react-native-gifted-charts'

type BarChartPropsType = {
  data: barDataItem[],
  onItemPress: Function
}
export default function Bar({
  data, onItemPress
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
        barBorderRadius={4}
        frontColor="lightgray"
        data={data.map((i: barDataItem) => ({ ...i, value: i.value && i.value / 1000 }))}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisLabelSuffix='k'
        yAxisLabelWidth={56}
        onPress={(item: barDataItem) => {
          if (item.value && item.value > 0)
            onItemPress(item)

        }}
      />
    </View>
  )
}