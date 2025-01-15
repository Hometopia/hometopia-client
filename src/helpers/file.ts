import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export const convertToBlob = async (file: DocumentPicker.DocumentPickerAsset): Promise<Blob | any> => {
  try {
    if (!file.uri) {
      console.error('Invalid file URI');
    }

    // Đọc nội dung file từ URI
    const fileContent = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const byteCharacters = atob(fileContent);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: file.mimeType });
    return blob;
  } catch (error) {
    console.error('Error converting file to Blob:', error);
    return null;
  }
};

