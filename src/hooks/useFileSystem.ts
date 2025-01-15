import * as FileSystem from 'expo-file-system';
const openFile = async (uri: string, fileName: string) => {
  FileSystem.cacheDirectory
  try {
    const fileUriOnDevice = `${FileSystem.documentDirectory}${fileName}`
    const fileInfo = await FileSystem.getInfoAsync(fileUriOnDevice)
    if (!fileInfo.exists) {
      // Tải file từ URI
      const downloadResult = await FileSystem.downloadAsync(uri, fileUriOnDevice)
        .then(({ uri }) => {
          console.log('Finished downloading to ', uri);
        })
        .catch(error => {
          console.error(error);
        })

      // if (downloadResult.status !== 200) {
      //   throw new Error('File download failed');
      // }
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