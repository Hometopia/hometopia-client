import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';

const useFileUploader = () => {
  const pickFile = async (): Promise<DocumentPicker.DocumentPickerAsset | undefined> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (!result.canceled) {
        return result.assets[0]
      }
    } catch (error) {
      console.error('Error picking files:', error);
    }
  }
  const pickImage = async (): Promise<DocumentPicker.DocumentPickerAsset | undefined> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
      });

      if (!result.canceled) {
        return result.assets[0]
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  }

  return {
    pickFile,
    pickImage,
  };
}

export default useFileUploader