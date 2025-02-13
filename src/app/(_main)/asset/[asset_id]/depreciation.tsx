import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { Table, TableBody, TableData, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLocalSearchParams } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AssetResponseType, DepreciationItemType, ResponseBaseType } from '@/api/types/response'
import { currencyFormatter } from '@/helpers/currency'
import { calcYearAmount } from '@/helpers/time'
import { calcCurrentValue, getDepreciationTable } from '@/helpers/linear-depreciation'
import AssetInfoDisplay from '@/components/custom/AssetInfoDisplay'
import { ClassificationService } from '@/api/ClassificationService'
import { DepreciationTableItem } from "@/constants/types"
import { RuleService } from '@/api/RuleService'
import Loading from '@/components/feedback/Loading'
import { AssetService } from '@/api/AssetService'
import { getYear } from 'date-fns'
import BaseScreenContainer from '@/components/container/BaseScreenContainer'

export default function AssetDepreciation() {
  const { asset_id } = useLocalSearchParams()
  const queryClient = useQueryClient()

  const [assetQuery, setAssetQuery] = React.useState<ResponseBaseType | undefined>(queryClient.getQueryData(['asset', asset_id]))

  const depreciationQuery = useQuery({
    queryKey: ['depreciation', asset_id],
    queryFn: () => AssetService.getAssetDepreciation(asset_id as string),
  })

  return (
    <BaseScreenContainer>
      {assetQuery?.data &&
        <ScrollView className="flex flex-col my-4 px-4 gap-4 " overScrollMode='never'>
          <AssetInfoDisplay
            head="Giá trị hiện tại"
            data={`${depreciationQuery.isPending ?
              'Đang tải...'
              :
              depreciationQuery.data.data !== undefined ?
                currencyFormatter().format(
                  depreciationQuery.data.data.straightLineDepreciation
                    .find((i: DepreciationItemType) => i.year === getYear(new Date()))
                    .value || assetQuery.data.purchasePrice
                ) : assetQuery.data.purchasePrice
              }`}
            opts='em'
          />
          <AssetInfoDisplay
            head="Giá mua"
            data={currencyFormatter().format((assetQuery?.data.purchasePrice))}
          />
          <AssetInfoDisplay
            head="Thời gian khấu hao"
            // data=''
            data={`${depreciationQuery.isPending ? new String('Đang tải...') :
              depreciationQuery.data.data !== undefined ?
                depreciationQuery.data.data.straightLineDepreciation.length + ' năm' : 'Chưa tính được'}`}
          />
          {depreciationQuery.isFetched && depreciationQuery.data.data !== undefined ?
            <View className='py-2 flex flex-col gap-4'>
              <View className='flex flex-col gap-2'>
                <Text className='text-typography-800 font-semibold'>Khấu hao đường thẳng</Text>
                <Table className='w-full rounded-lg overflow-hidden'>
                  <TableHeader>
                    <TableRow className="bg-background-100">
                      <TableHead>Giá trị</TableHead>
                      <TableHead>Năm</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {depreciationQuery.isPending ?
                      <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
                      :
                      depreciationQuery.data.data.straightLineDepreciation
                        .map((i: DepreciationItemType) =>
                          <TableRow key={i.year}>
                            <TableData>{currencyFormatter().format(i.value)}</TableData>
                            <TableData>{i.year}</TableData>
                          </TableRow>
                        )
                    }

                  </TableBody>
                </Table>
              </View>
              <View className='flex flex-col gap-2'>
                <Text className='text-typography-800 font-semibold'>Khấu hao theo số dư giảm dần có điều chỉnh</Text>
                <Table className='w-full rounded-lg overflow-hidden'>
                  <TableHeader>
                    <TableRow className="bg-background-100">
                      <TableHead>Giá trị</TableHead>
                      <TableHead>Năm</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {depreciationQuery.isPending ?
                      <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
                      :
                      depreciationQuery.data.data.decliningBalanceDepreciation
                        .map((i: DepreciationItemType) =>
                          <TableRow key={i.year}>
                            <TableData>{currencyFormatter().format(i.value)}</TableData>
                            <TableData>{i.year}</TableData>
                          </TableRow>
                        )
                    }

                  </TableBody>
                </Table>
              </View>
            </View>
            :
            <View className='w-full p-8 flex flex-row justify-center items-center'>
              <Text className='text-typography-900'>Chưa tính được, đợi thêm hoặc thử đổi ảnh khác xem.</Text>
            </View>
          }
        </ScrollView>
      }

    </BaseScreenContainer>
  )
}