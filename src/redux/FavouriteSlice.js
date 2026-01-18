import { createSlice } from "@reduxjs/toolkit";

const favouriteSlice = createSlice({
  name: "favourites",
  initialState: {
    cities: [],
  },
  reducers: {
    addFavourite: (state, action) => {
      if (!state.cities.includes(action.payload)) {
        state.cities.push(action.payload);
      }
    },
    removeFavourite: (state, action) => {
      state.cities = state.cities.filter(
        (city) => city !== action.payload
      );
    },
  },
});

export const { addFavourite, removeFavourite } = favouriteSlice.actions;
export default favouriteSlice.reducer;
