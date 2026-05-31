import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
  favoriteIds: string[];
}

const initialState: FavoritesState = {
  favoriteIds: JSON.parse(localStorage.getItem("favorites") || "[]"),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      const id = action.payload;
      const index = state.favoriteIds.indexOf(id);
      if (index === -1) {
        state.favoriteIds.push(id);
      } else {
        state.favoriteIds.splice(index, 1);
      }
      localStorage.setItem("favorites", JSON.stringify(state.favoriteIds));
    },
    clearFavorites(state) {
      state.favoriteIds = [];
      localStorage.removeItem("favorites");
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
