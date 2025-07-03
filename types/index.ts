export interface Establishment {
  id: string;
  name: string;
  averageRating: number;
  numRatings: number;
  address: string;
  category: string;
  imageUrl: string;
  ownerId?: string;
}

export interface Rating {
  id: string;
  establishmentId: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  type: 'customer' | 'business';
  businessId?: string;
}

export interface BusinessUser extends User {
  type: 'business';
  businessId: string;
  businessName: string;
  cnpj: string;
  phone: string;
  description?: string;
}