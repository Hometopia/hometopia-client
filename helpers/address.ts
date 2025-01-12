import { AddressType } from "@/api/types/response";

const parseAdress = (address: AddressType) => {
  return `${address.line}, ${address.ward.name}, ${address.district.name}, ${address.province.name}`
}

export { parseAdress }