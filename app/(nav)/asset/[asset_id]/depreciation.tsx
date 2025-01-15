import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { Table, TableBody, TableData, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLocalSearchParams } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AssetResponseType, ResponseBaseType } from '@/api/types/response'
import { currencyFormatter } from '@/helpers/currency'
import { calcYearAmount } from '@/helpers/time'
import { calcCurrentValue, getDepreciationTable } from '@/helpers/linear-depreciation'
import AssetInfoDisplay from '@/components/custom/AssetInfoDisplay'
import { ClassificationService } from '@/api/ClassificationService'
import { DepreciationTableItem } from "@/constants/types"
import { RuleService } from '@/api/RuleService'
import Loading from '@/components/feedback/Loading'

export default function AssetDepreciation() {
  const { asset_id } = useLocalSearchParams()
  const queryClient = useQueryClient()

  const [assetQuery, setAssetQuery] = React.useState<ResponseBaseType | undefined>(queryClient.getQueryData(['asset', asset_id]))
  const [table, setTable] = React.useState<DepreciationTableItem[] | undefined>(undefined)
  const predictCategoryQuery = useQuery({
    queryKey: ['predict-category', assetQuery?.data?.images[0].fileName],
    queryFn: async () => {
      const res = await ClassificationService.getPredictCategoryByImg(assetQuery?.data?.images[0].fileName as string)
      return {
        prediction: res.prediction
      }
    },
    enabled: !!assetQuery?.data
  })

  const usefulLifeQuery = useQuery({
    queryKey: ['useful-life', asset_id],
    queryFn: () => RuleService.getUsefulLife(predictCategoryQuery.data?.prediction),
    enabled: predictCategoryQuery.isFetched
  })
  // React.useEffect(() => {
  //   if (assetQuery) {
  //     if (assetQuery.data) {
  //       if (usefulLifeQuery.data === undefined) {
  //         setTable(undefined)
  //       }
  //       else {
  //         setTable(getDepreciationTable(
  //           assetQuery.data?.purchasePrice,
  //           usefulLifeQuery.data.usefulLife,
  //           calcYearAmount(new Date(), assetQuery?.data.purchaseDate)
  //           // calcYearAmount(new Date(), assetQuery.data?.purchaseDate)
  //         ) || undefined)
  //       }
  //     }
  //   }
  // }, [assetQuery])

  return (
    <SafeAreaView className='h-full bg-white'>
      {assetQuery?.data &&
        <ScrollView className="flex flex-col my-4 px-4 gap-4 " overScrollMode='never'>
          <AssetInfoDisplay
            head="Giá trị hiện tại"
            data={`${predictCategoryQuery.isPending || usefulLifeQuery.isPending ?
              'Đang tải...'
              :
              currencyFormatter().format(
                calcCurrentValue(
                  assetQuery.data?.purchasePrice,
                  usefulLifeQuery.data?.usefulLife || 0,
                  calcYearAmount(new Date(), assetQuery?.data.purchaseDate)
                )
              )
              }`}
            opts='em'
          />
          <AssetInfoDisplay
            head="Năm hiện tại"
            data={calcYearAmount(new Date(), assetQuery?.data.purchaseDate).toString()} />
          <AssetInfoDisplay
            head="Giá mua"
            data={currencyFormatter().format((assetQuery?.data.purchasePrice))}
          />
          <AssetInfoDisplay
            head="Thời gian khấu hao"
            // data=''
            data={`${usefulLifeQuery.isPending ? new String('Đang tải...') : usefulLifeQuery.data?.usefulLife}`}
          />
          <Table className='w-full rounded-lg overflow-hidden'>
            <TableHeader>
              <TableRow className="bg-background-100">
                <TableHead>Giá trị</TableHead>
                <TableHead>Năm thứ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictCategoryQuery.isPending || usefulLifeQuery.isPending ?
                <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
                :
                getDepreciationTable(
                  assetQuery.data?.purchasePrice,
                  usefulLifeQuery.data?.usefulLife || 0,
                  calcYearAmount(new Date(), assetQuery?.data.purchaseDate)
                  // calcYearAmount(new Date(), assetQuery.data?.purchaseDate)
                ).map((i, index) =>
                  <TableRow key={index}>
                    <TableData>{currencyFormatter().format(i.value)}</TableData>
                    <TableData>{i.year}</TableData>
                  </TableRow>
                )
              }

            </TableBody>
          </Table>

        </ScrollView>
      }

    </SafeAreaView>
  )
}