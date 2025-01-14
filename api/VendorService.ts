import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { LoginSession, tokenKeyStorage } from './SecureStore';

const VendorService = {
  getListVendor: async (
    page: number = 1,
    size: number = 10,
    category: string,
    lat: number,
    lon: number
  ): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/vendors?page=${page}&size=${size}&category=${category}&lat=${lat}&lon=${lon}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        console.error(error.response.data)
        return undefined
      })
  },

}

export { VendorService }