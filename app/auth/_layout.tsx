import React from 'react';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background.primary,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: Colors.text.primary,
        },
        headerTintColor: Colors.primary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="register-type" 
        options={{ 
          headerTitle: 'Tipo de Cadastro',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="register-customer" 
        options={{ 
          headerTitle: 'Cadastro de Cliente',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="register-business" 
        options={{ 
          headerTitle: 'Cadastro de Estabelecimento',
          headerBackTitle: 'Voltar'
        }} 
      />
      <Stack.Screen 
        name="login" 
        options={{ 
          headerTitle: 'Entrar',
          headerBackTitle: 'Voltar'
        }} 
      />
    </Stack>
  );
}