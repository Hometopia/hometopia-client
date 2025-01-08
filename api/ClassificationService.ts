import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { LoginSession, tokenKeyStorage } from './SecureStore';


const ClassificationService = {
  getPredictCategoryByImg: async (fileName: string): Promise<any> => {
    return await axios.post(
      `${BASE_URL}/classification/predict`,
      { url: `${BASE_URL}/files?fileName=${fileName}` },
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
        // console.error(error.response.data)
        return error.response.data
      })
  }
}

export { ClassificationService }