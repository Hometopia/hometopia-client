import { View } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import MainContainer from '@/components/container/MainContainer'
import { Icon } from '@/components/ui/icon'
import { ConstructionIcon, StarIcon, WrenchIcon } from 'lucide-react-native'
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
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { Text } from '@/components/ui/text'

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
const monthBarData = (data: any) => {
  return Object.entries(data).filter(([label, value]) => label !== 'total')
}
const YearReport = ({
  year, theme, onBarItemPress
}: {
  year: number,
  theme: 'dark' | 'light',
  onBarItemPress: Function
}) => {

  const assetCostByYearQuery = useQuery({
    queryKey: ['asset-statistic', year],
    queryFn: () => StatisticService.getAssetStatisticsByYear(year.toString())
  })
  const maintenanceCostByMonthQuery = useQuery({
    queryKey: ['cost-statistic', 'month', year, 'MAINTENANCE'],
    queryFn: () => StatisticService.getCostStatisticsByMonth(
      year.toString(),
      'MAINTENANCE'
    )
  })
  const repairCostByMonthQuery = useQuery({
    queryKey: ['cost-statistic', 'month', year, 'REPAIR'],
    queryFn: () => StatisticService.getCostStatisticsByMonth(
      year.toString(),
      'REPAIR'
    )
  })

  const MaintenanceStatistic = (
    <View className='grow flex flex-col gap-2 my-2'>
      <View className='my-2 p-2 rounded-lg flex flex-row gap-2 justify-start items-center bg-primary-400/10'>
        <Icon as={ConstructionIcon} size='md' className='text-primary-400' />
        <Text className='text-lg font-semibold text-primary-400'>
          Chi phí bảo trì trong năm
        </Text>
      </View>
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
        <Bar
          data={monthBarData(maintenanceCostByMonthQuery.data.data).map(([label, value]) => {
            const tranflabel = MonthName[label as keyof typeof MonthName]
            return ({
              label: tranflabel,
              value: value,
            } as barDataItem)
          })}
          onItemPress={(item: barDataItem) => {
            onBarItemPress(item, ScheduleType.MAINTENANCE)
          }}
          theme={theme}
        />
      }
    </View>
  )
  const RepairStatistic = (
    <View className='flex flex-col gap-2 my-2'>
      <View className='my-2 p-2 rounded-lg flex flex-row gap-2 justify-start items-center bg-primary-400/10'>
        <Icon as={WrenchIcon} size='md' className='text-primary-400' />
        <Text className='text-lg font-semibold text-primary-400'>
          Chi phí sửa chữa trong năm
        </Text>
      </View>
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
        <Bar
          data={monthBarData(repairCostByMonthQuery.data.data).map(([label, value]) => {
            const tranflabel = MonthName[label as keyof typeof MonthName]
            return ({
              label: tranflabel,
              value: value,
            } as barDataItem)
          })}
          onItemPress={(item: barDataItem) => {
            onBarItemPress(item, ScheduleType.REPAIR)
          }}
          theme={theme}
        />}
    </View>
  )
  return (
    <View className="flex flex-col gap-8 py-4">
      <View className='grow flex flex-col gap-4'>
        <View className='flex flex-row justify-center items-center gap-2'>
          <View className='p-4 rounded-xl bg-primary-200/10 shrink'>
            <Text className='font-bold text-primary-400'>{year}</Text>
          </View>
        </View>
        {assetCostByYearQuery.isPending ?
          <View className='h-60 flex justify-center items-center'>
            <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
          </View>
          :
          assetCostByYearQuery.data.data.mostDurable === null ?
            <View className='h-40 flex flex-row justify-center items-center'>
              <Text className='text-typography-600'>Trống</Text>
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
        {assetCostByYearQuery.isFetched && assetCostByYearQuery.data.data.mostDurable !== null &&
          <View className='flex flex-col gap-4'>
            {MaintenanceStatistic}
            {RepairStatistic}
          </View>
        }
      </View>
    </View>
  )
}

const YearSpread = () => (
  <View className='flex flex-col gap-4 justify-center items-center my-4'>
    <View className='h-3 w-3 rounded-full bg-background-800' />
    <View className='h-2 w-2 rounded-full bg-background-800' />
    <View className='h-1 w-1 rounded-full bg-background-800' />
  </View>
)

const currentYear = getYear(new Date())
const years = [currentYear - 1, currentYear - 2, currentYear - 3]
export default function YearDashboard() {
  const globalValues = useGlobalContext()


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
        <View className="py-4 flex flex-row justify-between items-center">
          <BackButton backFn={() => {
            router.back()
          }} />
          <Text className='text-typography-800'>3 năm gần nhất</Text>
        </View>
        {years.map((i, index) => (
          <View key={i}>
            <YearReport
              theme={globalValues.themeMode === 'dark' ? 'dark' : 'light'}
              year={i}
              onBarItemPress={(item: barDataItem, type: string) => {
                setShowSchedulesModal(true)
                setSelectedType(type)
                setSelectedMonth(Number(item.label?.replace('T', '')))
                setSelectedYear(i)
              }}
            />
            {index < years.length - 1 && <YearSpread />}

          </View>
        ))}
        <ScheduleListModal
          showModal={showSchedulesModal}
          setShowModal={setShowSchedulesModal}
          data={scheduleListQuery.isPending ? [] : scheduleListQuery.data.data.items}
          loading={scheduleListQuery.isPending}
        />

      </MainContainer>
    </BaseScreenContainer>
  )
}