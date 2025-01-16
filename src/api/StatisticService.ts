import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { UsefulLifeType } from './types/request';
import { LoginSession, tokenKeyStorage } from './SecureStore';


const StatisticService = {
  getCostStatisticsByMonth: async (year: string): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/statistics/by-month?year=${year}`,
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

export { StatisticService }