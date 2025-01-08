import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const openFile = async (uri: string) => {
  FileSystem.cacheDirectory
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      console.error('File does not exist at given URI:', uri);
      return;
    }

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      console.log('Sharing is not available on this platform.');
    }
  } catch (error) {
    console.error('Error opening file:', error);
  }
}

const useFileSystem = () => {
  return {
    openFile
  }
}
export default useFileSystem