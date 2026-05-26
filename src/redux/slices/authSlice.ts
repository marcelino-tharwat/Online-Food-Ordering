import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Initialize from localStorage
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!(storedUser && storedToken),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    hydrateAuth: (state) => {
      // Called on app startup to rehydrate from localStorage
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (user && token) {
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
  },
});

export const { setUser, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
export type { User };
