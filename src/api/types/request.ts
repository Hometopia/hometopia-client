import { FileInfoType, VendorType } from "./common"

//#region Auth
type LoginForm = {
  username: string, // username or email
  password: string,
}

type RegisterForm = {
  "username": string,
  "firstName": string,
  "lastName": string,
  "email": string,
  "password": string,
  "address": {
    "line": string,
    "provinceId": number,
    "districtId": number,
    "wardId": number
  }
}
//#endregion

//#region Category
type CategoryType = {
  name: string,
  description: string,
  parentId: string,
  subCategories: CategoryType[]
}
type CategoryUpdateType = {
  name: string,
  description: string,
  parentId: string,
  subCategoryIds: string[]
}
//#endregion

//#region Asset
type AssetType = {
  name: string,
  description: string,
  images: FileInfoType[] | null,
  purchaseDate: string,
  purchasePlace: string,
  purchasePrice: number,
  brand: string,
  serialNumber: string,
  locationId: string,
  warrantyExpiryDate: string,
  documents: FileInfoType[] | null,
  status: string,
  maintenanceCycle: any,
  categoryId: string
}


//#endregion
//#region location
type LocationType = {
  name: string,
  images: FileInfoType[]
}
//#endregion
//#region File

//#endregion

//#region Rule
//poooooor

type UsefulLifeType = {
  category: string,
  usefulLife: number,
}
//#endregion

//#region Schedule


type ScheduleType = {
  title: string,
  start: string,
  end?: string,
  vendor: VendorType | null,
  cost: number,
  documents: FileInfoType[],
  type: string,
  assetId: string,
}
//#endregion
export {
  LoginForm,
  RegisterForm,
  CategoryType,
  CategoryUpdateType,
  AssetType,
  UsefulLifeType,
  ScheduleType,
  LocationType
}