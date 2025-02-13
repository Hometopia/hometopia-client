import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { LoginSession, tokenKeyStorage } from './SecureStore';

const UserService = {
  getMyProfile: async (): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/users/my-profile`,
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

export { UserService }