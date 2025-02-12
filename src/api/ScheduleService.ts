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
      .catch((error) => console.error(error.response.data))
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
      .catch((error) => console.error(error.response.data))
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
      .catch((error) => console.error(error.response.data))
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
      .catch((error) => console.error(error.response.data))
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
      .catch((error) => console.error(error.response.data))
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
      .catch((error) => console.error(error.response.data))
  },
}

export { ScheduleService }