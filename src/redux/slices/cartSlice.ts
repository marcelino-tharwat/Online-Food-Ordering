import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit';

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface Product {
  _id: string;
  name: LocalizedText;
  price: number;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: CartState = {
  cartItems: [],
  loading: false,
  error: null,
  total: 0,
};
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (
      state,
      action: PayloadAction<{ items: CartItem[]; total: number }>,
    ) => {
      state.cartItems = action.payload.items;
      state.total = action.payload.total;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.total = 0;
    },
    optimisticAddItem: (
      state,
      action: PayloadAction<{ productId: string; product: Product; quantity?: number }>,
    ) => {
      const { productId, product, quantity = 1 } = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.product._id === productId,
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({ product, quantity });
      }
      state.total += product.price * quantity;
    },
    optimisticRemoveItem: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const itemIndex = state.cartItems.findIndex(
        (item) => item.product._id === productId,
      );
      if (itemIndex !== -1) {
        state.total -= state.cartItems[itemIndex].product.price * state.cartItems[itemIndex].quantity;
        state.cartItems.splice(itemIndex, 1);
      }
    },
    optimisticUpdateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.product._id === productId);
      if (item) {
        const diff = quantity - item.quantity;
        state.total += item.product.price * diff;
        item.quantity = quantity;
      }
    },
  },
});

export const {
  setCartItems,
  setLoading,
  setError,
  clearCart,
  optimisticAddItem,
  optimisticRemoveItem,
  optimisticUpdateQuantity,
} = cartSlice.actions;

// Memoized selector for total item count
export const selectCartItemCount = createSelector(
  [(state: { cart: CartState }) => state.cart.cartItems],
  (cartItems) => cartItems.reduce((count, item) => count + item.quantity, 0),
);

export type { CartItem, Product };
export default cartSlice.reducer;
