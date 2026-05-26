import api from '../api/axios';
import type { CartItem } from '../redux/slices/cartSlice';

interface CartResponse {
  success: boolean;
  data: {
    items: CartItem[];
  };
  total: number;
}

export const cartService = {
  async getCart(): Promise<{ items: CartItem[]; total: number }> {
    const response = await api.get<CartResponse>('/cart');
    return {
      items: response.data.data.items,
      total: response.data.total,
    };
  },

  async addToCart(productId: string, quantity: number): Promise<void> {
    await api.post('/cart/add', { productId, quantity });
  },

  async updateCart(productId: string, quantity: number): Promise<void> {
    await api.put('/cart/update', { productId, quantity });
  },

  async removeFromCart(productId: string): Promise<void> {
    await api.delete(`/cart/remove/${productId}`);
  },

  async clearCart(): Promise<void> {
    await api.delete('/cart/clear');
  },
};
