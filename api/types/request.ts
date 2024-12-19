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
  subCategories: CategoryType[]
}
type CategoryUpdateType = {
  name: string,
  description: string,
  parentId: string,
  subCategoryIds: string[]
}
//#endregion

//#region Aset
type AssetType = {
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
  categoryId: string
}

//#endregion

//#region File
type FileInfoType = {
  originalFileName: string,
  fileName: string,
  fileExtension: string,
  mimeType: string,
  bucket: string,
  path: string,
}
//#endregion

//#region Rule
//poooooor
const CategoryByUsefulLife = [
  "TV", "SOUND_SYSTEM", "PROJECTOR", "AIR_CONDITIONER", "LIGHTING",
  "AIR_PURIFIER", "STOVE", "MICROWAVE", "OVEN", "REFRIGERATOR",
  "WATER_PURIFIER", "RANGE_HOOD", "BED", "WARDROBE", "FAN",
  "NIGHT_LIGHT", "SHOWER", "BATHTUB", "SINK", "WATER_HEATER",
  "EXHAUST_FAN", "WASHING_MACHINE", "DRYER", "CLOTHES_RACK",
  "IRON", "LAPTOP", "MOBILE_PHONE"
]
type UsefulLifeType = {
  category: string,
  usefulLife: number,
}
//#endregion

//#region Schedule
const ScheduleTypes = ['MAINTENANCE', 'REPAIR']

type ScheduleType = {
  title: string,
  start: string,
  end: string,
  vendor: string,
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
  FileInfoType,
  CategoryByUsefulLife,
  UsefulLifeType,
  ScheduleTypes,
  ScheduleType
}