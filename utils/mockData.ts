import { Establishment, Rating, User, BusinessUser } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'customer'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'customer'
  },
  {
    id: '3',
    name: 'Carlos Santos',
    email: 'carlos@cafesublime.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'business',
    businessId: '1'
  } as BusinessUser,
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana@restauranteoliveira.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'business',
    businessId: '2'
  } as BusinessUser
];

export const establishments: Establishment[] = [
  {
    id: '1',
    name: 'Café Sublime',
    averageRating: 4.5,
    numRatings: 127,
    address: 'Rua das Flores, 123',
    category: 'Café',
    imageUrl: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=800',
    ownerId: '3'
  },
  {
    id: '2',
    name: 'Restaurante Oliveira',
    averageRating: 4.2,
    numRatings: 89,
    address: 'Av. Principal, 456',
    category: 'Restaurante',
    imageUrl: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=800',
    ownerId: '4'
  },
  {
    id: '3',
    name: 'Padaria São José',
    averageRating: 4.7,
    numRatings: 213,
    address: 'Rua João VI, 789',
    category: 'Padaria',
    imageUrl: 'https://images.pexels.com/photos/1974821/pexels-photo-1974821.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '4',
    name: 'Bar do Zé',
    averageRating: 3.8,
    numRatings: 56,
    address: 'Praça Central, 234',
    category: 'Bar',
    imageUrl: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '5',
    name: 'Farmácia Saúde',
    averageRating: 4.0,
    numRatings: 42,
    address: 'Av. das Indústrias, 567',
    category: 'Farmácia',
    imageUrl: 'https://images.pexels.com/photos/139398/himalayas-mountains-nepal-himalaya-139398.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '6',
    name: 'Mercado Bom Preço',
    averageRating: 3.9,
    numRatings: 107,
    address: 'Rua dos Comerciantes, 890',
    category: 'Mercado',
    imageUrl: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export const ratings: Rating[] = [
  {
    id: '1',
    establishmentId: '1',
    userId: '1',
    rating: 5,
    comment: 'Ótimo café, ambiente agradável e atendimento excelente!',
    date: '2023-10-15'
  },
  {
    id: '2',
    establishmentId: '1',
    userId: '2',
    rating: 4,
    comment: 'Gostei bastante do lugar, mas achei um pouco caro.',
    date: '2023-10-10'
  },
  {
    id: '3',
    establishmentId: '2',
    userId: '1',
    rating: 4,
    comment: 'Comida muito boa, mas demorou um pouco para ser servida.',
    date: '2023-09-28'
  },
  {
    id: '4',
    establishmentId: '3',
    userId: '1',
    rating: 5,
    comment: 'Pães fresquinhos e deliciosos. Recomendo!',
    date: '2023-10-05'
  },
  {
    id: '5',
    establishmentId: '4',
    userId: '2',
    rating: 3,
    comment: 'Lugar barulhento, mas as bebidas são boas.',
    date: '2023-09-15'
  }
];

// Current user state - in a real app this would be managed by a state management solution
let currentUserId = '1'; // Default to customer user

export const setCurrentUser = (userId: string) => {
  currentUserId = userId;
};

export const getUserRatings = (userId: string): Rating[] => {
  return ratings.filter(rating => rating.userId === userId);
};

export const getEstablishmentById = (id: string): Establishment | undefined => {
  return establishments.find(establishment => establishment.id === id);
};

export const getEstablishmentRatings = (establishmentId: string): Rating[] => {
  return ratings.filter(rating => rating.establishmentId === establishmentId);
};

export const getCurrentUser = (): User => {
  return users.find(user => user.id === currentUserId) || users[0];
};

export const getUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const getBusinessEstablishment = (businessId: string): Establishment | undefined => {
  return establishments.find(establishment => establishment.id === businessId);
};

export const authenticateUser = (email: string, password: string): User | null => {
  // Simple mock authentication - in real app this would validate against a backend
  const user = getUserByEmail(email);
  if (user) {
    setCurrentUser(user.id);
    return user;
  }
  return null;
};