import Pagination from '@/components/custom/Pagination'
import { Select } from '@/components/custom/Select'
import { FilterSelect } from '@/components/filter/FilterSelect'
import { Button, ButtonText } from '@/components/ui/button'
import { Checkbox, CheckboxIcon, CheckboxIndicator } from '@/components/ui/checkbox'
import { HStack } from '@/components/ui/hstack'
import { Image } from '@/components/ui/image'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import SimpleWidget from '@/components/widget/SimpleWidget'
import { IMAGE_URL } from '@/constants/public'
import { useRouter } from 'expo-router'
import { CheckIcon, SearchIcon } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'



const tableData = [
  { img: IMAGE_URL + '/dreamlike.png', name: 'Device', category: 'Electrical', state: 'Đang dùng', desc: 'abcdxyz@!#$%^' },
  { img: IMAGE_URL + '/dreamlike.png', name: 'Device', category: 'Electrical', state: 'Đang dùng', desc: 'abcdxyz@!#$%^' },
  { img: IMAGE_URL + '/dreamlike.png', name: 'Device', category: 'Electrical', state: 'Đang dùng', desc: 'abcdxyz@!#$%^' },
  { img: IMAGE_URL + '/dreamlike.png', name: 'Device', category: 'Electrical', state: 'Đang dùng', desc: 'abcdxyz@!#$%^' },
  { img: IMAGE_URL + '/dreamlike.png', name: 'Device', category: 'Electrical', state: 'Đang dùng', desc: 'abcdxyz@!#$%^' },
  { img: IMAGE_URL + '/dreamlike.png', name: 'Device', category: 'Electrical', state: 'Đang dùng', desc: 'abcdxyz@!#$%^' },
  { img: IMAGE_URL + '/dreamlike.png', name: 'Device', category: 'Electrical', state: 'Đang dùng', desc: 'abcdxyz@!#$%^' },
  { img: IMAGE_URL + '/dreamlike.png', name: 'Device', category: 'Electrical', state: 'Đang dùng', desc: 'abcdxyz@!#$%^' },
  { img: IMAGE_URL + '/dreamlike.png', name: 'Device', category: 'Electrical', state: 'Đang dùng', desc: 'abcdxyz@!#$%^' },
  { img: IMAGE_URL + '/dreamlike.png', name: 'Device', category: 'Electrical', state: 'Đang dùng', desc: 'abcdxyz@!#$%^' },
]

export default function Asset_Web() {

  const router = useRouter()
  useEffect(() => {
    document.title = "Tài sản"
  }, [])

  const [page, setPage] = useState(1)

  return (
    <View className="flex flex-col h-full bg-white py-6 pl-6 pr-0 gap-4">
      <HStack className='justify-between min-h-fit pr-6'>
        <Text className='text-2xl font-bold text-typography-900'>Danh sách tài sản</Text>
        <HStack className='gap-3'>
          <Button size="sm" variant="solid" action="secondary">
            <ButtonText>Nhập liệu</ButtonText>
          </Button>
          <Button size="sm" variant="solid" action="primary">
            <ButtonText>Thêm tài sản</ButtonText>
          </Button>
        </HStack>
      </HStack>
      <View className="grow shrink overflow-y-scroll pr-2">
        <View className="flex flex-col gap-4 overflow-y-auto">
          <HStack className="justify-between items-end">
            <SimpleWidget size={185}></SimpleWidget>
            <HStack className="gap-4">
              <Input
                className="w-[360px]"
                variant="rounded"
                size="md"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
              >
                <InputSlot className="pl-3">
                  <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField placeholder="Tìm kiếm" />
              </Input>
              <FilterSelect placeholder="Danh mục" />
              <FilterSelect placeholder="Trạng thái" />
            </HStack>
          </HStack>
          <div className="flex flex-col gap-2 pb-4 items-center border border-outline-200  rounded-md overflow-hidden">
            <Table className="w-full ">
              <TableHeader>
                <TableRow className="bg-background-100">
                  <TableHead className="w-4">
                    <Checkbox size="md" isInvalid={false} isDisabled={false} value='s'>
                      <CheckboxIndicator>
                        <CheckboxIcon as={CheckIcon} />
                      </CheckboxIndicator>
                    </Checkbox>
                  </TableHead>
                  <TableHead><Text className="text-md text-typography-900 font-bold">Tên</Text></TableHead>
                  <TableHead><Text className="text-md text-typography-900 font-bold">Danh mục</Text></TableHead>
                  <TableHead><Text className="text-md text-typography-900 font-bold">Trạng thái</Text></TableHead>
                  <TableHead><Text className="text-md text-typography-900 font-bold">Mô tả</Text></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((i, index) => (
                  <tr key={index} className='hover:bg-background-50 hover:cursor-pointer' onClick={() => router.push(`/asset/${index}`)}>
                    <TableData>
                      <Checkbox size="md" isInvalid={false} isDisabled={false} value='s'>
                        <CheckboxIndicator>
                          <CheckboxIcon as={CheckIcon} />
                        </CheckboxIndicator>
                      </Checkbox>
                    </TableData>
                    <TableData className="flex items-center gap-2">
                      <Image
                        className='w-[40px] h-[40px] rounded-md'
                        source={i.img}
                        alt="image"
                      />
                      <Text className="text-md text-typography-900 font-normal">{i.name}</Text>
                    </TableData>
                    <TableData>
                      <Text className="text-md text-typography-900 font-normal">{i.category}</Text>
                    </TableData>
                    <TableData>
                      <Text className="text-md text-typography-900 font-normal">{i.state}</Text>
                    </TableData>
                    <TableData>
                      <Text className="text-md text-typography-900 font-normal">{i.desc}</Text>
                    </TableData>
                  </tr>
                ))}
              </TableBody>
            </Table>
            <Pagination quantity={10} active={page} onChange={setPage} />
          </div>
        </View>
      </View>
    </View >
  )
}
