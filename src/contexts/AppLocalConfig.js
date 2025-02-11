import * as SecureStore from 'expo-secure-store'

export const keyStorage = {
  THEME_MODE: 'THEME_MODE',
  ASSET_DISPLAY_MODE: 'ASSET_DISPLAY_MODE'
}

export const LocalConfig = {
  saveWithKey: async (key, value) => {
    if (!Object.values(keyStorage).includes(key)) {
      console.error("Failed to save paramater with wrong key")
      return
    }

    try {
      await SecureStore.setItemAsync(key, value)
    }
    catch {
      console.error("Failed to save paramater token with key: ", key)
    }
  },

  getWithKey: async (key) => {
    if (!Object.values(keyStorage).includes(key)) {
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
}