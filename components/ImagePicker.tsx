import React from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerOptions {
  onImageSelected: (uri: string) => void;
  onError?: (error: string) => void;
}

export const useImagePicker = ({ onImageSelected, onError }: ImagePickerOptions) => {
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para acessar a câmera.'
        );
        return false;
      }

      // Request media library permissions
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaPermission.status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para acessar a galeria de fotos.'
        );
        return false;
      }
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Image selected from gallery:', result.assets[0].uri);
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      onError?.('Erro ao selecionar imagem da galeria');
    }
  };

  const takePhoto = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Photo taken:', result.assets[0].uri);
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      onError?.('Erro ao tirar foto');
    }
  };

  const showImagePickerOptions = () => {
    if (Platform.OS === 'web') {
      // On web, only show gallery option
      pickImageFromGallery();
      return;
    }

    Alert.alert(
      'Alterar foto',
      'Escolha uma opção',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Câmera', onPress: takePhoto },
        { text: 'Galeria', onPress: pickImageFromGallery },
      ]
    );
  };

  return {
    showImagePickerOptions,
    pickImageFromGallery,
    takePhoto,
  };
};