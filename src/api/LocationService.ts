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
      .catch((error) => console.error(error.response.data))
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
      .catch((error) => console.error(error.response.data))
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
      .catch((error) => console.error(error.response.data))
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
      .catch((error) => console.error(error.response.data))
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
      .catch((error) => console.error(error.response.data))
  },
}

export { LocationService }