import { AssetStatusList } from '@/constants/data_enum'
import { FileInfoType, VendorType } from './common'

type ResponseBaseType = {
  status: number,
  data: any
}

type PageResponseType<T> = {
  currentItemCount: number,
  itemsPerPage: number,
  totalItems: number,
  pageIndex: number,
  totalPages: number,
  items: T[]
}
type AddressParticalType = {
  code: number,
  name: string
}
type AddressType = {
  line: string,
  province: AddressParticalType,
  district: AddressParticalType,
  ward: AddressParticalType
}

//#region user profile
type UserProfileResponseType = {
  id: string,
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  address: AddressType
}
//#endregion


//#region Asset

type AssetResponseType = {
  id: string,
  createdAt: string,
  createdBy: string,
  name: string,
  description: string,
  images: FileInfoType[],
  purchaseDate: string,
  purchasePlace: string,
  purchasePrice: number,
  brand: string,
  serialNumber: string,
  location: LocationResponseType,
  warrantyExpiryDate: string,
  documents: FileInfoType[],
  status: string,
  maintenanceCycle: any,
  category: CategoryInAssetResponseType
}

type AssetOnListResponseType = {
  id: string,
  name: string,
  description: string,
  images: FileInfoType[],
  location: LocationResponseType,
  status: string,
  category: CategoryInAssetResponseType
}

type AssetLifecycleType = {
  id: string,
  timestamp: string,
  description: string
}
type AssetLifecycleResponseType = {
  currentItemCount: number,
  itemsPerPage: number,
  totalItems: number,
  pageIndex: number,
  totalPages: number,
  items: AssetLifecycleType[]
}

//#endregion

//#region Category
type CategoryInAssetResponseType = {
  id: string,
  name: string,
  parent: RootCategoryResponseType,
}

type CategoryResponseType = {
  id: string,
  name: string,
  description: string,
  numberOfAssets: number,
  parent: RootCategoryResponseType,
}

type RootCategoryResponseType = {
  id: string,
  name: string,
}
//#endregion

//#region location
type LocationResponseType = {
  id: string,
  name: string,
  images: FileInfoType[]
}
//#endregion

//#region file
type FileUploadResponseType = {
  totalItems: number,
  totalSuccessItems: number,
  totalFailureItems: number,
  items: [{
    status: number,
    data: FileInfoType
  }]
}
//#endregion


//#region schedule

type ScheduleResponseType = {
  id: string,
  title: string,
  start: string,
  end: string,
  vendor: VendorType,
  cost: number,
  documents: FileInfoType[],
  type: string,
  asset: {
    id: string,
    name: string
  }
}
//#endregion

//#region statistic
type MonthCostStatisticType = {
  january: number | null,
  february: number | null,
  march: number | null,
  april: number | null,
  may: number | null,
  june: number | null,
  july: number | null,
  august: number | null,
  september: number | null,
  october: number | null,
  november: number | null,
  december: number | null,
}
//#endregion

//#region depreciation
type DepreciationItemType = {
  year: number,
  value: number,
}
type DepreciationType = {
  straightLineDepreciation: DepreciationItemType[],
  decliningBalanceDepreciation: DepreciationItemType[],
}
//#endregion

export {
  ResponseBaseType,
  PageResponseType,
  AddressType,
  UserProfileResponseType,
  AssetResponseType,
  CategoryInAssetResponseType,
  RootCategoryResponseType,
  CategoryResponseType,
  FileUploadResponseType,
  AssetLifecycleResponseType,
  AssetLifecycleType,
  ScheduleResponseType,
  LocationResponseType,
  AssetOnListResponseType,
  DepreciationItemType,
  DepreciationType
}