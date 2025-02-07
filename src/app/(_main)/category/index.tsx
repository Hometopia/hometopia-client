import { CategoryService } from "@/api/CategoryService";
import { CategoryUpdateType } from "@/api/types/request";
import { CategoryResponseType, PageResponseType, ResponseBaseType } from "@/api/types/response";
import BaseScreenContainer from "@/components/container/BaseScreenContainer";
import MainContainer from "@/components/container/MainContainer";
import CategoryCard from "@/components/custom/CategoryCard";
import CategoryPickerModal from "@/components/custom/CategoryPickerModal";
import CategoryUpdateModal from "@/components/custom/CategoryUpdateModal";
import CustomFilter from "@/components/custom/CustomFilter";
import HouseClassifiModal from "@/components/custom/HouseClassifiModal";
import Pagination from "@/components/custom/Pagination";
import SuggestedCategoriesModal from "@/components/custom/SuggestedCategoriesModal";
import Loading from "@/components/feedback/Loading";
import { Button, ButtonText } from "@/components/ui/button";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import SimpleWidget from "@/components/widget/SimpleWidget";
import { HouseType, HouseTypeName } from "@/constants/data_enum";
import { BR } from "@expo/html-elements";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ChevronDownIcon, FilterIcon, HeartIcon, PlusIcon, SearchIcon } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

const DEFAULT_PAGE_SIZE = 10
const BLANK_PARENT = 'blank'
export default function Categories() {
  //
  const queryClient = useQueryClient()
  const cacheData = queryClient.getQueryData<ResponseBaseType | undefined>(['categoryFullList'])
  //
  const [totalItems, setTotalItems] = useState<number | undefined>(cacheData ?
    cacheData.data.totalItems : undefined)
  //
  const [suggestedCategories, setSuggestedCategories] = useState(false)
  const [showModal, setShowModal] = useState(false)
  //
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [parent, setParent] = useState<string>('')
  const [isFiltered, setIsFiltered] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [categoryModalShow, setCategoryModalShow] = useState(false)
  const [updateModalShow, setUpdateModalShow] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<CategoryResponseType>()
  const categoryFullList = useQuery({
    queryKey: ['categoryFullList'],
    queryFn: () => CategoryService.getAllCategory()
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => CategoryService.deleteCategory(id),
    onSuccess: (res) => {
      categoryFullList.refetch()
    },
  })
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: CategoryUpdateType }) => CategoryService.updateCategory(id, payload),
    onSuccess: (res) => {
      categoryFullList.refetch()
    },
    onError: (err) => { }
  })
  const getCategoryName = (id: string): string => {
    if (id === BLANK_PARENT) return 'Không có'
    return categoryFullList.data?.data.items.find((i: CategoryResponseType) => i.id === id)?.name
  }
  //filter
  const applyFilter = (i: CategoryResponseType): boolean => {
    const normalizedSearch = name.toLowerCase().trim().replace(/\s+/g, ' ')
    const normalizedName = i.name.toLowerCase().trim().replace(/\s+/g, ' ')
    return (normalizedSearch === '' ? true : normalizedName.includes(normalizedSearch)) &&
      (parent === '' ? true :
        (parent === BLANK_PARENT ? !i.parent :
          (i.parent && i.parent.id === parent)
        ))
  }
  const filteredData = (data: PageResponseType<CategoryResponseType>): PageResponseType<CategoryResponseType> => {
    const arr: CategoryResponseType[] = data.items.filter((i: CategoryResponseType) => applyFilter(i))
    return {
      currentItemCount: Math.min(pageSize, arr.length - (page - 1) * pageSize),
      itemsPerPage: pageSize,
      totalItems: arr.length,
      pageIndex: page,
      totalPages: Math.ceil(arr.length / pageSize),
      items: arr.slice((page - 1) * pageSize, Math.min((page) * pageSize, arr.length))
    } as PageResponseType<CategoryResponseType>
  }
  //#region 
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
        onSubmitEditing={() => {
          setName(searchInputValue)
          setPage(1)
        }}
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
  const NormalList = (data: PageResponseType<CategoryResponseType>) => {

    return (
      <View className='flex flex-col gap-2 pt-4 pb-10 border-t border-outline-50'>
        <View className="flex flex-row justify-between">
          <Text className='text-lg text-typography-800 font-semibold'>
            Danh sách
          </Text>
          <Text>
            Số lượng: {data.totalItems}
          </Text>
        </View>
        <View className='flex flex-row justify-center'>
          <Pagination
            quantity={data.totalPages}
            active={data.pageIndex}
            onChange={setPage} />
        </View>
        {data.items.map((i: CategoryResponseType) =>
          <CategoryCard
            key={i.id}
            data={i}
            onPress={() => {
              setCurrentCategory(i)
              setUpdateModalShow(true)
            }}
            deleteFn={() => deleteCategoryMutation.mutate(i.id)}
            updateFn={() => {
              setCurrentCategory(i)
              setUpdateModalShow(true)
            }}
          />

        )}
      </View>
    )
  }
  const Filters = (
    <View className="flex flex-col gap-4 w-60">
      <CategoryPickerModal
        type='parent'
        showModal={categoryModalShow}
        setShowModal={setCategoryModalShow}
        data={categoryFullList.data ? categoryFullList.data?.data.items as CategoryResponseType[] : []}
        pickFn={(id: string | null) => {
          setParent(id !== null ? id : BLANK_PARENT)
          setPage(1)
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
  //#endregion
  return (
    <BaseScreenContainer>
      <MainContainer>
        <View className="flex flex-col gap-4 py-4">
          <SimpleWidget className="h-24" label="Tổng số danh mục"
            number={categoryFullList.isPending ? undefined : categoryFullList.data.data.totalItems} />
          <View className='flex flex-row gap-4 items-center'>
            {SearchInput}
            <CustomFilter filters={Filters} isFiltered={isFiltered} />
          </View>
          {totalItems === 0 ?
            <TouchableOpacity className="h-60 p-4 rounded-xl bg-primary-400/10 flex justify-center items-center border-dashed border-2 border-primary-400 "
              onPress={() => setSuggestedCategories(true)}
            >
              <SuggestedCategoriesModal
                showModal={suggestedCategories}
                setShowModal={setSuggestedCategories}
                pickFn={(i: string) => router.navigate(`/(_main)/category/${i}`)}
              />
              <Text className="text-center text-primary-400">Nhấp vào để tạo tự động tạo theo đề xuất</Text>
              <Text className="text-center text-primary-400">hoặc tự tạo qua nút "Thêm" bên dưới </Text>
            </TouchableOpacity>
            :
            categoryFullList.isPending || deleteCategoryMutation.isPending ?
              <View className='relative h-40'>
                <Loading texts={[{ condition: true, text: 'Đang tải...' }]} />
              </View>
              :
              NormalList(filteredData(categoryFullList.data.data))
          }

        </View>
      </MainContainer>
      <ActionFab />
      {currentCategory ?
        <CategoryUpdateModal
          showModal={updateModalShow}
          setShowModal={setUpdateModalShow}
          data={currentCategory as CategoryResponseType}
          fullList={categoryFullList.data.data.items}
          updateFn={updateCategoryMutation.mutate}
          deleteFn={deleteCategoryMutation.mutate}
        /> : null}
    </BaseScreenContainer>
  )
}
