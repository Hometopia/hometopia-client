import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { LoginSession, tokenKeyStorage } from './SecureStore';


const BrandService = {
  getSuggestedListBrand: async (keyword: string): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/brands?all=true&filter=${keyword}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    ).then((res) => {
      return res.data
    })
      .catch((error) => {
        console.error(error.response.data)
      })
  }
}

export { BrandService }