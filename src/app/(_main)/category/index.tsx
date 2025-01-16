import { CategoryService } from "@/api/CategoryService";
import { CategoryResponseType, PageResponseType, ResponseBaseType } from "@/api/types/response";
import BaseScreenContainer from "@/components/container/BaseScreenContainer";
import MainContainer from "@/components/container/MainContainer";
import CategoryCard from "@/components/custom/CategoryCard";
import CategoryPickerModal from "@/components/custom/CategoryPickerModal";
import CustomFilter from "@/components/custom/CustomFilter";
import Pagination from "@/components/custom/Pagination";
import Loading from "@/components/feedback/Loading";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import SimpleWidget from "@/components/widget/SimpleWidget";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ChevronDownIcon, FilterIcon, HeartIcon, PlusIcon, SearchIcon } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

const DEFAULT_PAGE_SIZE = 10
export default function Categories() {
  //
  const queryClient = useQueryClient()
  const cacheData = queryClient.getQueryData<ResponseBaseType | undefined>(['categoryList', 1, DEFAULT_PAGE_SIZE, '', ''])
  //
  const [totalItems, setTotalItems] = useState<number | undefined>(cacheData ?
    cacheData.data.totalItems : undefined)
  //
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [parent, setParent] = useState<string>('')
  const [isFiltered, setIsFiltered] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [categoryModalShow, setCategoryModalShow] = useState(false)
  const categoryFullList = useQuery({
    queryKey: ['categoryFullList'],
    queryFn: () => CategoryService.getAllCategory()
  })
  const categoryListQuery = useQuery({
    queryKey: [
      'categoryList',
      page,
      pageSize,
      parent,
      name,
    ],
    queryFn: async () => {
      const res = await CategoryService.getCategoryList(page, pageSize, parent, name)
      if (res.status === 200) {
        setTotalItems(res.data.totalItems)
      }
      return res
    },
  })
  const getCategoryName = (id: string): string => {
    return categoryFullList.data?.data.items.find((i: CategoryResponseType) => i.id === id)?.name
  }

  //

  const SearchInput = (
    <Input className='grow bg-background-50 border-0' variant='rounded' size="lg"
    >
      <InputSlot className="pl-3">
        <InputIcon as={SearchIcon} />
      </InputSlot>
      <InputField
        type='text'
        placeholder="Tìm kiếm"
        value={searchInputValue}
        onChangeText={setSearchInputValue}
        onSubmitEditing={() => setName(searchInputValue)}
        returnKeyType="search"
      />
    </Input>
  )

  const FilterInput = (
    <TouchableOpacity className='flex flex-row gap-2'>
      <Icon as={FilterIcon} className='text-typography-600' />
      <Text className='text-typography-600'>Bộ lọc</Text>
    </TouchableOpacity>
  )
  const SearchAndFilter = () => (
    <View className='flex flex-row gap-4 items-center'>
      {SearchInput}
      {FilterInput}
    </View>
  )
  const ActionFab = () => (
    <Fab
      className='bg-primary-400 '
      size="lg"
      placement="bottom right"
      onPress={() => router.push('/(_main)/category/create-category')}>
      <FabLabel >Thêm</FabLabel>
      <FabIcon as={PlusIcon} />
    </Fab>
  )

  const FavouriteList = () => (
    <View className='flex flex-col gap-2 py-2 border-t border-outline-100'>
      <View className='flex flex-row gap-2 items-center'>
        <HeartIcon className='w-5 h-5' fill={`#D4003F`} />
        <Text className='text-lg text-typography-800 font-semibold'>
          Danh sách yêu thích
        </Text>
      </View>
      {/* <AssetCard deleteFn={() => { }} /> */}
    </View>
  )

  const NormalList = (data: PageResponseType<CategoryResponseType>) => (
    <View className='flex flex-col gap-2 pt-4 pb-10 border-t border-outline-50'>
      <Text className='text-lg text-typography-800 font-semibold'>
        Danh sách
      </Text>
      <View className='flex flex-row justify-center '>
        <Pagination
          quantity={data.totalPages}
          active={data.pageIndex}
          onChange={setPage} />
      </View>
      {data.items.map((i: CategoryResponseType) =>
        <CategoryCard
          key={i.id}
          data={i}
          onPress={() => { }}
          deleteFn={() => { }} />)}

    </View>
  )


  const Filters = (
    <View className="flex flex-col gap-4 w-60">
      <CategoryPickerModal
        type='parent'
        showModal={categoryModalShow}
        setShowModal={setCategoryModalShow}
        data={categoryFullList.data ? categoryFullList.data?.data.items as CategoryResponseType[] : []}
        pickFn={(id: string) => {
          setParent(id)
          if (id === '')
            setIsFiltered(false)
          else
            setIsFiltered(true)
        }}
      />
      <Input
        isReadOnly={true}
        variant="outline"
        size="lg"
        onTouchEnd={() => setCategoryModalShow(true)}
      >
        <InputField placeholder="Danh mục cha" value={getCategoryName(parent)} />
        <InputSlot >
          <InputIcon className="mr-3" as={ChevronDownIcon} />
        </InputSlot>
      </Input>
    </View>
  )
  return (
    <BaseScreenContainer>
      <MainContainer>
        <View className="flex flex-col gap-4 py-4">
          <SimpleWidget className="h-24" label="Tổng số danh mục" number={totalItems} />
          <View className='flex flex-row gap-4 items-center'>
            {SearchInput}
            <CustomFilter filters={Filters} isFiltered={isFiltered} />
          </View>
          {/* {FavouriteList} */}

          {categoryListQuery.isPending ?
            <View className='relative h-40'>
              <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
            </View>
            :
            NormalList(categoryListQuery.data.data)}

        </View>
      </MainContainer>
      <ActionFab />
    </BaseScreenContainer>
  )
}
