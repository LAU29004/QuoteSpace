import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { items: [] }, 
  reducers: {
    addFavorite: (state, { payload }) => {
      if (!state.items.some((i) => i.id === payload.id)) state.items.push(payload);
    },
    removeFavorite: (state, { payload }) => {
      state.items = state.items.filter((i) => i.id !== payload);
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
