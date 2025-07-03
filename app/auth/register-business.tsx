import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  SafeAreaView, 
  Platform,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, ChevronDown } from 'lucide-react-native';
import Button from '@/components/Button';
import { Colors, Fonts } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api';

export default function RegisterBusinessScreen() {
  const router = useRouter();
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    cnpj: '',
    category: '',
    address: '',
    description: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [categories, setCategories] = useState<{ id: number; nome: string }[]>([]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      setCategoriesError(null);
      console.log('Loading categories...');
      
      const tipos = await apiService.getTipos();
      console.log('Categories loaded:', tipos);
      
      if (tipos && tipos.length > 0) {
        setCategories(tipos);
      } else {
        throw new Error('No categories returned from API');
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategoriesError('Erro ao carregar categorias');
      
      const fallbackCategories = [
        { id: 1, nome: 'Restaurante' },
        { id: 2, nome: 'Café' },
        { id: 3, nome: 'Bar' },
        { id: 4, nome: 'Padaria' },
        { id: 5, nome: 'Mercado' },
        { id: 6, nome: 'Farmácia' },
        { id: 7, nome: 'Loja' },
        { id: 8, nome: 'Serviços' },
        { id: 9, nome: 'Outros' }
      ];
      
      console.log('Using fallback categories:', fallbackCategories);
      setCategories(fallbackCategories);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (error) {
      clearError();
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategorySelect = (category: { id: number; nome: string }) => {
    console.log('Category selected:', category);
    handleInputChange('category', category.nome);
    setShowCategoryPicker(false);
  };

  const retryLoadCategories = () => {
    console.log('Retrying to load categories...');
    loadCategories();
  };

  const validateForm = () => {
    if (!formData.businessName.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome do estabelecimento');
      return false;
    }
    if (!formData.ownerName.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome do responsável');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Erro', 'Por favor, informe um email válido');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Erro', 'Por favor, informe o telefone');
      return false;
    }
    if (!formData.cnpj.trim()) {
      Alert.alert('Erro', 'Por favor, informe o CNPJ');
      return false;
    }
    if (!formData.category.trim()) {
      Alert.alert('Erro', 'Por favor, selecione uma categoria');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Erro', 'Por favor, informe o endereço');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register({
        name: formData.ownerName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        userType: 'business',
        businessData: {
          businessName: formData.businessName,
          cnpj: formData.cnpj,
          category: formData.category,
          address: formData.address,
          description: formData.description
        }
      });
      
      Alert.alert(
        'Cadastro realizado!',
        'Seu estabelecimento foi cadastrado com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      console.log('Registration failed:', error);
    }
  };

  console.log('Current state:', {
    loadingCategories,
    categoriesError,
    categoriesCount: categories.length,
    selectedCategory: formData.category,
    showCategoryPicker
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Cadastrar Estabelecimento</Text>
          <Text style={styles.subtitle}>
            Preencha os dados do seu negócio para começar a receber avaliações
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={clearError} style={styles.errorCloseButton}>
                <Text style={styles.errorCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do estabelecimento</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o nome do seu negócio"
                placeholderTextColor={Colors.textSecondary}
                value={formData.businessName}
                onChangeText={(value) => handleInputChange('businessName', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do responsável</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome completo"
                placeholderTextColor={Colors.textSecondary}
                value={formData.ownerName}
                onChangeText={(value) => handleInputChange('ownerName', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o email do estabelecimento"
                placeholderTextColor={Colors.textSecondary}
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
                placeholder="(11) 99999-9999"
                placeholderTextColor={Colors.textSecondary}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CNPJ</Text>
              <TextInput
                style={styles.input}
                placeholder="00.000.000/0000-00"
                placeholderTextColor={Colors.textSecondary}
                value={formData.cnpj}
                onChangeText={(value) => handleInputChange('cnpj', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoria</Text>
              
              {loadingCategories ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.loadingText}>Carregando categorias...</Text>
                </View>
              ) : categoriesError && categories.length === 0 ? (
                <View style={styles.categoryErrorContainer}>
                  <Text style={styles.categoryErrorText}>{categoriesError}</Text>
                  <TouchableOpacity onPress={retryLoadCategories} style={styles.retryButton}>
                    <Text style={styles.retryText}>Tentar novamente</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <TouchableOpacity 
                    style={styles.selectContainer}
                    onPress={() => {
                      console.log('Category picker toggled');
                      setShowCategoryPicker(!showCategoryPicker);
                    }}
                  >
                    <Text style={[
                      styles.selectText,
                      !formData.category && styles.placeholderText
                    ]}>
                      {formData.category || 'Selecione a categoria'}
                    </Text>
                    <ChevronDown 
                      size={20} 
                      color={Colors.textSecondary}
                      style={[
                        styles.chevronIcon,
                        showCategoryPicker && styles.chevronIconRotated
                      ]}
                    />
                  </TouchableOpacity>
                  
                  {showCategoryPicker && (
                    <View style={styles.categoryPicker}>
                      <ScrollView style={styles.categoryPickerScroll} nestedScrollEnabled>
                        {categories.map((category) => (
                          <TouchableOpacity
                            key={category.id}
                            style={[
                              styles.categoryOption,
                              formData.category === category.nome && styles.selectedCategoryOption
                            ]}
                            onPress={() => handleCategorySelect(category)}
                          >
                            <Text style={[
                              styles.categoryOptionText,
                              formData.category === category.nome && styles.selectedCategoryOptionText
                            ]}>
                              {category.nome}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                  
                  {categoriesError && categories.length > 0 && (
                    <Text style={styles.fallbackText}>
                      ⚠️ Usando categorias padrão (erro na conexão)
                    </Text>
                  )}
                </>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Endereço completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Rua, número, bairro, cidade"
                placeholderTextColor={Colors.textSecondary}
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva seu estabelecimento..."
                placeholderTextColor={Colors.textSecondary}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Digite sua senha"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={Colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirme sua senha"
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={Colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={Colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title="Cadastrar estabelecimento"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
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
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
    lineHeight: 24,
    fontFamily: Fonts.regular,
  },
  errorContainer: {
    backgroundColor: `${Colors.error}20`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    fontFamily: Fonts.medium,
    flex: 1,
  },
  errorCloseButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorCloseText: {
    color: Colors.error,
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  form: {
    gap: 20,
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
  textArea: {
    height: 100,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
  },
  categoryErrorContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  categoryErrorText: {
    fontSize: 14,
    color: Colors.error,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  selectText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: Fonts.regular,
    flex: 1,
  },
  placeholderText: {
    color: Colors.textSecondary,
  },
  chevronIcon: {
    marginLeft: 8,
    transition: 'transform 0.2s ease',
  },
  chevronIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  categoryPicker: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryPickerScroll: {
    maxHeight: 200,
  },
  categoryOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedCategoryOption: {
    backgroundColor: `${Colors.primary}10`,
  },
  categoryOptionText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: Fonts.regular,
  },
  selectedCategoryOptionText: {
    color: Colors.primary,
    fontFamily: Fonts.medium,
  },
  fallbackText: {
    fontSize: 12,
    color: Colors.warning,
    fontFamily: Fonts.regular,
    marginTop: 4,
    textAlign: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: Fonts.regular,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  registerButton: {
    marginTop: 12,
  },
});