const AssetStatusList = [
  "IN_USE",
  "UNDER_REPAIR",
  "MAINTENANCE",
  "RESERVED",
  "BROKEN",
  'FOR_LOAN',
  'SOLD'
]

const AssetStatusListMapToDisplayText = {
  "IN_USE": "Đang sử dụng",
  "BROKEN": "Đang hỏng",
  "UNDER_REPAIR": "Đang sửa",
  "MAINTENANCE": "Đang bảo trì",
  "RESERVED": "Dự phòng",
  'FOR_LOAN': "Cho mượn",
  'SOLD': "Đã thanh lý"
}

const HouseType = [
  "HIGH_GRADE",
  "MID_HIGH_GRADE",
  "MID_GRADE",
  "LOW_GRADE",
]
const HouseTypeName = {
  ['HIGH_GRADE']: "Nhà cấp 1",
  ['MID_HIGH_GRADE']: "Nhà cấp 2",
  ['MID_GRADE']: "Nhà cấp 3",
  ['LOW_GRADE']: "Nhà cấp 4",
}
const CategoryByUsefulLife = [
  "TV", "SOUND_SYSTEM", "PROJECTOR", "AIR_CONDITIONER", "LIGHTING",
  "AIR_PURIFIER", "STOVE", "MICROWAVE", "OVEN", "REFRIGERATOR",
  "WATER_PURIFIER", "RANGE_HOOD", "BED", "WARDROBE", "FAN",
  "NIGHT_LIGHT", "SHOWER", "BATHTUB", "SINK", "WATER_HEATER",
  "EXHAUST_FAN", "WASHING_MACHINE", "DRYER", "CLOTHES_RACK",
  "IRON", "LAPTOP", "MOBILE_PHONE"
]

const ScheduleType = {
  'MAINTENANCE': 'MAINTENANCE',
  'REPAIR': 'REPAIR'
}
const ScheduleTypeName = {
  'MAINTENANCE': 'Bảo trì',
  'REPAIR': 'Sửa chữa'
}
const MonthName = {
  january: 'T1',
  february: 'T2',
  march: 'T3',
  april: 'T4',
  may: 'T5',
  june: 'T6',
  july: 'T7',
  august: 'T8',
  september: 'T9',
  october: 'T10',
  november: 'T11',
  december: 'T12',
}


export {
  AssetStatusList,
  CategoryByUsefulLife,
  ScheduleType,
  ScheduleTypeName,
  HouseType,
  HouseTypeName,
  AssetStatusListMapToDisplayText,
  MonthName
}