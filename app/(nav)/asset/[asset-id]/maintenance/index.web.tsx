import Callout from "@/components/custom/Callout";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { EditIcon, TrashIcon } from "lucide-react-native";
import { View } from "react-native";
const data = [
  { head: 'Danh mục', data: 'TV' },
  { head: 'Chu kỳ bảo trì', data: '1 năm' },
  { head: 'Thời gian còn lại', data: '5 tháng' },
]
const maintenancesData = [
  {
    date: '20/09/2024',
    service: 'Dienmayxanh',
    time: '2 giờ',
    cost: '1.000.000 VND',
  }
]

export default function AssetMaintenance_Web() {
  return (
    <View className="w-full h-full bg-background-0 flex flex-col gap-4 pr-6 flex-[1_0_0] overflow-y-scroll">
      <Callout what="maintenance" size='pc' />
      <Table className="w-full h-fit">
        <TableBody>
          <TableRow className="border-none">
            <TableData className="w-1/4 p-0 pb-3 text-typography-600 align-top">{data.at(0)?.head}:</TableData>
            <TableData className="w-1/4 p-0 pb-3 text-typography-900 align-top">{data.at(0)?.data}</TableData>
            <TableData></TableData>
          </TableRow>
          <TableRow className="border-none">
            <TableData className="p-0 pb-3 text-typography-600 align-top">{data.at(1)?.head}:</TableData>
            <TableData className="p-0 pb-3 text-typography-900 align-top">{data.at(1)?.data}</TableData>
            <TableData className="p-0 align-top">
              <Button
                variant='outline'
                action='primary'>
                <ButtonIcon>
                  <EditIcon size={18} className="text-primary-400" />
                </ButtonIcon>
              </Button>
            </TableData>
          </TableRow>
          <TableRow className="border-none">
            <TableData className="p-0 text-typography-600 align-top">{data.at(2)?.head}:</TableData>
            <TableData className="p-0 text-warning-400 align-top flex flex-col">{data.at(2)?.data}</TableData>
            <TableData></TableData>
          </TableRow>
          <TableRow className="border-none">
            <TableData></TableData>
            <TableData className="p-0 text-typography-600 text-sm font-light">Thời gian còn lại cho đến lần bảo trì tiếp theo.</TableData>
          </TableRow>
        </TableBody>
      </Table>
      <View className="w-full h-fit overflow-hidden rounded-md border border-outline-200">
        <Table className="w-full ">
          <TableHeader>
            <TableRow className="bg-background-100">
              <TableHead>Ngày</TableHead>
              <TableHead>Bên cung cấp dịch vụ</TableHead>
              <TableHead>Thời gian bảo trì</TableHead>
              <TableHead>Chi phí</TableHead>
              <TableHead>Minh chứng</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenancesData.map(i =>
              <TableRow key={i.time}>
                <TableData>{i.date}</TableData>
                <TableData>{i.service}</TableData>
                <TableData>{i.time}</TableData>
                <TableData>{i.cost}</TableData>
                <TableData>
                  <Button>
                    <ButtonText>Xem</ButtonText>
                  </Button>
                </TableData>
                <TableData className="flex flex-row gap-2">
                  <Button
                    className="px-3"
                    variant='outline'
                    action='primary'>
                    <ButtonIcon>
                      <EditIcon size={18} className="text-primary-400" />
                    </ButtonIcon>
                  </Button>
                  <Button
                    className="px-3"
                    variant='outline'
                    action='negative'>
                    <ButtonIcon>
                      <TrashIcon size={18} className="text-error-400" />
                    </ButtonIcon>
                  </Button>
                </TableData>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </View>
    </View>
  )
}
