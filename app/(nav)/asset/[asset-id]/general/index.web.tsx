import ImageUploader from "@/components/custom/ImageUploader";
import { Accordion, AccordionContent, AccordionContentText, AccordionHeader, AccordionIcon, AccordionItem, AccordionTitleText, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Pressable } from "@/components/ui/pressable";
import { Table, TableBody, TableData, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VStack } from "@/components/ui/vstack";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react-native";
import { View } from "react-native";

const data = [
  {
    key: 'overview',
    label: 'Tổng quan',
    items: [
      { head: 'Tên', data: 'Smart Tivi Samsung 4K Crystal UHD 55 inch UA55AU8100' },
      { head: 'Danh mục', data: 'Thiết bị phòng khách' },
      { head: 'Mô tả', data: 'Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.' },
      { head: 'Tạo vào', data: '26/09/2024' },
    ],
  },
  {
    key: 'purchase',
    label: 'Thông tin mua hàng',
    items: [
      { head: 'Ngày mua hàng', data: '19/09/2024' },
      { head: 'Giá mua', data: '12.000.000 VND' },
      { head: 'Nhà cung cấp', data: 'Sony' },
      { head: 'Số serial', data: '012345678909' },
    ],
  },
  {
    key: 'use',
    label: 'Thông tin sử dụng',
    items: [
      { head: 'Tình trạng', data: 'Đang dùng' },
      { head: 'Vị trí', data: 'Phòng khách' },
    ],
  },
  {
    key: 'warranty',
    label: 'Bảo hành',
    items: [
      { head: 'Ngày kết thúc', data: '19/09/2026' },
      {
        head: 'Thẻ bảo hành/ Hóa đơn',
        data:
          <View className="w-full overflow-hidden rounded-md border border-outline-200">
            <Table className="w-full ">
              <TableHeader>
                <TableRow className="bg-background-100">
                  <TableHead>Tài liệu</TableHead>
                  <TableHead>Chỉnh sửa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableData>file.doc</TableData>
                  <TableData>edit</TableData>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableData ></TableData>
                </TableRow>
              </TableFooter>
            </Table>
          </View>

      },
    ],
  },
]

export default function AssetGeneral() {

  return (
    <View className="w-full h-full bg-background-0 flex flex-row gap-4 pr-6 overflow-y-scroll">
      <Accordion
        className="flex-[1_0_0]"
        variant="unfilled"
        type="multiple"
        defaultValue={data.map(item => item.key)}
      >
        {data.map(i =>
          <AccordionItem key={i.key} value={i.key} className="p-0">
            <AccordionHeader className="hover:bg-background-100 px-4 py-1 rounded-md">
              <AccordionTrigger >
                {({ isExpanded }) => {
                  return (
                    <>
                      {isExpanded ? (
                        <AccordionIcon className="text-typography-600" as={ChevronUpIcon} />
                      ) : (
                        <AccordionIcon className="text-typography-600" as={ChevronDownIcon} />
                      )}
                      <AccordionTitleText className="ml-4 text-typography-600 text-sm">
                        {i.label}
                      </AccordionTitleText>
                    </>
                  )
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <Table>
                <TableBody>
                  {i.items.map(tableItem =>
                    <TableRow key={tableItem.head} className="border-none">
                      <TableData className="p-0 pb-3 text-typography-600 align-top">{tableItem.head}:</TableData>
                      <TableData className="p-0 pb-3 text-typography-900 w-8/12">{tableItem.data}</TableData>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        )}

      </Accordion>
      <ImageUploader className="w-[240px] h-[240px]" />
    </View>
  );
}
