import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  SafeAreaView, 
  Platform,
  Alert,
  Image,
  TouchableOpacity
} from 'react-native';
import { Camera } from 'lucide-react-native';
import Button from '@/components/Button';
import { Colors, Fonts } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useImagePicker } from '@/components/ImagePicker';

export default function AccountScreen() {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '', // Remove pre-filled phone data
  });
  const [profileImage, setProfileImage] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const { showImagePickerOptions } = useImagePicker({
    onImageSelected: (uri: string) => {
      setProfileImage(uri);
      // Update user avatar in context
      updateUser({ avatar: uri });
    },
    onError: (error: string) => {
      Alert.alert('Erro', error);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setLoading(true);
    
    // Simulate API call to update user data
    setTimeout(() => {
      setLoading(false);
      // Update user data in context
      updateUser({
        name: formData.name,
        email: formData.email,
      });
      Alert.alert('Sucesso', 'Informações atualizadas com sucesso!');
    }, 1500);
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Alterar senha',
      'Um email com instruções para alterar sua senha será enviado para ' + formData.email,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Enviar', onPress: () => Alert.alert('Email enviado!') },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Usuário não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profileImage }}
              style={styles.avatar}
            />
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={showImagePickerOptions}
              activeOpacity={0.8}
            >
              <Camera size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
                placeholder="Digite seu nome completo"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Digite seu email"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                placeholder="(11) 99999-9999"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <Button
              title="Salvar alterações"
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
            />

            <Button
              title="Alterar senha"
              onPress={handleChangePassword}
              outline
              style={styles.passwordButton}
            />
          </View>

          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>Zona de perigo</Text>
            <Button
              title="Excluir conta"
              onPress={() => Alert.alert('Funcionalidade em desenvolvimento')}
              style={[styles.deleteButton, { backgroundColor: Colors.error }]}
              textStyle={{ color: Colors.white }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundProfile,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.textSecondary,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  form: {
    gap: 20,
    marginBottom: 40,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    fontFamily: Fonts.regular,
  },
  saveButton: {
    marginTop: 12,
  },
  passwordButton: {
    marginTop: 8,
  },
  dangerZone: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.error,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dangerTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.error,
    marginBottom: 12,
  },
  deleteButton: {
    borderWidth: 0,
  },
});