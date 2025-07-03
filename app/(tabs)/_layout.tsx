import React from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, Star, User, ChartBar as BarChart3, MessageSquare } from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const isBusinessUser = user?.type === 'business';

  const getTabBarHeight = () => {
    const baseHeight = 60;
    const bottomInset = insets.bottom;
    
    if (Platform.OS === 'ios') {
      return baseHeight + bottomInset;
    } else if (Platform.OS === 'android') {
      return baseHeight + Math.max(bottomInset, 8);
    } else {
      return baseHeight;
    }
  };

  const tabBarHeight = getTabBarHeight();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: Fonts.medium,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: tabBarHeight,
          paddingTop: 8,
          paddingBottom: Platform.select({
            ios: Math.max(insets.bottom, 8),
            android: 8,
            default: 8,
          }),
          paddingHorizontal: 8,
          backgroundColor: Colors.background,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          shadowColor: Colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarHideOnKeyboard: Platform.OS === 'android',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTitleStyle: {
          fontFamily: Fonts.semiBold,
          color: Colors.textPrimary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isBusinessUser ? 'Dashboard' : 'Início',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerTitle: isBusinessUser ? 'Dashboard do Negócio' : 'Estabelecimentos',
        }}
      />
      
      {isBusinessUser ? (
        <>
          <Tabs.Screen
            name="analytics"
            options={{
              title: 'Análises',
              tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
              headerTitle: 'Análises e Relatórios',
            }}
          />
          <Tabs.Screen
            name="reviews"
            options={{
              title: 'Avaliações',
              tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
              headerTitle: 'Avaliações Recebidas',
            }}
          />
        </>
      ) : (
        <Tabs.Screen
          name="my-ratings"
          options={{
            title: 'Minhas Avaliações',
            tabBarIcon: ({ color, size }) => <Star color={color} size={size} />,
            headerTitle: 'Minhas Avaliações',
          }}
        />
      )}
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          headerTitle: 'Meu Perfil',
        }}
      />
    </Tabs>
  );
}