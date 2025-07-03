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
import { Camera, MapPin, Phone, Mail, FileText } from 'lucide-react-native';
import Button from '@/components/Button';
import { Colors, Fonts } from '@/constants/Colors';
import { getCurrentUser, getBusinessEstablishment } from '@/utils/mockData';

export default function BusinessProfileScreen() {
  const currentUser = getCurrentUser();
  const establishment = currentUser.type === 'business' && currentUser.businessId 
    ? getBusinessEstablishment(currentUser.businessId) 
    : null;

  const [formData, setFormData] = useState({
    name: establishment?.name || '',
    category: establishment?.category || '',
    address: establishment?.address || '',
    phone: '(11) 99999-9999',
    email: currentUser.email,
    description: 'Estabelecimento com tradição e qualidade no atendimento.',
    workingHours: 'Segunda a Sexta: 8h às 18h\nSábado: 8h às 14h',
  });
  const [loading, setLoading] = useState(false);

  if (!establishment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Estabelecimento não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Sucesso', 'Informações do estabelecimento atualizadas com sucesso!');
    }, 1500);
  };

  const handleChangeImage = () => {
    Alert.alert(
      'Alterar foto',
      'Escolha uma opção',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Câmera', onPress: () => Alert.alert('Funcionalidade em desenvolvimento') },
        { text: 'Galeria', onPress: () => Alert.alert('Funcionalidade em desenvolvimento') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: establishment.imageUrl }}
              style={styles.establishmentImage}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={handleChangeImage}>
              <Camera size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <FileText size={16} color={Colors.textSecondary} />
                <Text style={styles.label}>Nome do estabelecimento</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Nome do seu negócio"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <FileText size={16} color={Colors.textSecondary} />
                <Text style={styles.label}>Categoria</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.category}
                onChangeText={(value) => handleInputChange('category', value)}
                placeholder="Tipo de estabelecimento"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <MapPin size={16} color={Colors.textSecondary} />
                <Text style={styles.label}>Endereço</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholder="Endereço completo"
                placeholderTextColor={Colors.textSecondary}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Phone size={16} color={Colors.textSecondary} />
                <Text style={styles.label}>Telefone</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="(11) 99999-9999"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Mail size={16} color={Colors.textSecondary} />
                <Text style={styles.label}>Email</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="email@estabelecimento.com"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <FileText size={16} color={Colors.textSecondary} />
                <Text style={styles.label}>Descrição</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Descreva seu estabelecimento..."
                placeholderTextColor={Colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <FileText size={16} color={Colors.textSecondary} />
                <Text style={styles.label}>Horário de funcionamento</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.workingHours}
                onChangeText={(value) => handleInputChange('workingHours', value)}
                placeholder="Horários de funcionamento..."
                placeholderTextColor={Colors.textSecondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <Button
              title="Salvar alterações"
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
            />
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Informações importantes</Text>
            <Text style={styles.infoText}>
              • As alterações podem levar alguns minutos para aparecer publicamente{'\n'}
              • Mantenha suas informações sempre atualizadas{'\n'}
              • Fotos de boa qualidade atraem mais clientes{'\n'}
              • Responda às avaliações para melhorar seu relacionamento
            </Text>
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  establishmentImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  cameraButton: {
    position: 'absolute',
    bottom: -8,
    right: '35%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  form: {
    gap: 20,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  textArea: {
    height: 100,
  },
  saveButton: {
    marginTop: 12,
  },
  infoSection: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});