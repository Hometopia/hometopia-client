import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { CategoryByUsefulLife, UsefulLifeType } from './types/request';
import { LoginSession, tokenKeyStorage } from './SecureStore';


const RuleService = {
  getUsefulLife: async (category: string): Promise<UsefulLifeType | undefined> => {
    if (!CategoryByUsefulLife.includes(category)) {
      console.error("Category is not included")
      return
    }

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
        console.error(error.response.message)
        return undefined
      })
  }
}

export { UsefulLifeType }