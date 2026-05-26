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
  },
});

export const { setCartItems, setLoading, setError } = cartSlice.actions;
export type { CartItem, Product };
export default cartSlice.reducer;
