import React from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, Star, User, ChartBar as BarChart3, MessageSquare } from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/Colors';
import { getCurrentUser } from '@/utils/mockData';

export default function TabLayout() {
  const currentUser = getCurrentUser();
  const isBusinessUser = currentUser.type === 'business';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: Fonts.medium,
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
          backgroundColor: Colors.background,
        },
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