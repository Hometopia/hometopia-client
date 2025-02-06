import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { ScheduleType, UsefulLifeType } from './types/request';
import { LoginSession, tokenKeyStorage } from './SecureStore';


const StatisticService = {
  getOverralStatistics: async (): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/statistics/overall-statistics`,
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
  getCostStatisticsByMonth: async (year: string, type: 'MAINTENANCE' | 'REPAIR'): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/statistics/by-month?year=${year}&type=${type}`,
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
  getCostStatisticsByYear: async (year: string, type: 'MAINTENANCE' | 'REPAIR'): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/statistics/by-year?years=${year}&type=${type}`,
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
  getAssetStatisticsByYear: async (year: string): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/statistics/asset-statistics?year=${year}`,
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