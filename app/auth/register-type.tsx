import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Store, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function RegisterTypeScreen() {
  const router = useRouter();

  const handleCustomerRegister = () => {
    router.push('/auth/register-customer');
  };

  const handleBusinessRegister = () => {
    router.push('/auth/register-business');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Como você quer se cadastrar?</Text>
          <Text style={styles.subtitle}>
            Escolha o tipo de conta que melhor se adequa ao seu perfil
          </Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.optionCard}
              onPress={handleCustomerRegister}
              activeOpacity={0.8}
            >
              <View style={styles.optionIconContainer}>
                <User size={40} color={Colors.primary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Cliente</Text>
                <Text style={styles.optionDescription}>
                  Avalie estabelecimentos e compartilhe suas experiências
                </Text>
              </View>
              <ArrowRight size={24} color={Colors.text.light} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionCard}
              onPress={handleBusinessRegister}
              activeOpacity={0.8}
            >
              <View style={styles.optionIconContainer}>
                <Store size={40} color={Colors.primary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Estabelecimento</Text>
                <Text style={styles.optionDescription}>
                  Cadastre seu negócio e receba avaliações dos clientes
                </Text>
              </View>
              <ArrowRight size={24} color={Colors.text.light} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Já tem uma conta?{' '}
            <Text 
              style={styles.loginLink}
              onPress={() => router.push('/auth/login')}
            >
              Entrar
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
    backgroundColor: Colors.background.secondary,
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
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  loginLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
});