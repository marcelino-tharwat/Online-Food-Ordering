import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
  name: "cart",
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
  },
});

export const { setCartItems, setLoading, setError, clearCart } =
  cartSlice.actions;

// Selector for total item count
export const selectCartItemCount = (state: { cart: CartState }): number =>
  state.cart.cartItems.reduce((count, item) => count + item.quantity, 0);

export type { CartItem, Product };
export default cartSlice.reducer;
