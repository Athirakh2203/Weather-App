import axios from "axios";

const API_KEY = "0662865750da4895955175213261701";

export const getWeather = async (city) => {
  if (!city) throw new Error("City is required");

  const response = await axios.get(
    "https://api.weatherapi.com/v1/forecast.json",
    {
      params: {
        key: API_KEY,
        q: city,
        days: 7,
      },
    }
  );

  return response.data;
};
