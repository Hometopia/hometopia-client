import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { UsefulLifeType } from './types/request';
import { LoginSession, tokenKeyStorage } from './SecureStore';
import { CategoryByUsefulLife } from '@/constants/data_enum';


const RuleService = {
  getUsefulLife: async (category: string): Promise<UsefulLifeType | undefined> => {
    return await axios.get(
      `${BASE_URL}/rule/useful-life?category=${category}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => {
        return res.data as UsefulLifeType
      })
      .catch((error) => {
        console.error(error.response.data)
        return undefined
      })
  },

}

export { UsefulLifeType }