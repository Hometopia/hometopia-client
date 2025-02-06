import * as ImageManipulator from 'expo-image-manipulator';

export function useImageManipulator() {
  const compressImage = async (uri: string, compress: number = 0.5) => {
    if (compress > 1) compress = 0.5
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [],
        {
          compress: compress,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      console.log("Đường dẫn ảnh đã nén:", result.uri);
      return result.uri;
    } catch (error) {
      console.error("Lỗi khi nén ảnh:", error);
      return null;
    }
  };

  return {
    compressImage
  }
}
