import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { LoginSession, tokenKeyStorage } from './SecureStore';
import { AssetType } from './types/request';
import { AssetLifecycleResponseType } from './types/response';

const AssetService = {
  getAssetList: async (
    page: number = 1,
    size: number = 10,
    categoryId?: string,
    status?: string,
    name?: string,
  ): Promise<any> => {
    let filter_param = '&filter='
    filter_param += (!!name) ? `name=ilike=${name};` : ``
    filter_param += (!!categoryId) ? `category.id==${categoryId};` : ``
    filter_param += (!!status) ? `status==${status}` : ``
    filter_param = filter_param.replace(/[;]$/, '') // format
    if (!categoryId && !name && !status)
      filter_param = ''

    return await axios.get(
      `${BASE_URL}/assets?page=${page}&size=${size}${filter_param}`,
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
  getAllAsset: async (): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/assets?all=true`,
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
      .catch((error) => console.error(error.response.data))
  },

  createAsset: async (assetData: AssetType): Promise<any> => {
    console.log('assetData', assetData)
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
      .catch((error) => console.error(error.response.data))
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
      .catch((error) => console.error(error.response.data))
  },

  deleteListAsset: async (assetIds: string[]): Promise<any> => {
    return await axios.delete(
      `${BASE_URL}/assets?ids=${assetIds.join(',')}`,
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
      .catch((error) => console.error(error.response.data))
  },

  getAssetLifecycle: async (assetId: string): Promise<AssetLifecycleResponseType | any> => {
    return await axios.get(
      `${BASE_URL}/asset-life-cycles?filter=asset.id==${assetId}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then(res => {
        return res.data.data
      })
      .catch(err => {
        console.error(err.response.data)
        return err.response.data
      })
  }
}

export { AssetService }