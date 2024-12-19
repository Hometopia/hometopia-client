import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { LoginSession, tokenKeyStorage } from './SecureStore';
import { AssetType } from './types/request';

const AssetService = {
  getAssetList: async (
    page: number = 1,
    size: number = 10,
    categoryId?: string,
    status?: string,
    name?: string,
  ): Promise<any> => {
    let filter_param = `&filter=`
    filter_param += (!!name) ? `name=ilike=${name}` : `name=isnotnull=notnull`
    filter_param += ';'
    filter_param += (!!categoryId) ? `category.id==${categoryId}` : `category=isnotnull=notnull`

    if (!categoryId && !name)
      filter_param = ''

    return await axios.get(
      `${BASE_URL}/assets?page=${page}&number=${size}${filter_param}`,
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

  getAsset: async (assetId: string): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/assets/${assetId}`,
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

  createAsset: async (assetData: AssetType): Promise<any> => {
    return await axios.post(
      `${BASE_URL}/assets`,
      assetData,
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

  deleteAsset: async (assetId: string): Promise<any> => {
    return await axios.delete(
      `${BASE_URL}/assets/${assetId}`,
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

  deleteListAsset: async (assetIds: string[]): Promise<any> => {
    return await axios.delete(
      `${BASE_URL}/assets/${assetIds.join(',')}`,
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

  updateAsset: async (assetId: string, updateData: AssetType): Promise<any> => {
    return await axios.put(
      `${BASE_URL}/assets/${assetId}`,
      updateData,
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
}

export { AssetService }