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

export default function AssetDepreciation() {
  const { asset_id } = useLocalSearchParams()
  const queryClient = useQueryClient()

  const [assetQuery, setAssetQuery] = React.useState<ResponseBaseType | undefined>(queryClient.getQueryData(['asset', asset_id]))
  const [table, setTable] = React.useState<DepreciationTableItem[] | undefined>(undefined)
  const usefulLifeQuery = useQuery({
    queryKey: ['useful-life', assetQuery?.data?.images[0].fileName],
    queryFn: async () => {
      const res = await ClassificationService.getPredictCategoryByImg(assetQuery?.data?.images[0].fileName as string)
      if (res.status === 200) {
        return res
      }
      else if (res.status === 503) {
        return {
          data: 'Service đang bảo trì'
        }
      }
      else {
        return {
          data: 'Không thể tính thời gian khấu hao với ảnh này.'
        }
      }
    },
    enabled: !!assetQuery?.data
  })
  React.useEffect(() => {
    if (assetQuery) {
      if (assetQuery.data) {
        if (usefulLifeQuery.data?.data === 'Service đang bảo trì' ||
          usefulLifeQuery.data?.data === 'Không thể tính thời gian khấu hao với ảnh này.') {
          setTable(undefined)
        }
        else {
          setTable(getDepreciationTable(
            assetQuery.data?.purchasePrice,
            calcYearAmount(new Date(), assetQuery.data?.purchaseDate)
          ) || undefined)
        }
      }
    }
  }, [assetQuery])

  return (
    <SafeAreaView className='h-full bg-white'>
      {assetQuery?.data &&
        <ScrollView className="flex flex-col my-4 px-4 gap-4 " overScrollMode='never'>
          <AssetInfoDisplay
            head="Giá trị hiện tại"
            data={`${table ? table[table.length - 1].value : 'Đang tải...'}`}
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
            data={`${usefulLifeQuery.isPending ? new String('Đang tải...') : usefulLifeQuery.data.data}`}
          />
          {table && <Table className='w-full rounded-lg overflow-hidden'>
            <TableHeader>
              <TableRow className="bg-background-100">
                <TableHead>Giá trị</TableHead>
                <TableHead>Năm thứ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.map((i, index) =>
                <TableRow key={index}>
                  <TableData>{currencyFormatter().format(i.value)}</TableData>
                  <TableData>{i.year}</TableData>
                </TableRow>
              )}

            </TableBody>
          </Table>}

        </ScrollView>
      }

    </SafeAreaView>
  )
}