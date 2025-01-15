import { BASE_URL } from '@/constants/server';
import axios from 'axios';

const AddressService = {
  getProvinceList: async (): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/provinces`
    )
      .then((res) => {
        return res.data
      })
      .catch((error) => console.error(error.response.data))
  },
  getDistrictList: async (provinceId: string): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/districts?provinceId=${provinceId}`
    )
      .then((res) => {
        return res.data
      })
      .catch((error) => console.error(error.response.data))
  },
  getWardList: async (districtId: string): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/wards?districtId=${districtId}`
    )
      .then((res) => {
        return res.data
      })
      .catch((error) => console.error(error.response.data))
  },

}

export { AddressService }