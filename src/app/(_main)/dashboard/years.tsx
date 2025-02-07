import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import MainContainer from '@/components/container/MainContainer'
import { Icon } from '@/components/ui/icon'
import { StarIcon, WrenchIcon } from 'lucide-react-native'
import Bar from '@/components/chart/Bar'
import { MonthName, ScheduleType } from '@/constants/data_enum'
import { primaryColor } from '@/constants/color'
import { barDataItem } from 'react-native-gifted-charts'
import { currencyFormatter } from '@/helpers/currency'
import { Divider } from '@/components/ui/divider'
import BackButton from '@/components/custom/BackButton'
import { useQuery } from '@tanstack/react-query'
import { getYear } from 'date-fns'
import { StatisticService } from '@/api/StatisticService'
import Loading from '@/components/feedback/Loading'
import { ScheduleService } from '@/api/ScheduleService'
import ScheduleListModal from '@/components/custom/ScheduleListModal'

type YearReportType = {
  year: number,
  cost: {
    maintenance: {
      totalCost: number,
      monthly: {
        january: number,
        february: number,
        march: number,
        april: number,
        may: number,
        june: number,
        july: number,
        august: number,
        september: number,
        october: number,
        november: number,
        december: number,
      }
    },
    repair: {
      totalCost: number,
      monthly: {
        january: number,
        february: number,
        march: number,
        april: number,
        may: number,
        june: number,
        july: number,
        august: number,
        september: number,
        october: number,
        november: number,
        december: number,
      }
    }
  },
  asset: {
    mostBroken: string,
    mostSustain: string
  }
}


