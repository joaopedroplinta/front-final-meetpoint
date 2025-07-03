import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import Button from '@/components/Button';
import { Colors, Fonts } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  // Redirect to tabs if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading, router]);

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleRegister = () => {
    router.push('/auth/register-type');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  // Don't render the welcome screen if user is authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <MapPin size={50} color={Colors.primary} fill={Colors.primary} />
          <Text style={styles.logoText}>MeetPoint</Text>
        </View>
        
        <Text style={styles.title}>
          Encontre e avalie lugares incríveis
        </Text>
        
        <Text style={styles.subtitle}>
          Descubra os melhores estabelecimentos da sua região. Compartilhe suas experiências e encontre novos lugares especiais.
        </Text>

        <Image 
          source={{ uri: 'https://images.pexels.com/photos/4473398/pexels-photo-4473398.jpeg?auto=compress&cs=tinysrgb&w=800' }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonsContainer}>
        <Button 
          title="Entrar" 
          onPress={handleLogin} 
          style={styles.button}
        />
        <Button 
          title="Cadastrar" 
          onPress={handleRegister} 
          outline
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    fontFamily: Fonts.regular,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  buttonsContainer: {
    width: '100%',
    paddingBottom: 40,
  },
  button: {
    width: '100%',
    marginBottom: 16,
  },
});