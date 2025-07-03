import { Establishment, Rating, User } from '@/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(public status: number, message: string, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = await this.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorDetails = null;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          errorDetails = errorData;
        } catch {
          // If response is not JSON, try to get text
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          } catch {
            // Keep the default error message
          }
        }

        // Handle specific error cases
        if (response.status === 409) {
          if (errorMessage.toLowerCase().includes('email')) {
            errorMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
          } else if (errorMessage.toLowerCase().includes('cpf')) {
            errorMessage = 'Este CPF já está cadastrado. Verifique os dados ou tente fazer login.';
          } else if (errorMessage.toLowerCase().includes('cnpj')) {
            errorMessage = 'Este CNPJ já está cadastrado. Verifique os dados ou tente fazer login.';
          } else {
            errorMessage = 'Dados já cadastrados no sistema. Verifique as informações.';
          }
        } else if (response.status === 400) {
          errorMessage = errorMessage || 'Dados inválidos. Verifique as informações e tente novamente.';
        } else if (response.status === 401) {
          errorMessage = 'Email ou senha incorretos.';
        } else if (response.status === 404) {
          errorMessage = 'Recurso não encontrado.';
        } else if (response.status >= 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        }

        throw new ApiError(response.status, errorMessage, errorDetails);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(0, 'Erro de conexão. Verifique sua internet e tente novamente.');
      }
      
      throw new ApiError(0, 'Erro inesperado. Tente novamente.');
    }
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      // Always use localStorage for web compatibility
      if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
      }
      // For native platforms, use AsyncStorage as fallback
      return null;
    } catch {
      return null;
    }
  }

  private async setAuthToken(token: string): Promise<void> {
    try {
      // Always use localStorage for web compatibility
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        return;
      }
      // For native platforms, you would use AsyncStorage here
    } catch (error) {
      console.error('Failed to store auth token:', error);
    }
  }

  private async removeAuthToken(): Promise<void> {
    try {
      // Always use localStorage for web compatibility
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        return;
      }
      // For native platforms, you would use AsyncStorage here
    } catch (error) {
      console.error('Failed to remove auth token:', error);
    }
  }

  // Auth endpoints
  async loginCliente(email: string, password: string): Promise<{ cliente: User; token: string }> {
    const response = await this.request<{ cliente: User; token: string }>('/clientes/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha: password }),
    });
    
    if (response.token) {
      await this.setAuthToken(response.token);
    }
    return response;
  }

  async loginEstabelecimento(email: string, password: string): Promise<{ estabelecimento: User; token: string }> {
    const response = await this.request<{ estabelecimento: User; token: string }>('/estabelecimentos/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha: password }),
    });
    
    if (response.token) {
      await this.setAuthToken(response.token);
    }
    return response;
  }

  async registerCliente(userData: {
    nome: string;
    email: string;
    senha: string;
    telefone?: string;
    cpf?: string;
  }): Promise<{ cliente: User; token: string }> {
    const response = await this.request<{ cliente: User; token: string }>('/clientes', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      await this.setAuthToken(response.token);
    }
    return response;
  }

  async registerEstabelecimento(userData: {
    nome: string;
    email: string;
    senha: string;
    telefone?: string;
    cnpj: string;
    endereco: string;
    descricao?: string;
    tipo_id: number;
    categoria?: string; // Add categoria field
  }): Promise<{ estabelecimento: User; token: string }> {
    console.log('API Service - Sending establishment data:', userData);
    
    const response = await this.request<{ estabelecimento: User; token: string }>('/estabelecimentos', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      await this.setAuthToken(response.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    await this.removeAuthToken();
  }

  // Establishments endpoints
  async getEstabelecimentos(params?: {
    search?: string;
    tipo?: string;
    page?: number;
    limit?: number;
  }): Promise<Establishment[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.tipo && params.tipo !== 'Todos') searchParams.append('tipo', params.tipo);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<Establishment[]>(
      `/estabelecimentos${query ? `?${query}` : ''}`
    );
  }

  async getEstabelecimentoById(id: string): Promise<Establishment> {
    return this.request<Establishment>(`/estabelecimentos/${id}`);
  }

  async updateEstabelecimento(id: string, data: Partial<Establishment>): Promise<Establishment> {
    return this.request<Establishment>(`/estabelecimentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Ratings endpoints
  async getAvaliacoesByEstabelecimento(estabelecimentoId: string): Promise<Rating[]> {
    return this.request<Rating[]>(`/estabelecimentos/${estabelecimentoId}/avaliacoes`);
  }

  async getAvaliacoesByCliente(clienteId: string): Promise<Rating[]> {
    return this.request<Rating[]>(`/clientes/${clienteId}/avaliacoes`);
  }

  async createAvaliacao(data: {
    estabelecimento_id: string;
    cliente_id: string;
    nota: number;
    comentario?: string;
  }): Promise<Rating> {
    return this.request<Rating>('/avaliacoes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAvaliacao(avaliacaoId: string, data: {
    nota: number;
    comentario?: string;
  }): Promise<Rating> {
    return this.request<Rating>(`/avaliacoes/${avaliacaoId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAvaliacao(avaliacaoId: string): Promise<void> {
    await this.request(`/avaliacoes/${avaliacaoId}`, { method: 'DELETE' });
  }

  // User profile endpoints
  async getClienteById(id: string): Promise<User> {
    return this.request<User>(`/clientes/${id}`);
  }

  async updateCliente(id: string, data: {
    nome?: string;
    email?: string;
    telefone?: string;
    cpf?: string;
  }): Promise<User> {
    return this.request<User>(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Tipos endpoints
  async getTipos(): Promise<{ id: number; nome: string; descricao?: string }[]> {
    return this.request<{ id: number; nome: string; descricao?: string }[]>('/tipos');
  }

  async getTipoById(id: string): Promise<{ id: number; nome: string; descricao?: string }> {
    return this.request<{ id: number; nome: string; descricao?: string }>(`/tipos/${id}`);
  }

  // Comentarios endpoints
  async getComentarios(): Promise<any[]> {
    return this.request<any[]>('/comentarios');
  }

  async createComentario(data: {
    avaliacao_id: string;
    cliente_id: string;
    texto: string;
  }): Promise<any> {
    return this.request<any>('/comentarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Destaques endpoints
  async getDestaques(): Promise<any[]> {
    return this.request<any[]>('/destaques');
  }

  async createDestaque(data: {
    estabelecimento_id: string;
    titulo: string;
    descricao: string;
    data_inicio: string;
    data_fim: string;
  }): Promise<any> {
    return this.request<any>('/destaques', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Items endpoints
  async getItems(): Promise<any[]> {
    return this.request<any[]>('/items');
  }

  async createItem(data: {
    estabelecimento_id: string;
    nome: string;
    descricao?: string;
    preco: number;
    categoria: string;
  }): Promise<any> {
    return this.request<any>('/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
export { ApiError };