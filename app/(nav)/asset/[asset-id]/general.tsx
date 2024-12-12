import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import ImageUploader from '@/components/custom/ImageUploader'
import { Accordion, AccordionContent, AccordionHeader, AccordionIcon, AccordionItem, AccordionTitleText, AccordionTrigger } from '@/components/ui/accordion'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react-native'
import { Table, TableBody, TableData, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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

]

export default function AssetGeneral() {
  return (
    <SafeAreaView className='h-full bg-white'>
      <ScrollView className="flex flex-col my-4 px-4 gap-4 ">
        <View className='flex flex-row justify-center mb-4'>
          <ImageUploader />
        </View>

        <Accordion
          className="flex-[1_0_0]"
          variant="unfilled"
          type="multiple"
          defaultValue={data.map(item => item.key)}
        >
          {data.map(i =>
            <AccordionItem key={i.key} value={i.key} className="p-0">
              <AccordionHeader className="active:bg-background-100 px-4 py-1 rounded-md">
                <AccordionTrigger >
                  {({ isExpanded }) => {
                    return (
                      <>
                        {isExpanded ? (
                          <AccordionIcon className="text-typography-600" as={ChevronUpIcon} />
                        ) : (
                          <AccordionIcon className="text-typography-600" as={ChevronDownIcon} />
                        )}
                        <AccordionTitleText className="ml-4 text-typography-600 text-md">
                          {i.label}
                        </AccordionTitleText>
                      </>
                    )
                  }}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                {i.items.map(tableItem =>
                  <View key={tableItem.head} className="border-none">
                    <Text className="p-0 pb-1 text-base font-medium text-typography-400 align-top">{tableItem.head}:</Text>
                    <Text className="p-0 pb-3 text-lg text-typography-900">{tableItem.data}</Text>
                  </View>
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="warranty" className="p-0">
            <AccordionHeader className="active:bg-background-100 px-4 py-1 rounded-md">
              <AccordionTrigger >
                {({ isExpanded }) => {
                  return (
                    <>
                      {isExpanded ? (
                        <AccordionIcon className="text-typography-600" as={ChevronUpIcon} />
                      ) : (
                        <AccordionIcon className="text-typography-600" as={ChevronDownIcon} />
                      )}
                      <AccordionTitleText className="ml-4 text-typography-600 text-md">
                        Bảo hành
                      </AccordionTitleText>
                    </>
                  )
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <View>
                <Text className="p-0 pb-1 text-base font-medium text-typography-400 align-top">Ngày kết thúc:</Text>
                <Text className="p-0 pb-3 text-lg text-typography-900">19/09/2026</Text>
              </View>
              <View className='flex flex-col gap-2 '>
                <Text className="p-0 pb-1 text-base font-medium text-typography-400 align-top">Thẻ bảo hành/ Hóa đơn:</Text>
                <Table className='w-full rounded-lg overflow-hidden'>
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
                      <TableData className='bg-background-50'>Theem</TableData>
                    </TableRow>
                  </TableFooter>
                </Table>
              </View>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollView>
    </SafeAreaView>

  )
}