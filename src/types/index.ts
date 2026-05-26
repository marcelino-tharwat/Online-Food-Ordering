export interface Category {
  _id: string;
  name: {
    en: string;
    ar: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Product {
  _id: string;
  name: {
    en: string;
    ar: string;
  };
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export interface ProductInput {
  name: {
    en: string;
    ar: string;
  };
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export interface OrderItem {
  productId: string;
  name: {
    en: string;
    ar: string;
  };
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivery' | 'delivered';
  createdAt: string;
}

export type OrderStatus = Order['status'];

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
