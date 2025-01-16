import { View, Text } from 'react-native'
import React from 'react'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import MainContainer from '@/components/container/MainContainer'
import { currencyFormatter } from '@/helpers/currency'
import Bar from '@/components/chart/Bar'
import { useQuery } from '@tanstack/react-query'
import { getYear } from 'date-fns'
import { StatisticService } from '@/api/StatisticService'
import Loading from '@/components/feedback/Loading'
import { barDataItem } from 'react-native-gifted-charts'
import { MonthName } from '@/constants/data_enum'
import { primaryColor } from '@/constants/color'

export default function Dashboard() {
  const costByMonthQuery = useQuery({
    queryKey: ['cost-statistic', 'month', getYear(new Date())],
    queryFn: () => StatisticService.getCostStatisticsByMonth(getYear(new Date()).toString())
  })

  const TotalOfThings = (
    <View className='flex flex-col p-4 rounded-xl bg-background-400/10'>
      <View className='flex flex-row gap-2 items-end'>
        <Text className='text-md font-bold text-typography-600'>Tổng số tài sản hiện có:</Text>
        <Text className='text-lg font-bold text-primary-400'>12</Text>
      </View>
      <View className='flex flex-row gap-2 items-end'>
        <Text className='text-md font-bold text-typography-600'>Tổng số danh mục hiện có:</Text>
        <Text className='text-lg font-bold text-primary-400'>68</Text>
      </View>
    </View>
  )
  const ValueStatistic = (
    <View className='flex flex-col gap-2 my-4 px-4 py-6 items-center rounded-2xl bg-primary-400/10'>
      <Text className='text-lg text-center text-typography-600'>Tổng giá trị của toàn bộ tài sản</Text>
      <Text className='text-2xl text-primary-400 font-bold'>{currencyFormatter().format(122300000)}</Text>
    </View>
  )
  const CostStatistic = (
    <View className='flex flex-col gap-2'>
      <Text className='text-lg font-semibold'>Thống kê chi phí</Text>
      <Text className='text-md'>Thống kê chi phí bảo trì/ sửa chữa trong năm</Text>
      {costByMonthQuery.isPending ?
        <View className='h-60 flex justify-center items-center'>
          <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
        </View>
        :
        <Bar data={Object.entries(costByMonthQuery.data.data).map(([label, value]) => {
          const tranflabel = MonthName[label as keyof typeof MonthName]
          return ({
            label: tranflabel,
            value: value,
            topLabelComponent: () => (
              <Text className='text-lg'>{Number(value) / 1000}</Text>
            ),
            frontColor: `rgba(${primaryColor[400].replace(/ /g, ', ')}, 0.4)`
          } as barDataItem)
        })} />
      }

    </View>
  )
  return (
    <BaseScreenContainer>
      <MainContainer>
        {TotalOfThings}
        {ValueStatistic}
        {CostStatistic}
      </MainContainer>
    </BaseScreenContainer>
  )
}