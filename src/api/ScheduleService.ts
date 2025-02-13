import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { LoginSession, tokenKeyStorage } from './SecureStore';
import { ScheduleType } from './types/request';
import { dateToISOString, getMonthStartEnd } from '@/helpers/time';

const ScheduleService = {
  getListSchedule: async (type?: string): Promise<any> => {
    const filter = type ? `&filter=type==${type}` : ``
    return await axios.get(
      `${BASE_URL}/schedules?all=true${filter}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => res.data)
      .catch((error) => console.error(error.response.data))
  },

  getScheduleHistory: async (asssetId: string, type: string, date: Date): Promise<any> => {
    const tranfDate: string = dateToISOString(date)
    return await axios.get(
      `${BASE_URL}/schedules?all=true&filter=asset.id==${asssetId};type==${type};end=lt=${tranfDate}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => res.data)
      .catch((error) => {
        console.log(error.response.data)
        return 'error'
      })
  },

  getSchedule: async (id: string): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/schedules?filter=id==${id}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => res.data)
      .catch((error) => undefined)
  },

  getUpcomingSchedule: async (asssetId: string, type: string, date: Date): Promise<any> => {
    const tranfDate: string = dateToISOString(date)
    return await axios.get(
      `${BASE_URL}/schedules?all=true&filter=asset.id==${asssetId};type==${type};start=gt=${tranfDate}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => res.data)
      .catch((error) => {
        return undefined
      })
  },

  getMonthSchedules: async (type: string, year: number, month: number): Promise<any> => {
    const startDate: string = dateToISOString(getMonthStartEnd(year, month).start)
    const endDate: string = dateToISOString(getMonthStartEnd(year, month).end)
    return await axios.get(
      `${BASE_URL}/schedules?all=true&filter=type==${type};start=gt=${startDate};start=lt=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => res.data)
      .catch((error) => {
        return undefined
      })
  },

  createSchedule: async (scheduleData: ScheduleType): Promise<any> => {
    return await axios.post(
      `${BASE_URL}/schedules`,
      scheduleData,
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
        return undefined
      })
  },

  updateSchedule: async (id: string, scheduleData: ScheduleType): Promise<any> => {
    return await axios.put(
      `${BASE_URL}/schedules/${id}`,
      scheduleData,
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
        return undefined
      })
  },

  deleteSchedule: async (scheduleId: string): Promise<any> => {
    return await axios.delete(
      `${BASE_URL}/schedules/${scheduleId}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => {
        return true
      })
      .catch((error) => {
        return undefined
      })
  },

  getSuggestedMaintenance: async (id: string, lat: number, lon: number): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/schedules/suggested-maintenance-schedule/${id}?lat=${lat}&lon=${lon}`,
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
        return undefined
      })
  }
}

export { ScheduleService }