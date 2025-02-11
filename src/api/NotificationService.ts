import { BASE_URL } from '@/constants/server';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { convertToBlob } from '@/helpers/file';
import { FileUploadResponseType } from './types/response';
import { removeSpecialCharacters } from '@/helpers/string';
import { LoginSession, tokenKeyStorage } from './SecureStore';

const NotificationService = {
  getListNotification: async (
    page: number = 1,
    size: number = 15,
    isRead?: boolean
  ): Promise<any> => {
    const filter = isRead === undefined ? `` : `&filter=isRead==${isRead}`
    console.log(`${BASE_URL}/notifications?page=${page}&size=${size}${filter}`)
    return await axios.get(
      `${BASE_URL}/notifications?page=${page}&size=${size}${filter}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => res.data)
      .catch((error) => {
        // console.error(error.response.data)
        return null
      })
  },
  markAsRead: async (ids: string[]): Promise<any> => {
    return await axios.patch(
      `${BASE_URL}/notifications?ids=${ids.join(',')}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => res.data)
      .catch((error) => {
        // console.error(error.response.data)
        return null
      })
  },
}

export { NotificationService }