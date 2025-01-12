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
      .catch((error) => console.error(error.response.data))
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
      .catch((error) => console.error(error.response.data))
  },

  getCategoryList: async (
    page: number = 1,
    size: number = 10,
    parentId?: string,
    name?: string): Promise<any> => {
    let filter_param = `&filter=`
    filter_param += (!!parentId) ? `parent.id==${parentId}` : `parent=isnotnull=notnull`
    filter_param += ';'
    filter_param += (!!name) ? `name=ilike=${name}` : `name=isnotnull=notnull`

    // if (!parentId && !name)
    //   filter_param = ''
    // console.debug(`${BASE_URL}/categories?all=true${filter_param}`)
    return await axios.get(
      `${BASE_URL}/categories?page=${page}&size=${size}${filter_param}`,
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

  getParentList: async (): Promise<any> => {

    return await axios.get(
      `${BASE_URL}/categories?all=true&filter=parent=isnull=null;name=isnotnull=notnull`,
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
      .catch((error) => console.error(error.response.data))
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
      .catch((error) => console.error(error.response.data))
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
      .catch((error) => console.error(error.response.data))
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
      .catch((error) => console.error(error.response.data))
  }
}

export { CategoryService }