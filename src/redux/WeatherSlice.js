import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWeather } from "../api/WeatherAPI";

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (city, thunkAPI) => {
    try {
      return await getWeather(city);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default weatherSlice.reducer;
