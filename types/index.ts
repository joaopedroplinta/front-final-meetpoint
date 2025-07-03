export interface Establishment {
  id: string;
  nome?: string;
  name?: string;
  email?: string;
  telefone?: string;
  cnpj?: string;
  endereco?: string;
  address?: string;
  descricao?: string;
  tipo_id?: number;
  averageRating?: number;
  numRatings?: number;
  category?: string;
  imageUrl?: string;
  ownerId?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Rating {
  id: string;
  estabelecimento_id?: string;
  establishmentId?: string;
  cliente_id?: string;
  userId?: string;
  nota?: number;
  rating?: number;
  comentario?: string;
  comment?: string;
  data_avaliacao?: string;
  date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  nome?: string;
  name?: string;
  email: string;
  telefone?: string;
  senha?: string;
  avatar?: string;
  type: 'customer' | 'business';
  businessId?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessUser extends User {
  type: 'business';
  businessId: string;
  businessName?: string;
  cnpj?: string;
  phone?: string;
  description?: string;
}

export interface Tipo {
  id: number;
  nome: string;
  descricao?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Comentario {
  id: string;
  avaliacao_id: string;
  cliente_id: string;
  texto: string;
  created_at?: string;
  updated_at?: string;
}

export interface Destaque {
  id: string;
  estabelecimento_id: string;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  created_at?: string;
  updated_at?: string;
}

export interface Item {
  id: string;
  estabelecimento_id: string;
  nome: string;
  descricao?: string;
  preco: number;
  categoria: string;
  created_at?: string;
  updated_at?: string;
}