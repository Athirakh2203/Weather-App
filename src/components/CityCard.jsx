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

  const getPastDate = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const dailyData = [];

      for (let i = 1; i <= 5; i++) {
        const date = getPastDate(i);
        const res = await fetch(
          `https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${cityName}&dt=${date}`
        );
        const data = await res.json();
        if (!data.forecast) continue;

        const day = data.forecast.forecastday[0];

        dailyData.push({
          date: day.date,
          temp: Math.round(day.day.avgtemp_c),
          condition: day.day.condition.text,
          icon: day.day.condition.icon,
        });

        if (i === 1) {
          setHourlyForecast(
            day.hour.map((h) => ({
              time: h.time.split(" ")[1],
              temp_c: h.temp_c,
              temp_f: h.temp_f,
              condition: h.condition.text,
              icon: h.condition.icon,
            }))
          );

          setCurrentWeather({
            temp_c: day.day.avgtemp_c,
            temp_f: Math.round(day.day.avgtemp_c * 9 / 5 + 32),
            condition: day.day.condition.text,
            icon: day.day.condition.icon,
          });

          setDetailedStats({
            Humidity: `${day.hour[12].humidity}%`,
            Wind: `${day.hour[12].wind_kph} km/h`,
            Pressure: `${day.hour[12].pressure_mb} hPa`,
            "UV Index": day.hour[12].uv,
            "Feels Like": `${day.hour[12].feelslike_c}°C`,
          });
        }
      }

      setDailyForecast(dailyData.reverse());
    };

    fetchHistory();
  }, [cityName]);

  const textColor = darkMode ? "#fff" : "#000";

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: darkMode ? "#121212" : "#f5f5f5" }}>

    
      <Box sx={{
        height: 70,
        background: darkMode ? "#0b0b0b" : "#0b1c2d",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
      }}>
        <Typography variant="h5" fontWeight="bold">☀️ SkyCast</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="contained" size="small" onClick={() => setUnit(unit === "c" ? "f" : "c")}>
            °{unit.toUpperCase()}
          </Button>
          <Button variant="contained" size="small" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </Button>
        </Box>
      </Box>

     
      {currentWeather && (
        <Box sx={{
          height: 300,
          backgroundImage: `url(https://img.freepik.com/premium-photo/weather-forecast-banner-design-collage-with-different-photos_144356-77780.jpg?w=2000)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
          mb: 5,
        }}>
          <Box sx={{ textAlign: "center", backdropFilter: "blur(3px)", p: 3, borderRadius: 3, backgroundColor: "rgba(0,0,0,0.3)" }}>
            <Typography variant="h2" fontWeight="bold">
              {unit === "c" ? currentWeather.temp_c : currentWeather.temp_f}°{unit.toUpperCase()}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
              <img src={currentWeather.icon} alt="weather-icon" />
              <Typography variant="h5">{currentWeather.condition}</Typography>
            </Box>
          </Box>
        </Box>
      )}

     
      <Typography variant="h5" fontWeight="bold" sx={{textAlign:"center",mt:5}} mb={3} color={textColor}>Hourly Forecast</Typography>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", mb: 5 }}>
        {hourlyForecast.map((h) => (
          <Box key={h.time} sx={{
            minWidth: 100,
            p: 2,
            borderRadius: 3,
            textAlign: "center",
            background: darkMode ? "rgba(20,40,60,0.6)" : "rgba(255,255,255,0.85)",
            color: darkMode ? "#e3f2fd" : "#000"
          }}>
            <Typography fontSize={12}>{h.time}</Typography>
            <img src={h.icon} alt="" />
            <Typography fontSize={16}>{unit === "c" ? h.temp_c : h.temp_f}°{unit.toUpperCase()}</Typography>
            <Typography fontSize={10}>{h.condition}</Typography>
          </Box>
        ))}
      </Box>
      <Typography variant="h5" fontWeight="bold" mb={3} sx={{textAlign:"center",mt:5}} color={textColor}>Temperature Graph</Typography>
      <WeatherChart hourlyData={hourlyForecast.map(h => ({
        time: h.time,
        temp: unit === "c" ? h.temp_c : h.temp_f
      }))} unit={unit} />
      <Typography variant="h5" fontWeight="bold" sx={{textAlign:"center",mt:8}} mb={3} color={textColor}>Last 5 Days</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 6 }}>
        {dailyForecast.map((day) => (
          <Box key={day.date} sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            borderRadius: 3,
            background: darkMode ? "rgba(30,60,120,0.4)" : "rgba(230,230,230,0.85)",
            color: darkMode ? "#fff" : "#000"
          }}>
            <Typography>{day.date}</Typography>
            <Typography fontSize={18}>{unit === "c" ? day.temp : Math.round(day.temp * 9/5 + 32)}°{unit.toUpperCase()}</Typography>
            <img src={day.icon} alt="icon" />
            <Typography>{day.condition}</Typography>
          </Box>
        ))}
      </Box>
      {detailedStats && (
        <>
          <Typography variant="h5" fontWeight="bold" mt={5} mb={2} color={textColor}sx={{textAlign:"center"}}>
            Detailed Status
          </Typography>
          <Table sx={{ maxWidth: 500 ,mx:"auto"}}>
            <TableBody>
              {Object.entries(detailedStats).map(([k, v]) => (
                <TableRow key={k}>
                  <TableCell sx={{ color: darkMode ? "#90caf9" : "#1976d2" }}>{k}</TableCell>
                  <TableCell sx={{ color: darkMode ? "#e3f2fd" : "#000" }}>{v}</TableCell>
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
