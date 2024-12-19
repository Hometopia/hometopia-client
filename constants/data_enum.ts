const AssetStatusList = [
  "IN_USE",
  "BROKEN",
  "UNDER_REPAIR",
  "MAINTENANCE",
  "RESERVED"
]

const HouseType = [
  "HIGH_GRADE",
  "MID_HIGH_GRADE",
  "MID_GRADE",
  "LOW_GRADE",
]
const CategoryByUsefulLife = [
  "TV", "SOUND_SYSTEM", "PROJECTOR", "AIR_CONDITIONER", "LIGHTING",
  "AIR_PURIFIER", "STOVE", "MICROWAVE", "OVEN", "REFRIGERATOR",
  "WATER_PURIFIER", "RANGE_HOOD", "BED", "WARDROBE", "FAN",
  "NIGHT_LIGHT", "SHOWER", "BATHTUB", "SINK", "WATER_HEATER",
  "EXHAUST_FAN", "WASHING_MACHINE", "DRYER", "CLOTHES_RACK",
  "IRON", "LAPTOP", "MOBILE_PHONE"
]

const ScheduleTypes = ['MAINTENANCE', 'REPAIR']


export {
  AssetStatusList,
  CategoryByUsefulLife,
  ScheduleTypes,
  HouseType,
}