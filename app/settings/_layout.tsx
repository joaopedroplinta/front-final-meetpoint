import React from 'react';
import { Stack } from 'expo-router';
import { Colors, Fonts } from '@/constants/Colors';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTitleStyle: {
          fontFamily: Fonts.semiBold,
          color: Colors.textPrimary,
        },
        headerTintColor: Colors.primary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerTitle: 'Configurações',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="account" 
        options={{ 
          headerTitle: 'Conta',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="business-profile" 
        options={{ 
          headerTitle: 'Perfil do Estabelecimento',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="notifications" 
        options={{ 
          headerTitle: 'Notificações',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="privacy" 
        options={{ 
          headerTitle: 'Privacidade',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="help" 
        options={{ 
          headerTitle: 'Ajuda',
          headerBackTitle: 'Voltar'
        }} 
      />
    </Stack>
  );
}