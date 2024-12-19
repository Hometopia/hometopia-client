import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { LoginSession, tokenKeyStorage } from './SecureStore';
import { CategoryType, CategoryUpdateType } from './types/request';


const CategoryService = {
  getSuggestedCategories: async (houseType: string): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/categories/suggested?houseType=${houseType}`,
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

  getAllCategory: async (): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/categories?all=true`,
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

  getCategoryList: async (page: number = 1, size: number = 10, parentId?: string, name?: string): Promise<any> => {
    let filter_param = `&filter=`
    filter_param += (!!parentId) ? `parent.id==${parentId}` : `parent=isnotnull=notnull`
    filter_param += ';'
    filter_param += (!!name) ? `name=ilike=${name}` : `name=isnotnull=notnull`

    if (!parentId && !name)
      filter_param = ''

    return await axios.get(
      `${BASE_URL}/categories?page=${page}&number=${size}${filter_param}`,
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

  createListCategories: async (categories: CategoryType[]): Promise<any> => {
    return await axios.post(
      `${BASE_URL}/categories`,
      {
        categories: categories
      },
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

  updateCategory: async (id: string, updateData: CategoryUpdateType): Promise<any> => {
    return await axios.put(
      `${BASE_URL}/categories`,
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

  deleteCategoryList: async (ids: string[]): Promise<any> => {
    const idsString = ids.join(',')

    return await axios.delete(
      `${BASE_URL}/categories?ids=${idsString}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => { return true })
      .catch((error) => console.error(error.response.message))
  },

  deleteCategory: async (id: string): Promise<any> => {
    return await axios.delete(
      `${BASE_URL}/categories/${id}`,
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => { return true })
      .catch((error) => console.error(error.response.message))
  }
}

export { CategoryService }