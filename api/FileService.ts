import { BASE_URL } from '@/constants/server';
import axios from 'axios';

const FileService = {
  getFile: async (fileName: string): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/files?fileName=${fileName}`,
    )
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        // console.error(error.response.message)
        return null
      })
  },

  uploadFiles: async (files: File | null): Promise<any> => {
    return await axios.post(
      `${BASE_URL}/files`, files
    )
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        console.error(error.response.message)
        return null
      })
  },
}

export { FileService }