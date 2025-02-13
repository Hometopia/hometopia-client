import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { LoginSession, tokenKeyStorage } from './SecureStore';
import { LocationType } from './types/request';

const LocationService = {
  getListLocation: async (): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/locations?all=true`,
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
  getLocationById: async (id: string): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/locations/${id}`,
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

  createLocation: async (payload: LocationType): Promise<any> => {
    return await axios.post(
      `${BASE_URL}/locations`,
      payload,
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

  updateLocation: async (id: string, payload: LocationType): Promise<any> => {
    return await axios.put(
      `${BASE_URL}/locations/${id}`,
      payload,
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

  deleteLocation: async (id: string): Promise<any> => {
    return await axios.delete(
      `${BASE_URL}/locations/${id}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => true)
      .catch((error) => {
        return undefined
      })
  },
}

export { LocationService }