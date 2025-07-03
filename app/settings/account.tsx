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
  Image
} from 'react-native';
import { Camera, CreditCard as Edit3 } from 'lucide-react-native';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { getCurrentUser } from '@/utils/mockData';

export default function AccountScreen() {
  const currentUser = getCurrentUser();
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: '(11) 99999-9999',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: currentUser.avatar }}
              style={styles.avatar}
            />
            <View style={styles.cameraButton}>
              <Camera size={16} color={Colors.text.white} />
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
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
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
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
              textStyle={{ color: Colors.text.white }}
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
    backgroundColor: Colors.background.secondary,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
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
    borderColor: Colors.background.primary,
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
    fontWeight: '600',
    color: Colors.text.primary,
  },
  input: {
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveButton: {
    marginTop: 12,
  },
  passwordButton: {
    marginTop: 8,
  },
  dangerZone: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginBottom: 12,
  },
  deleteButton: {
    borderWidth: 0,
  },
});