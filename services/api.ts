import { Establishment, Rating, User } from '@/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.meetpoint.com';

class ApiError extends Error {
  constructor(public status: number, message: string) {
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
        throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, 'Network error or server unavailable');
    }
  }

  private async getAuthToken(): Promise<string | null> {
    // In a real app, you'd get this from secure storage
    // For now, we'll use a simple storage mechanism
    try {
      const { getItem } = await import('expo-secure-store');
      return await getItem('auth_token');
    } catch {
      // Fallback for web
      return localStorage.getItem('auth_token');
    }
  }

  private async setAuthToken(token: string): Promise<void> {
    try {
      const { setItem } = await import('expo-secure-store');
      await setItem('auth_token', token);
    } catch {
      // Fallback for web
      localStorage.setItem('auth_token', token);
    }
  }

  private async removeAuthToken(): Promise<void> {
    try {
      const { deleteItemAsync } = await import('expo-secure-store');
      await deleteItemAsync('auth_token');
    } catch {
      // Fallback for web
      localStorage.removeItem('auth_token');
    }
  }

  // Auth endpoints
  async login(email: string, password: string, userType: 'customer' | 'business'): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, userType }),
    });
    
    await this.setAuthToken(response.token);
    return response;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    userType: 'customer' | 'business';
    businessData?: {
      businessName: string;
      cnpj: string;
      category: string;
      address: string;
      description?: string;
    };
  }): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    await this.setAuthToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    await this.removeAuthToken();
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Establishments endpoints
  async getEstablishments(params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{ establishments: Establishment[]; total: number; page: number; totalPages: number }> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category && params.category !== 'Todos') searchParams.append('category', params.category);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<{ establishments: Establishment[]; total: number; page: number; totalPages: number }>(
      `/establishments${query ? `?${query}` : ''}`
    );
  }

  async getEstablishmentById(id: string): Promise<Establishment> {
    return this.request<Establishment>(`/establishments/${id}`);
  }

  async updateEstablishment(id: string, data: Partial<Establishment>): Promise<Establishment> {
    return this.request<Establishment>(`/establishments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Ratings endpoints
  async getRatings(establishmentId: string, params?: {
    page?: number;
    limit?: number;
    filter?: 'all' | 'high' | 'low';
  }): Promise<{ ratings: Rating[]; total: number; page: number; totalPages: number }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.filter && params.filter !== 'all') searchParams.append('filter', params.filter);

    const query = searchParams.toString();
    return this.request<{ ratings: Rating[]; total: number; page: number; totalPages: number }>(
      `/establishments/${establishmentId}/ratings${query ? `?${query}` : ''}`
    );
  }

  async getUserRatings(userId?: string): Promise<Rating[]> {
    const endpoint = userId ? `/users/${userId}/ratings` : '/ratings/me';
    return this.request<Rating[]>(endpoint);
  }

  async createRating(establishmentId: string, data: {
    rating: number;
    comment?: string;
  }): Promise<Rating> {
    return this.request<Rating>(`/establishments/${establishmentId}/ratings`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRating(ratingId: string, data: {
    rating: number;
    comment?: string;
  }): Promise<Rating> {
    return this.request<Rating>(`/ratings/${ratingId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRating(ratingId: string): Promise<void> {
    await this.request(`/ratings/${ratingId}`, { method: 'DELETE' });
  }

  // User profile endpoints
  async updateProfile(data: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  }): Promise<User> {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await this.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Analytics endpoints (for business users)
  async getBusinessAnalytics(establishmentId: string, params?: {
    period?: 'week' | 'month' | 'year';
  }): Promise<{
    averageRating: number;
    totalRatings: number;
    ratingDistribution: { [key: number]: number };
    recentRatings: Rating[];
    views: number;
    growth: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append('period', params.period);

    const query = searchParams.toString();
    return this.request<{
      averageRating: number;
      totalRatings: number;
      ratingDistribution: { [key: number]: number };
      recentRatings: Rating[];
      views: number;
      growth: number;
    }>(`/establishments/${establishmentId}/analytics${query ? `?${query}` : ''}`);
  }

  // Upload endpoints
  async uploadImage(file: File | Blob, type: 'avatar' | 'establishment'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to upload image');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
export { ApiError };