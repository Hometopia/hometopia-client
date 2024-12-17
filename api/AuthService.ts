import { BASE_URL } from '@/constants/server';
import axios from 'axios';
import { LoginSession, tokenKeyStorage } from './SecureStore'

type LoginForm = {
  username: string, // username or email
  password: string,
}

type RegisterForm = {
  "username": string,
  "firstName": string,
  "lastName": string,
  "email": string,
  "password": string,
  "address": {
    "line": string,
    "provinceId": number,
    "districtId": number,
    "wardId": number
  }
}


const AuthService = {
  signIn: async (formData: LoginForm): Promise<any> => {
    return await axios.post(
      `${BASE_URL}/auth/sign-in`,
      {
        username: formData.username,
        password: formData.password,
        client_id: process.env.EXPO_PUBLIC_CLIENT_ID || 'client-id',
        client_secret: process.env.EXPO_PUBLIC_CLIENT_SECRET || 'client-secret',
        grant_type: 'password'
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    )
      .then((res) => {
        switch (res.status) {
          case 200: {
            LoginSession.saveTokenWithKey(tokenKeyStorage.ACCESS_KEY, res.data.access_token)
            LoginSession.saveTokenWithKey(tokenKeyStorage.REFRESH_KEY, res.data.refresh_token)
            console.log("sign in successfully")
            break
          }
          default: {
            console.log(res.statusText)
            return false
          }

        }
        return true
      })
      .catch(error => {
        if (error.status !== 401)
          console.error(error.response.data)
        else {
          return false
        }

      })
  },
  signUp: async (formData: RegisterForm): Promise<any> => {
    return await axios.post(
      `${BASE_URL}/auth/sign-up`,
      {
        "username": formData.username,
        "firstName": formData.firstName,
        "lastName": formData.lastName,
        "email": formData.email,
        "password": formData.password,
        "address": {
          "line": formData.address.line,
          "provinceId": formData.address.provinceId,
          "districtId": formData.address.districtId,
          "wardId": formData.address.wardId,
        }
      },
    )
      .then((res) => {
        switch (res.status) {
          case 201: {  // created

            break
          }
          default: {
            console.log(res.statusText)
          }

        }
        return res.data;
      })
      .catch(error => console.error(error.response.data))
  },

  signOut: () => {
    LoginSession.deleteAllToken()
  },

  //poor api for token testing 
  isSignIn: async (): Promise<any> => {
    return await axios.get(
      `${BASE_URL}/categories/suggested?houseType=HIGH_GRADE`, // pooooooooor
      {
        headers: {
          Authorization: `Bearer ${await LoginSession.getTokenWithKey(tokenKeyStorage.ACCESS_KEY)}`,
        }
      }
    )
      .then((res) => {
        switch (res.status) {
          case 200: {
            return true
          }
          default: {
            console.log(res.data)
            return false
          }
        }
      })
      .catch((error) => {
        if (error.response.data.status === 401) {
          return false
        }
        else {
          console.error(error.response.data)
        }
      })
  }
}

export { LoginForm, RegisterForm, AuthService }