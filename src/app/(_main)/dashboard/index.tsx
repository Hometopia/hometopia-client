import { View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import MainContainer from '@/components/container/MainContainer'
import { currencyFormatter } from '@/helpers/currency'
import Bar from '@/components/chart/Bar'
import { useQuery } from '@tanstack/react-query'
import { getYear } from 'date-fns'
import { StatisticService } from '@/api/StatisticService'
import Loading from '@/components/feedback/Loading'
import { barDataItem } from 'react-native-gifted-charts'
import { MonthName, ScheduleType } from '@/constants/data_enum'
import { primaryColor } from '@/constants/color'
import { AssetService } from '@/api/AssetService'
import { CategoryService } from '@/api/CategoryService'
import { AssetResponseType, ScheduleResponseType } from '@/api/types/response'
import { Href, router } from 'expo-router'
import ScheduleListModal from '@/components/custom/ScheduleListModal'
import { ScheduleService } from '@/api/ScheduleService'
import { Icon } from '@/components/ui/icon'
import { ArrowLeftIcon, ArrowRightIcon, ChartColumnBigIcon, ConstructionIcon, WrenchIcon } from 'lucide-react-native'
import { Text } from '@/components/ui/text'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { DEFAULT_PAGE_SIZE } from '@/constants/config'

const backupPredictData = {
  january: 0,
  february: 600 * 1000,
  march: 300 * 1000,
  april: 1000 * 1000,
  may: 900 * 1000,
  june: 400 * 1000,
  july: 0,
  august: 600 * 1000,
  september: 300 * 1000,
  october: 1000 * 1000,
  november: 900 * 1000,
  december: 400 * 1000,
}

export default function Dashboard() {
  const globalValues = useGlobalContext()
  const [total, setTotal] = useState<number>(0)
  const overralStatisticQuery = useQuery({
    queryKey: ['overral-statistic'],
    queryFn: StatisticService.getOverralStatistics
  })
  const maintenanceCostByMonthQuery = useQuery({
    queryKey: ['cost-statistic', 'month', getYear(new Date()), 'MAINTENANCE'],
    queryFn: () => StatisticService.getCostStatisticsByMonth(
      getYear(new Date()).toString(),
      'MAINTENANCE'
    )
  })
  const repairCostByMonthQuery = useQuery({
    queryKey: ['cost-statistic', 'month', getYear(new Date()), 'REPAIR'],
    queryFn: () => StatisticService.getCostStatisticsByMonth(
      getYear(new Date()).toString(),
      'REPAIR'
    )
  })
  // const assetCostByYearQuery = useQuery({
  //   queryKey: ['asset']
  // })

  // const assetListQuery = useQuery({
  //   queryKey: ['assetFullList'],
  //   queryFn: async () => {
  //     const res = await AssetService.getAllAsset()
  //     if (total === 0) {
  //       setTotal(0)
  //       await res.data.items.forEach(async (i: any) => {
  //         const asset = await AssetService.getAsset(i.id)
  //         if (asset) {
  //           setTotal(prev => prev + asset.data.purchasePrice)
  //         }
  //       })
  //     }


  //     return res
  //   }
  // })
  const categoryListQuery = useQuery({
    queryKey: ['categoryList', 1, DEFAULT_PAGE_SIZE, '', ''],
    queryFn: () => CategoryService.getCategoryList(1, DEFAULT_PAGE_SIZE, '', '')
  })

  const TotalOfThings = (
    <View className='flex flex-col p-4 rounded-xl bg-background-400/10'>
      <View className='flex flex-row gap-2 items-end'>
        <Text className='text-md font-bold text-typography-600'>Tổng số tài sản hiện có:</Text>
        {overralStatisticQuery.isFetched &&
          <Text className='text-lg font-bold text-primary-400'>{overralStatisticQuery.data.data.totalAssets}</Text>}

      </View>
      <View className='flex flex-row gap-2 items-end'>
        <Text className='text-md font-bold text-typography-600'>Tổng số danh mục hiện có:</Text>
        {categoryListQuery.isFetched &&
          <Text className='text-lg font-bold text-primary-400'>{categoryListQuery.data.data.totalItems}</Text>}
      </View>
    </View>
  )
  const ValueStatistic = (
    <View className='flex flex-col gap-2 my-4 px-4 py-6 items-center rounded-2xl bg-primary-400/10'>
      <Text className='text-lg text-center text-typography-600'>Tổng giá trị của toàn bộ tài sản</Text>
      <Text className='text-2xl text-primary-400 font-bold'>
        {overralStatisticQuery.isFetched &&
          currencyFormatter().format(overralStatisticQuery.data.data.totalValueOfAllAssets)}
      </Text>
    </View>
  )

  //
  const [selectedMonth, setSelectedMonth] = useState<number>()
  const [selectedYear, setSelectedYear] = useState<number>()
  const [selectedType, setSelectedType] = useState<string>()
  const [showSchedulesModal, setShowSchedulesModal] = useState(false)
  const monthBarData = (data: any) => {
    return Object.entries(data).filter(([label, value]) => label !== 'total')
  }
  const scheduleListQuery = useQuery({
    queryKey: ['schedules', selectedType, selectedMonth, selectedYear],
    queryFn: async () => {
      if (selectedType === undefined || selectedMonth === undefined || selectedYear === undefined)
        return
      return await ScheduleService.getMonthSchedules(selectedType, selectedYear, selectedMonth)
    },
    enabled: showSchedulesModal && (
      selectedType !== undefined && selectedMonth !== undefined && selectedYear !== undefined
    )
  })
  const CostStatistic = (
    <View className='flex flex-col gap-2 my-2'>
      <ScheduleListModal
        showModal={showSchedulesModal}
        setShowModal={setShowSchedulesModal}
        data={scheduleListQuery.isPending ? [] : scheduleListQuery.data.data.items}
        loading={scheduleListQuery.isPending}
      />
      <View className='flex flex-row gap-4'>
        <Icon as={ChartColumnBigIcon} className='text-warning-400 w-8 h-8 items-center' />
        <View className='rounded-lg py-2 px-4 bg-warning-400/10 overflow-hidden'>
          <Text className='text-lg text-warning-600 font-semibold'>Thống kê chi phí</Text>
        </View>
      </View>
      <View className='flex flex-col gap-8'>
        <View className='flex flex-col gap-2'>
          <View className='py-2 flex flex-row gap-2 items-center justify-between border-t border-outline-100'>
            <View className='grow'>
              <View className='my-2 p-2 rounded-lg flex flex-row gap-2 justify-start items-center bg-primary-400/10'>
                <Icon as={ConstructionIcon} size='md' className='text-primary-400' />
                <Text className='text-lg font-semibold text-primary-400'>
                  Chi phí bảo trì trong năm
                </Text>
              </View>
              <Text className='text-md text-typography-800'>
                Tổng: {maintenanceCostByMonthQuery.isPending ? '...' :
                  currencyFormatter().format(maintenanceCostByMonthQuery.data.data.total)}
              </Text>
            </View>
            {/* <TouchableOpacity className='px-4 py-2 rounded-lg bg-primary-400/10'>
              <Text className='text-primary-400'>Xem chi tiết</Text>
            </TouchableOpacity> */}
          </View>
          {maintenanceCostByMonthQuery.isPending ?
            <View className='h-60 flex justify-center items-center'>
              <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
            </View>
            :
            <Bar
              data={monthBarData(maintenanceCostByMonthQuery.data.data).map(([label, value]) => {
                const tranflabel = MonthName[label as keyof typeof MonthName]
                return ({
                  label: tranflabel,
                  value: value,
                } as barDataItem)
              })}
              onItemPress={(item: barDataItem) => {
                setShowSchedulesModal(true)
                setSelectedType(ScheduleType.MAINTENANCE)
                setSelectedMonth(Number(item.label?.replace('T', '')))
                setSelectedYear(getYear(new Date()))
              }}
              theme={globalValues.themeMode === 'dark' ? 'dark' : 'light'}
            />
          }
        </View>
        <View className='flex flex-col gap-2'>
          <View className='py-2 flex flex-row gap-2 items-center justify-between border-t border-outline-100'>
            <View className='grow '>
              <View className='my-2 p-2 rounded-lg flex flex-row gap-2 justify-start items-center bg-primary-400/10'>
                <Icon as={WrenchIcon} size='md' className='text-primary-400' />
                <Text className='text-lg font-semibold text-primary-400'>
                  Chi phí sửa chữa trong năm
                </Text>
              </View>
              <Text className='text-md text-typography-800'>
                Tổng: {repairCostByMonthQuery.isPending ? '...' :
                  currencyFormatter().format(repairCostByMonthQuery.data.data.total)}
              </Text>
            </View>
            {/* <TouchableOpacity className='px-4 py-2 rounded-lg bg-primary-400/10'>
              <Text className='text-primary-400'>Xem chi tiết</Text>
            </TouchableOpacity> */}
          </View>
          {repairCostByMonthQuery.isPending ?
            <View className='h-60 flex justify-center items-center'>
              <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
            </View>
            :
            <Bar
              data={monthBarData(repairCostByMonthQuery.data.data).map(([label, value]) => {
                const tranflabel = MonthName[label as keyof typeof MonthName]
                return ({
                  label: tranflabel,
                  value: value,
                } as barDataItem)
              })}
              onItemPress={(item: barDataItem) => {
                setShowSchedulesModal(true)
                setSelectedType(ScheduleType.REPAIR)
                setSelectedMonth(Number(item.label?.replace('T', '')))
                setSelectedYear(getYear(new Date()))
              }}
              theme={globalValues.themeMode === 'dark' ? 'dark' : 'light'}
            />
          }
        </View>
      </View>
    </View>
  )
  // const PredictCost = (
  //   <View className='flex flex-col gap-2 my-2'>
  //     <Text className='text-lg font-semibold'>Dự báo chi phí</Text>
  //     <Text className='text-md'>Dự báo chi phí bảo trì trong thời gian tới</Text>
  //     <Bar data={Object.entries(backupPredictData).map(([label, value]) => {
  //       const tranflabel = MonthName[label as keyof typeof MonthName]
  //       return ({
  //         label: tranflabel,
  //         value: value,
  //         topLabelComponent: () => (
  //           <Text className='text-lg'>{Number(value) / 1000}</Text>
  //         ),
  //         // frontColor: `rgba(${primaryColor[400].replace(/ /g, ', ')}, 0.4)`
  //       } as barDataItem)
  //     })} />


  //   </View>
  // )
  return (
    <BaseScreenContainer>
      <MainContainer>
        <View className="flex flex-col gap-2 py-4">
          {TotalOfThings}
          {ValueStatistic}
          <View className="flex flex-col gap-2">
            <View className='flex flex-row justify-center items-center gap-2'>
              <Text className='text-md text-typography-800'>Năm hiện tại:</Text>
              <View className='p-4 rounded-xl bg-success-0 shrink'>
                <Text className='font-bold text-success-600'>{getYear(new Date())}</Text>
              </View>
              <TouchableOpacity className='p-4 rounded-xl bg-background-400/10 flex flex-row gap-2'
                onPress={() => router.push(`/(_main)/dashboard/years` as Href)}
              >
                <Text className='text-typography-800'>Xem thêm</Text>
                <Icon className='text-typography-800' as={ArrowRightIcon} />
              </TouchableOpacity>
            </View>
            {CostStatistic}
            {/* {PredictCost} */}
          </View>
        </View>
      </MainContainer>
    </BaseScreenContainer>
  )
}