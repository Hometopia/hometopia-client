import { AssetStatusList } from '@/constants/data_enum'
import { FileInfoType } from './request'

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
type AssetListResponseType = {
  currentItemCount: number,
  itemsPerPage: number,
  totalItems: number,
  pageIndex: number,
  totalPages: number,
  items: {
    id: string,
    name: string,
    description: string,
    status: string,
    images: FileInfoType[],
    category: CategoryInAssetResponseType,
  }[]
}

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
  vendor: string,
  serialNumber: string,
  location: string,
  warrantyExpiryDate: string,
  documents: FileInfoType[],
  status: string,
  maintenanceCycle: any,
  category: CategoryInAssetResponseType
}

type AssetLifecycleType = {
  id: string,
  createdAt: string,
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
  vendor: {
    link: string,
    name: string,
    address: string,
    website: string,
    phoneNumber: string
  },
  cost: number,
  documents: FileInfoType[],
  type: string,
  asset: {
    id: string,
    name: string
  }
}
//#endregion
export {
  ResponseBaseType,
  PageResponseType,
  AddressType,
  UserProfileResponseType,
  AssetListResponseType,
  AssetResponseType,
  CategoryInAssetResponseType,
  RootCategoryResponseType,
  CategoryResponseType,
  FileUploadResponseType,
  AssetLifecycleResponseType,
  AssetLifecycleType,
  ScheduleResponseType
}