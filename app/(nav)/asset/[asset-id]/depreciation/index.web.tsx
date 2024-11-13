import { Accordion } from "@/components/ui/accordion"
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { View } from "react-native"

const data = [
  { head: 'Giá trị hiện tại', data: '11.000.000 VND' },
  { head: 'Năm hiện tại', data: '1' },
  { head: 'Giá mua', data: '12.000.000 VND' },
  { head: 'Thời gian khấu hao', data: '10 năm ' },
]

export default function AssetDepreciation_Web() {
  return (
    <View className="w-full h-full bg-background-0 flex flex-col gap-4 pr-6 ">
      <Table className="w-full h-fit">
        <TableBody>
          <TableRow className="border-none">
            <TableData className="w-1/4 p-0 pb-3 text-typography-600 align-top">{data.at(0)?.head}:</TableData>
            <TableData className="w-3/4 p-0 pb-3 text-primary-400 align-top">{data.at(0)?.data}</TableData>
          </TableRow>
          <TableRow className="border-none">
            <TableData className="p-0 pb-3 text-typography-600 align-top">{data.at(1)?.head}:</TableData>
            <TableData className="p-0 pb-3 text-typography-900 align-top">{data.at(1)?.data}</TableData>
          </TableRow>
          <TableRow className="border-none">
            <TableData className="p-0 pb-3 text-typography-600 align-top">{data.at(2)?.head}:</TableData>
            <TableData className="p-0 pb-3 text-typography-900 align-top">{data.at(2)?.data}</TableData>
          </TableRow>
          <TableRow className="border-none">
            <TableData className="p-0 pb-3 text-typography-600 align-top">{data.at(3)?.head}:</TableData>
            <TableData className="p-0 pb-3 text-typography-900 align-top">{data.at(3)?.data}</TableData>
          </TableRow>
        </TableBody>
      </Table>
      <View className="w-1/3 h-fit overflow-hidden rounded-md border border-outline-200">
        <Table className="w-full ">
          <TableHeader>
            <TableRow className="bg-background-100">
              <TableHead>Giá trị</TableHead>
              <TableHead>Năm thứ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableData>12.000.000 VND</TableData>
              <TableData>0</TableData>
            </TableRow>
            <TableRow>
              <TableData>11.000.000 VND</TableData>
              <TableData>1</TableData>
            </TableRow>
          </TableBody>
        </Table>
      </View>
    </View>
  )
}
