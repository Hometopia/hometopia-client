import { BASE_URL } from '@/constants/server';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { convertToBlob } from '@/helpers/file';
import { FileUploadResponseType } from './types/response';
import { removeSpecialCharacters } from '@/helpers/string';

const FileService = {
  getFile: async (fileName: string | undefined): Promise<any> => {
    if (!fileName) return null
    return await axios.get(
      `${BASE_URL}/files?fileName=${fileName}`,
    )
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        // console.error(error.response.data)
        return null
      })
  },

  uploadFiles: async (files: DocumentPicker.DocumentPickerAsset[]): Promise<any> => {
    const formData = new FormData()

    files.forEach((file) => {
      const tranfFile = {
        uri: file.uri,
        name: removeSpecialCharacters(file.name),
        type: file.mimeType,
        size: file.size,
      }
      formData.append('files', tranfFile as any);

    });
    // console.warn('formData', formData)
    return await axios.post(
      `${BASE_URL}/files`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        return error
      })
  },
}

export { FileService }