import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, Star, Settings, Bell, Shield, CircleHelp as HelpCircle, Store } from 'lucide-react-native';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import { Colors, Fonts } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  
  // Calculate content padding to avoid tab bar overlap
  const getContentPaddingBottom = () => {
    const baseTabHeight = 60;
    const bottomInset = insets.bottom;
    
    if (Platform.OS === 'ios') {
      return baseTabHeight + bottomInset + 16;
    } else if (Platform.OS === 'android') {
      return baseTabHeight + Math.max(bottomInset, 8) + 16;
    } else {
      return baseTabHeight + 16;
    }
  };

  const contentPaddingBottom = getContentPaddingBottom();
  
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Usuário não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isBusinessUser = user.type === 'business';

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/welcome');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      router.replace('/welcome');
    }
  };

  const businessMenuItems = [
    { 
      icon: <Store size={24} color={Colors.textSecondary} />, 
      title: 'Perfil do Estabelecimento', 
      subtitle: 'Editar informações do negócio',
      onPress: () => router.push('/settings/business-profile')
    },
    { 
      icon: <Settings size={24} color={Colors.textSecondary} />, 
      title: 'Configurações', 
      subtitle: 'Preferências, notificações e privacidade',
      onPress: () => router.push('/settings')
    },
    { 
      icon: <Bell size={24} color={Colors.textSecondary} />, 
      title: 'Notificações', 
      subtitle: 'Gerenciar notificações do aplicativo',
      onPress: () => router.push('/settings/notifications')
    },
    { 
      icon: <Shield size={24} color={Colors.textSecondary} />, 
      title: 'Privacidade', 
      subtitle: 'Controle seus dados e privacidade',
      onPress: () => router.push('/settings/privacy')
    },
    { 
      icon: <HelpCircle size={24} color={Colors.textSecondary} />, 
      title: 'Ajuda', 
      subtitle: 'Perguntas frequentes e suporte',
      onPress: () => router.push('/settings/help')
    },
  ];

  const customerMenuItems = [
    { 
      icon: <Settings size={24} color={Colors.textSecondary} />, 
      title: 'Configurações', 
      subtitle: 'Preferências, notificações e privacidade',
      onPress: () => router.push('/settings')
    },
    { 
      icon: <Bell size={24} color={Colors.textSecondary} />, 
      title: 'Notificações', 
      subtitle: 'Gerenciar notificações do aplicativo',
      onPress: () => router.push('/settings/notifications')
    },
    { 
      icon: <Shield size={24} color={Colors.textSecondary} />, 
      title: 'Privacidade', 
      subtitle: 'Controle seus dados e privacidade',
      onPress: () => router.push('/settings/privacy')
    },
    { 
      icon: <HelpCircle size={24} color={Colors.textSecondary} />, 
      title: 'Ajuda', 
      subtitle: 'Perguntas frequentes e suporte',
      onPress: () => router.push('/settings/help')
    },
  ];

  const menuItems = isBusinessUser ? businessMenuItems : customerMenuItems;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: contentPaddingBottom }}
      >
        <View style={styles.header}>
          <Avatar
            uri={user.avatar}
            name={user.name}
            size={100}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {isBusinessUser && (
            <View style={styles.businessBadge}>
              <Store size={16} color={Colors.primary} />
              <Text style={styles.businessName}>Estabelecimento</Text>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>
              {isBusinessUser ? 'Avaliações' : 'Avaliações'}
            </Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.ratingStatContainer}>
              <Text style={styles.statNumber}>0.0</Text>
              <Star size={16} color={Colors.textSecondary} style={styles.ratingStar} />
            </View>
            <Text style={styles.statLabel}>Média</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                {item.icon}
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Sair"
          onPress={handleLogout}
          outline
          style={styles.logoutButton}
        />
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
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
    marginBottom: 8,
  },
  businessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  businessName: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.background,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
    padding: 12,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
  },
  ratingStatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStar: {
    marginLeft: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    fontFamily: Fonts.regular,
  },
  menuContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: Colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 40,
  },
});