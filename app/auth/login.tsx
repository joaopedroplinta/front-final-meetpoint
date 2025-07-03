import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  SafeAreaView, 
  Platform,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, User, Store } from 'lucide-react-native';
import Button from '@/components/Button';
import { Colors, Fonts } from '@/constants/Colors';
import { authenticateUser } from '@/utils/mockData';

export default function LoginScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [userType, setUserType] = useState<'customer' | 'business'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Erro', 'Por favor, informe um email válido');
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Erro', 'Por favor, informe sua senha');
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user = authenticateUser(formData.email, formData.password);
      
      if (user && user.type === userType) {
        setLoading(false);
        router.replace('/(tabs)');
      } else if (user && user.type !== userType) {
        setLoading(false);
        Alert.alert(
          'Tipo de conta incorreto', 
          `Esta conta é do tipo ${user.type === 'customer' ? 'Cliente' : 'Estabelecimento'}. Selecione o tipo correto.`
        );
      } else {
        setLoading(false);
        Alert.alert('Erro', 'Email ou senha incorretos');
      }
    }, 1500);
  };

  const getPlaceholderEmails = () => {
    if (userType === 'customer') {
      return 'joao@example.com ou maria@example.com';
    } else {
      return 'carlos@cafesublime.com ou ana@restauranteoliveira.com';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>
            Entre com suas credenciais para acessar sua conta
          </Text>

          <View style={styles.userTypeContainer}>
            <Text style={styles.userTypeLabel}>Tipo de conta</Text>
            <View style={styles.userTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'customer' && styles.activeUserTypeButton
                ]}
                onPress={() => setUserType('customer')}
              >
                <User size={20} color={userType === 'customer' ? Colors.white : Colors.primary} />
                <Text style={[
                  styles.userTypeButtonText,
                  userType === 'customer' && styles.activeUserTypeButtonText
                ]}>
                  Cliente
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'business' && styles.activeUserTypeButton
                ]}
                onPress={() => setUserType('business')}
              >
                <Store size={20} color={userType === 'business' ? Colors.white : Colors.primary} />
                <Text style={[
                  styles.userTypeButtonText,
                  userType === 'business' && styles.activeUserTypeButtonText
                ]}>
                  Estabelecimento
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder={getPlaceholderEmails()}
                placeholderTextColor={Colors.textSecondary}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
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

            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>
                Esqueceu sua senha?
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Não tem uma conta?{' '}
            <Text 
              style={styles.registerLink}
              onPress={() => router.push('/auth/register-type')}
            >
              Cadastre-se
            </Text>
          </Text>
        </View>
      </View>
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
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
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
  userTypeContainer: {
    marginBottom: 24,
  },
  userTypeLabel: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
    gap: 8,
  },
  activeUserTypeButton: {
    backgroundColor: Colors.primary,
  },
  userTypeButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  activeUserTypeButtonText: {
    color: Colors.white,
  },
  form: {
    gap: 24,
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
  loginButton: {
    marginTop: 8,
  },
  forgotPassword: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
    fontFamily: Fonts.medium,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
  },
  registerLink: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
  },
});