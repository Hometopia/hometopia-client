import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { LoginSession, tokenKeyStorage } from './SecureStore';
import { ScheduleType } from './types/request';

const ScheduleService = {
  getListSchedule: async (type: string): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/schedules?filter=type==${type}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => {
        return res.data
      })
      .catch((error) => console.error(error.response.message))
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
      .catch((error) => console.error(error.response.message))
  },

  updateSchedule: async (scheduleData: ScheduleType): Promise<any> => {
    return await axios.put(
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
      .catch((error) => console.error(error.response.message))
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
      .catch((error) => console.error(error.response.message))
  },
}

export { ScheduleService }