export default function YearDashboard() {
  const maintenanceCostByMonthQuery = useQuery({
    queryKey: ['cost-statistic', 'month', getYear(new Date()) - 1, 'MAINTENANCE'],
    queryFn: () => StatisticService.getCostStatisticsByMonth(
      (getYear(new Date()) - 1).toString(),
      'MAINTENANCE'
    )
  })
  const repairCostByMonthQuery = useQuery({
    queryKey: ['cost-statistic', 'month', getYear(new Date()) - 1, 'REPAIR'],
    queryFn: () => StatisticService.getCostStatisticsByMonth(
      (getYear(new Date()) - 1).toString(),
      'REPAIR'
    )
  })
  const assetCostByYearQuery = useQuery({
    queryKey: ['asset-statistic', getYear(new Date()) - 1],
    queryFn: () => StatisticService.getAssetStatisticsByYear((getYear(new Date()) - 1).toString())
  })

  const monthBarData = (data: any) => {
    return Object.entries(data).filter(([label, value]) => label !== 'total')
  }
  // const YearReport = ({ item }: { item: YearReportType }) => (

  //   <View className='grow flex flex-col gap-4'>
  //     <View className='flex flex-row justify-start items-center gap-2'>
  //       <View className='p-4 rounded-xl bg-primary-200/10 shrink'>
  //         <Text className='font-bold text-primary-400'>{item.year}</Text>
  //       </View>
  //     </View>
  //     <View className='flex flex-col gap-2 px-4 py-4 rounded-xl border border-outline-100'>
  //       <View className='flex flex-row gap-2'>
  //         <Icon as={WrenchIcon} className='text-error-400' />
  //         <Text className='text-typography-400'>Tài sản hỏng nhiều nhất năm:
  //           <Text className='text-primary-400'> {item.asset.mostBroken}</Text>
  //         </Text>
  //       </View>
  //       <View className='flex flex-row gap-2'>
  //         <Icon as={StarIcon} className='text-warning-400' />
  //         <Text className='text-typography-400'>Tài sản bền nhất năm:
  //           <Text className='text-primary-400'> {item.asset.mostSustain}</Text>
  //         </Text>
  //       </View>
  //     </View>
  //     <View className='grow flex flex-col gap-2 my-2'>
  //       <Text className='text-lg font-semibold'>Chi phí bảo trì trong năm</Text>
  //       <Text className='text-md text-typography-600'>Tổng:
  //         <Text className='text-md text-primary-400'>
  //           {maintenanceCostByMonthQuery.isPending ? '...' :
  //             currencyFormatter().format(item.cost.maintenance.totalCost)}
  //         </Text>
  //       </Text>
  //       {maintenanceCostByMonthQuery.isPending ?
  //         <View className='h-60 flex justify-center items-center'>
  //           <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
  //         </View>
  //         :
  //         <Bar data={monthBarData(maintenanceCostByMonthQuery.data.data).map(([label, value]) => {
  //           const tranflabel = MonthName[label as keyof typeof MonthName]
  //           return ({
  //             label: tranflabel,
  //             value: value,
  //             topLabelComponent: () => (
  //               <Text className='text-lg'>{Number(value) / 1000}</Text>
  //             ),
  //             frontColor: `rgba(${primaryColor[400].replace(/ /g, ', ')}, 0.4)`
  //           } as barDataItem)
  //         })} />
  //       }
  //     </View>
  //     <View className='flex flex-col gap-2 my-2'>
  //       <Text className='text-lg font-semibold'>Chi phí sửa chữa trong năm</Text>
  //       <Text className='text-md text-typography-600'>Tổng:
  //         <Text className='text-md text-primary-400'> {currencyFormatter().format(item.cost.repair.totalCost)}</Text>
  //       </Text>
  //       <Bar data={Object.entries(item.cost.repair.monthly).map(([label, value]) => {
  //         const tranflabel = MonthName[label as keyof typeof MonthName]
  //         return ({
  //           label: tranflabel,
  //           value: value,
  //           topLabelComponent: () => (
  //             <Text className='text-lg'>{Number(value) / 1000}</Text>
  //           ),
  //           frontColor: `rgba(${primaryColor[400].replace(/ /g, ', ')}, 0.4)`
  //         } as barDataItem)
  //       })} />
  //     </View>
  //   </View>
  // )
  //
  const [selectedMonth, setSelectedMonth] = useState<number>()
  const [selectedYear, setSelectedYear] = useState<number>()
  const [selectedType, setSelectedType] = useState<string>()
  const [showSchedulesModal, setShowSchedulesModal] = useState(false)

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
  return (
    <BaseScreenContainer>
      <MainContainer>
        <View className="bg-white h-[48px] pt-2 pb-4 flex flex-row justify-between">
          <BackButton backFn={() => {
            router.back()
          }} />
        </View>
        <View className="flex flex-col gap-8 py-4">
          <View className='grow flex flex-col gap-4'>
            <View className='flex flex-row justify-start items-center gap-2'>
              <View className='p-4 rounded-xl bg-primary-200/10 shrink'>
                <Text className='font-bold text-primary-400'>{getYear(new Date()) - 1}</Text>
              </View>
            </View>
            {assetCostByYearQuery.isPending ?
              <View className='h-60 flex justify-center items-center'>
                <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
              </View>
              :
              <View className='flex flex-col gap-2 px-4 py-4 rounded-xl border border-outline-100'>
                <View className='flex flex-row gap-2'>
                  <Icon as={WrenchIcon} className='text-error-400' />
                  <Text className='text-typography-400'>Tài sản hỏng nhiều nhất năm:
                    <Text className='text-primary-400'>
                      {assetCostByYearQuery.data.data.mostBroken.name}</Text>
                  </Text>
                </View>
                <View className='flex flex-row gap-2'>
                  <Icon as={StarIcon} className='text-warning-400' />
                  <Text className='text-typography-400'>Tài sản bền nhất năm:
                    <Text className='text-primary-400'>
                      {assetCostByYearQuery.data.data.mostDurable.name}</Text>
                  </Text>
                </View>
              </View>
            }
            <View className='grow flex flex-col gap-2 my-2'>
              <ScheduleListModal
                showModal={showSchedulesModal}
                setShowModal={setShowSchedulesModal}
                data={scheduleListQuery.isPending ? [] : scheduleListQuery.data.data.items}
                loading={scheduleListQuery.isPending}
              />
              <Text className='text-lg font-semibold'>Chi phí bảo trì trong năm</Text>
              <View className='flex flex-row gap-2'>
                <Text className='text-md text-typography-600'>Tổng:</Text>
                <Text className='text-md text-primary-400'>
                  {maintenanceCostByMonthQuery.isPending ? '...' :
                    currencyFormatter().format(maintenanceCostByMonthQuery.data.data.total)
                  }
                </Text>
              </View>

              {maintenanceCostByMonthQuery.isPending ?
                <View className='h-60 flex justify-center items-center'>
                  <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
                </View>
                :
                <Bar data={monthBarData(maintenanceCostByMonthQuery.data.data).map(([label, value]) => {
                  const tranflabel = MonthName[label as keyof typeof MonthName]
                  return ({
                    label: tranflabel,
                    value: value,
                    topLabelComponent: () => (
                      <Text className='text-lg'>{Number(value) / 1000}</Text>
                    ),
                    frontColor: `rgba(${primaryColor[400].replace(/ /g, ', ')}, 0.4)`
                  } as barDataItem)
                })}
                  onItemPress={(item: barDataItem) => {
                    setShowSchedulesModal(true)
                    setSelectedType(ScheduleType.MAINTENANCE)
                    setSelectedMonth(Number(item.label?.replace('T', '')))
                    setSelectedYear(getYear(new Date()) - 1)
                  }}
                />
              }
            </View>
            <View className='flex flex-col gap-2 my-2'>
              <Text className='text-lg font-semibold'>Chi phí sửa chữa trong năm</Text>
              <View className='flex flex-row gap-2'>
                <Text className='text-md text-typography-600'>Tổng:</Text>
                <Text className='text-md text-primary-400'>
                  {repairCostByMonthQuery.isPending ? '...' :
                    currencyFormatter().format(repairCostByMonthQuery.data.data.total)
                  }
                </Text>
              </View>
              {repairCostByMonthQuery.isPending ?
                <View className='h-60 flex justify-center items-center'>
                  <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
                </View>
                :
                <Bar data={monthBarData(repairCostByMonthQuery.data.data).map(([label, value]) => {
                  const tranflabel = MonthName[label as keyof typeof MonthName]
                  return ({
                    label: tranflabel,
                    value: value,
                    topLabelComponent: () => (
                      <Text className='text-lg'>{Number(value) / 1000}</Text>
                    ),
                    frontColor: `rgba(${primaryColor[400].replace(/ /g, ', ')}, 0.4)`
                  } as barDataItem)
                })}
                  onItemPress={(item: barDataItem) => {
                    setShowSchedulesModal(true)
                    setSelectedType(ScheduleType.REPAIR)
                    setSelectedMonth(Number(item.label?.replace('T', '')))
                    setSelectedYear(getYear(new Date()) - 1)
                  }}
                />}
            </View>
          </View>
        </View>
      </MainContainer>
    </BaseScreenContainer>
  )
}