import * as SecureStore from 'expo-secure-store'

const ACCESS_KEY = "MY_ACCESS_TOKEN"
const REFRESH_KEY = "MY_REFRESH_TOKEN"



const DEFAULT_USERNAME_KEY = "MY_USERNAME_ACCOUNT"
const DEFAULT_PASSWORD_KEY = "MY_PASSWORD_ACCOUNT"

const secureKeyStorage = { DEFAULT_USERNAME_KEY, DEFAULT_PASSWORD_KEY }

const tokenKeyStorage = { ACCESS_KEY, REFRESH_KEY }

const LoginSession = {
  saveTokenWithKey: async (key, value) => {
    if (!Object.values(tokenKeyStorage).includes(key)) // if not a token key
    {
      console.error("Failed to save token with wrong key")
      return
    }

    try {
      await SecureStore.setItemAsync(key, value)
    }
    catch {
      console.error("Failed to save token with key: ", key)
    }
  },

  getTokenWithKey: async (key) => {
    if (!Object.values(tokenKeyStorage).includes(key)) // if not a token key
    {
      console.error("Failed to get token with wrong key")
      return
    }
    try {
      const result = await SecureStore.getItemAsync(key);
      return result
    } catch {
      console.error("Failed to get token with key: ", key);
    }
  },

  deleteAllToken: async () => {
    // access token
    try {
      await SecureStore.deleteItemAsync(tokenKeyStorage.ACCESS_KEY)
    }
    catch {
      console.error("Failed to delete token with key: ", tokenKeyStorage.ACCESS_KEY);
    }

    // refresh token
    try {
      await SecureStore.deleteItemAsync(tokenKeyStorage.REFRESH_KEY)
    }
    catch {
      console.error("Failed to delete token with key: ", tokenKeyStorage.ACCESS_KEY);
    }
  }
}

const RequiredAuthenticationStore = {
  updateDefaultUsername: async (value) => {
    try {
      await SecureStore.setItemAsync(secureKeyStorage.DEFAULT_USERNAME_KEY, value, {
        requireAuthentication: true,
      })
    }
    catch {
      console.error("Failed to save username")
    }
  },

  updateDefaultPassword: async (value) => {
    try {
      await SecureStore.setItemAsync(secureKeyStorage.DEFAULT_PASSWORD_KEY, value, {
        requireAuthentication: true,
      })
    }
    catch {
      console.error("Failed to save password")
    }
  },

  getDefaultUsername: async () => {
    try {
      await SecureStore.getItemAsync(secureKeyStorage.DEFAULT_USERNAME_KEY, {
        requireAuthentication: true,
      })
    }
    catch {
      console.error("Failed to get username")
    }
  },

  getDefaultPassword: async () => {
    try {
      await SecureStore.getItemAsync(secureKeyStorage.DEFAULT_PASSWORD_KEY, {
        requireAuthentication: true,
      })
    }
    catch {
      console.error("Failed to get password")
    }
  },
}

export { tokenKeyStorage, LoginSession, RequiredAuthenticationStore }

