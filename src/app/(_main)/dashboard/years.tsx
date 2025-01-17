import { View, Text } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'
import MainContainer from '@/components/container/MainContainer'
import { Icon } from '@/components/ui/icon'
import { StarIcon, WrenchIcon } from 'lucide-react-native'
import Bar from '@/components/chart/Bar'
import { MonthName } from '@/constants/data_enum'
import { primaryColor } from '@/constants/color'
import { barDataItem } from 'react-native-gifted-charts'
import { currencyFormatter } from '@/helpers/currency'
import { Divider } from '@/components/ui/divider'
import BackButton from '@/components/custom/BackButton'

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
const backupData: YearReportType[] = [
  {
    year: 2024,
    cost: {
      maintenance: {
        totalCost: 5000000,
        monthly: {
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
      },
      repair: {
        totalCost: 3400000,
        monthly: {
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
      }
    },
    asset: {
      mostBroken: 'TV chính',
      mostSustain: 'Tủ lạnh của bà ngoại'
    }
  },
  {
    year: 2023,
    cost: {
      maintenance: {
        totalCost: 5000000,
        monthly: {
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
      },
      repair: {
        totalCost: 3400000,
        monthly: {
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
      }
    },
    asset: {
      mostBroken: 'TV chính',
      mostSustain: 'Tủ lạnh của bà ngoại'
    }
  }
]

export default function YearDashboard() {

  const YearReport = ({ item }: { item: YearReportType }) => (

    <View className='grow flex flex-col gap-4'>
      <View className='flex flex-row justify-start items-center gap-2'>

        <View className='p-4 rounded-xl bg-primary-200/10 shrink'>
          <Text className='font-bold text-primary-400'>{item.year}</Text>
        </View>
      </View>
      <View className='flex flex-col gap-2 px-4 py-4 rounded-xl border border-outline-100'>
        <View className='flex flex-row gap-2'>
          <Icon as={WrenchIcon} className='text-error-400' />
          <Text className='text-typography-400'>Tài sản hỏng nhiều nhất năm:
            <Text className='text-primary-400'> {item.asset.mostBroken}</Text>
          </Text>
        </View>
        <View className='flex flex-row gap-2'>
          <Icon as={StarIcon} className='text-warning-400' />
          <Text className='text-typography-400'>Tài sản bền nhất năm:
            <Text className='text-primary-400'> {item.asset.mostSustain}</Text>
          </Text>
        </View>
      </View>
      <View className='grow flex flex-col gap-2 my-2'>
        <Text className='text-lg font-semibold'>Chi phí bảo trì trong năm</Text>
        <Text className='text-md text-typography-600'>Tổng:
          <Text className='text-md text-primary-400'> {currencyFormatter().format(item.cost.maintenance.totalCost)}</Text>
        </Text>
        <Bar data={Object.entries(item.cost.maintenance.monthly).map(([label, value]) => {
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
      </View>
      <View className='flex flex-col gap-2 my-2'>
        <Text className='text-lg font-semibold'>Chi phí sửa chữa trong năm</Text>
        <Text className='text-md text-typography-600'>Tổng:
          <Text className='text-md text-primary-400'> {currencyFormatter().format(item.cost.repair.totalCost)}</Text>
        </Text>
        <Bar data={Object.entries(item.cost.repair.monthly).map(([label, value]) => {
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
      </View>
    </View>
  )
  return (
    <BaseScreenContainer>
      <MainContainer>
        <View className="bg-white h-[48px] pt-2 pb-4 flex flex-row justify-between">
          <BackButton backFn={() => {
            router.back()
          }} />
        </View>
        <View className="flex flex-col gap-8 py-4">
          {backupData.map((i: YearReportType) =>
            <YearReport key={i.year} item={i} />
          )}
        </View>
      </MainContainer>
    </BaseScreenContainer>
  )
}