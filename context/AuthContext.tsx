import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, ApiError } from '@/services/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, userType: 'customer' | 'business') => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if we have a token stored
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('auth_token')
        : null;
      
      if (!token) {
        setLoading(false);
        return;
      }

      // For now, we'll assume the user is authenticated if we have a token
      // In a real implementation, you'd validate the token with the server
      setLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const login = async (email: string, password: string, userType: 'customer' | 'business') => {
    try {
      setError(null);
      setLoading(true);

      let response;
      if (userType === 'customer') {
        response = await apiService.loginCliente(email, password);
        setUser({
          id: response.cliente.id,
          name: response.cliente.nome || response.cliente.name,
          email: response.cliente.email,
          avatar: response.cliente.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
          type: 'customer'
        });
      } else {
        response = await apiService.loginEstabelecimento(email, password);
        setUser({
          id: response.estabelecimento.id,
          name: response.estabelecimento.nome || response.estabelecimento.name,
          email: response.estabelecimento.email,
          avatar: response.estabelecimento.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
          type: 'business',
          businessId: response.estabelecimento.id
        });
      }
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Erro ao fazer login. Tente novamente.';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setError(null);
      setLoading(true);

      let response;
      if (userData.userType === 'customer') {
        response = await apiService.registerCliente({
          nome: userData.name,
          email: userData.email,
          senha: userData.password,
          telefone: userData.phone,
          cpf: userData.cpf
        });
        setUser({
          id: response.cliente.id,
          name: response.cliente.nome || response.cliente.name,
          email: response.cliente.email,
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
          type: 'customer'
        });
      } else {
        // First get the tipo_id for the category
        const tipos = await apiService.getTipos();
        const tipo = tipos.find(t => t.nome === userData.businessData.category);
        
        response = await apiService.registerEstabelecimento({
          nome: userData.businessData.businessName,
          email: userData.email,
          senha: userData.password,
          telefone: userData.phone,
          cnpj: userData.businessData.cnpj,
          endereco: userData.businessData.address,
          descricao: userData.businessData.description,
          tipo_id: tipo?.id || 1
        });
        setUser({
          id: response.estabelecimento.id,
          name: response.estabelecimento.nome || response.estabelecimento.name,
          email: response.estabelecimento.email,
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
          type: 'business',
          businessId: response.estabelecimento.id
        });
      }
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Erro ao criar conta. Tente novamente.';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      setUser(null);
      setError(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}