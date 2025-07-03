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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const clearStoredAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
      }
    };
    
    clearStoredAuth();
  }, []);

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
          avatar: null,
          type: 'customer'
        });
      } else {
        response = await apiService.loginEstabelecimento(email, password);
        setUser({
          id: response.estabelecimento.id,
          name: response.estabelecimento.nome || response.estabelecimento.name,
          email: response.estabelecimento.email,
          avatar: null,
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
          nome: userData.nome || userData.name,
          email: userData.email,
          senha: userData.senha || userData.password,
          telefone: userData.telefone || userData.phone,
          cpf: userData.cpf
        });
        setUser({
          id: response.cliente.id,
          name: response.cliente.nome || response.cliente.name,
          email: response.cliente.email,
          avatar: null,
          type: 'customer'
        });
      } else {
        const tipos = await apiService.getTipos();
        const tipo = tipos.find(t => t.nome === userData.businessData.category);
        
        console.log('Registering business with data:', {
          nome: userData.businessData.businessName,
          email: userData.email,
          senha: userData.password,
          telefone: userData.phone,
          cnpj: userData.businessData.cnpj,
          endereco: userData.businessData.address,
          descricao: userData.businessData.description,
          tipo_id: tipo?.id || 1,
          categoria: userData.businessData.category
        });
        
        response = await apiService.registerEstabelecimento({
          nome: userData.businessData.businessName,
          email: userData.email,
          senha: userData.password,
          telefone: userData.phone,
          cnpj: userData.businessData.cnpj,
          endereco: userData.businessData.address,
          descricao: userData.businessData.description,
          tipo_id: tipo?.id || 1,
          categoria: userData.businessData.category
        });
        setUser({
          id: response.estabelecimento.id,
          name: response.estabelecimento.nome || response.estabelecimento.name,
          email: response.estabelecimento.email,
          avatar: null,
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
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      console.log('Updating user with data:', userData);
      const updatedUser = { ...user, ...userData };
      console.log('Updated user:', updatedUser);
      setUser(updatedUser);
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