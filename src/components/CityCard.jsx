import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import WeatherChart from "./WeatherChart";

function CityCard({ unit: parentUnit = "c", darkMode: parentDarkMode = false }) {
  const { cityName } = useParams();

  const [dailyForecast, setDailyForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [detailedStats, setDetailedStats] = useState(null);
  const [unit, setUnit] = useState(parentUnit);
  const [darkMode, setDarkMode] = useState(parentDarkMode);
  const [currentWeather, setCurrentWeather] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  /* ===== COLORS ===== */
  const textColor = darkMode ? "#e5e7eb" : "#111827";
  const cardBg = darkMode ? "#1e293b" : "#ffffff";
  const pageBg = darkMode ? "#0f172a" : "#f5f5f5";

  const getPastDate = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        /* ===== FORECAST (HOURLY) ===== */
        const forecastRes = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=1`
        );
        const forecastData = await forecastRes.json();

        const today = forecastData.forecast.forecastday[0];

        setHourlyForecast(
          today.hour.map((h) => ({
            time: h.time.split(" ")[1],
            temp_c: h.temp_c,
            temp_f: h.temp_f,
            condition: h.condition.text,
            icon: h.condition.icon,
          }))
        );

        setCurrentWeather({
          temp_c: forecastData.current.temp_c,
          temp_f: forecastData.current.temp_f,
          condition: forecastData.current.condition.text,
          icon: forecastData.current.condition.icon,
        });

        setDetailedStats({
          Humidity: `${forecastData.current.humidity}%`,
          Wind: `${forecastData.current.wind_kph} km/h`,
          Pressure: `${forecastData.current.pressure_mb} hPa`,
          "UV Index": forecastData.current.uv,
          "Feels Like": `${forecastData.current.feelslike_c}°C`,
        });

        /* ===== HISTORY (5 DAYS) ===== */
        const historyData = [];

        for (let i = 1; i <= 5; i++) {
          const date = getPastDate(i);
          const res = await fetch(
            `https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${cityName}&dt=${date}`
          );
          const data = await res.json();

          const day = data?.forecast?.forecastday?.[0];
          if (!day) continue;

          historyData.push({
            date: day.date,
            temp: Math.round(day.day.avgtemp_c),
            condition: day.day.condition.text,
            icon: day.day.condition.icon,
          });
        }

        setDailyForecast(historyData.reverse());
      } catch (err) {
        console.error("Weather fetch failed:", err);
      }
    };

    fetchWeather();
  }, [cityName, API_KEY]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: pageBg }}>
      {/* HEADER */}
      <Box
        sx={{
          height: 70,
          background: darkMode ? "#020617" : "#0b1c2d",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          ☀️ SkyCast
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setUnit(unit === "c" ? "f" : "c")}
          >
            °{unit.toUpperCase()}
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </Button>
        </Box>
      </Box>

      {/* CURRENT WEATHER */}
      {currentWeather && (
        <Box
          sx={{
            height: 300,
            backgroundImage:
              "url(https://img.freepik.com/premium-photo/weather-forecast-banner-design-collage-with-different-photos_144356-77780.jpg?w=2000)",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 5,
          }}
        >
          <Box
            sx={{
              background: "rgba(0,0,0,0.4)",
              p: 3,
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h2" color="#fff">
              {unit === "c" ? currentWeather.temp_c : currentWeather.temp_f}°
            </Typography>
            <img src={currentWeather.icon} alt="" />
            <Typography color="#fff">
              {currentWeather.condition}
            </Typography>
          </Box>
        </Box>
      )}

      {/* HOURLY */}
      <Typography
        variant="h5"
        textAlign="center"
        color={textColor}
        mb={3}
      >
        Hourly Forecast
      </Typography>

      <Box sx={{ display: "flex", gap: 2, px: 2, overflowX: "auto" }}>
        {hourlyForecast.map((h) => (
          <Box
            key={h.time}
            sx={{
              minWidth: 100,
              p: 2,
              borderRadius: 3,
              backgroundColor: cardBg,
              color: textColor,
              textAlign: "center",
            }}
          >
            <Typography fontSize={12}>{h.time}</Typography>
            <img src={h.icon} alt="" />
            <Typography>
              {unit === "c" ? h.temp_c : h.temp_f}°
            </Typography>
          </Box>
        ))}
      </Box>

      {/* GRAPH */}
      {hourlyForecast.length > 0 && (
        <WeatherChart
          hourlyData={hourlyForecast.map((h) => ({
            time: h.time,
            temp: unit === "c" ? h.temp_c : h.temp_f,
          }))}
          unit={unit}
        />
      )}

      {/* DAILY */}
      <Typography
        variant="h5"
        textAlign="center"
        color={textColor}
        mt={6}
        mb={3}
      >
        Last 5 Days
      </Typography>

      <Box sx={{ px: 3 }}>
        {dailyForecast.map((day) => (
          <Box
            key={day.date}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
              mb: 2,
              borderRadius: 3,
              backgroundColor: cardBg,
              color: textColor,
            }}
          >
            <Typography>{day.date}</Typography>
            <Typography>
              {unit === "c"
                ? day.temp
                : Math.round(day.temp * 9 / 5 + 32)}°
            </Typography>
            <img src={day.icon} alt="" />
            <Typography>{day.condition}</Typography>
          </Box>
        ))}
      </Box>

      {/* DETAILS */}
      {detailedStats && (
        <>
          <Typography
            variant="h5"
            textAlign="center"
            color={textColor}
            mt={5}
          >
            Detailed Status
          </Typography>
          <Table sx={{ maxWidth: 500, mx: "auto" }}>
            <TableBody>
              {Object.entries(detailedStats).map(([k, v]) => (
                <TableRow key={k}>
                  <TableCell sx={{ color: textColor }}>{k}</TableCell>
                  <TableCell sx={{ color: textColor }}>{v}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Box>
  );
}

export default CityCard;
