import { Box, Typography,Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

const cities = [
  { name: "London", img: "https://th.bing.com/th/id/OIP.vYRu1mpGPZgsXniQRY7jvAHaDX?w=325&h=159&c=7&r=0&o=5&dpr=1.4&pid=1.7" },
  { name: "New York", img: "https://th.bing.com/th/id/OIP.aIyg0VP2q2we90_k1HY6kwHaE8?w=277&h=185&c=7&r=0&o=5&dpr=1.4&pid=1.7" },
  { name: "Tokyo", img: "https://th.bing.com/th/id/OIP.g9h9dFNOpIEVGcsCxzn7ZAHaEo?w=285&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7" },
  { name: "Paris", img: "https://tse1.explicit.bing.net/th/id/OIP.RnyCqfJgO5IhsfEzkgNOoQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Dubai", img: "https://tse1.mm.bing.net/th/id/OIP.rjrcSO0xF9uz7tuyT73IUQHaGk?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Delhi", img: "https://wallpaperaccess.com/full/1896134.jpg" },
  { name: "Sydney", img: "https://tse1.mm.bing.net/th/id/OIP.YfDfuIvUsNDKD5IfuxDGxAHaEa?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Toronto", img: "https://cdn.shopify.com/s/files/1/1568/8443/products/main_Toronto_Skyline_Wall_Art.jpg" },
];

function Dashboard() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [unit, setUnit] = useState("c"); // "c" or "f"
  const [darkMode, setDarkMode] = useState(false);

  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);
  const toggleFavorite = (cityName) => {
    const updated = favorites.includes(cityName)
      ? favorites.filter((c) => c !== cityName)
      : [...favorites, cityName];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    if (!API_KEY) return;

    const fetchWeather = async () => {
      const data = {};
      for (const city of cities) {
        try {
          const res = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city.name}`
          );
          const json = await res.json();
          if (!json.error) data[city.name] = json;
        } catch (err) {
          console.error(err);
        }
      }
      setWeatherData(data);
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 60000); 
    return () => clearInterval(interval);
  }, []);
  const getTemp = (weather) =>
    unit === "c" ? weather.current.temp_c : weather.current.temp_f;
  const textColor = darkMode ? "#fff" : "#000";

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: darkMode ? "#121212" : "#f5f5f5" }}>
      <Box sx={{
        height: 70,
        background: darkMode ? "#0b0b0b" : "#0b1c2d",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        px: 3,
        justifyContent: "space-between"
      }}>
        <Typography variant="h5" fontWeight="bold">☀️ SkyCast</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button
            style={{ padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}
            onClick={() => setUnit(unit === "c" ? "f" : "c")}
          >
            °{unit.toUpperCase()}
          </button>
          <button
            style={{ padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </button>
        </Box>
      </Box>
<Box
  sx={{
    height: 500,
    backgroundImage:
      "url('https://img.freepik.com/premium-photo/beautiful-white-clouds-against-blue-sky_254845-4863.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <Box sx={{ width: 450 }}>
    <SearchBar
      onSelectCity={(city) => navigate(`/city/${city.name}`)}
    />
  </Box>
</Box>
      {favorites.length > 0 && (
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>⭐ FAVORITES</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3 }}>
            {favorites.map((name) => {
              const city = cities.find((c) => c.name === name);
              const weather = weatherData[name];
              if (!city) return null;

              return (
                <Box
                  key={name}
                  sx={{
                    height: 220,
                    borderRadius: 3,
                    backgroundImage: `url(${city.img})`,
                    backgroundSize: "cover",
                    color: "#fff",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/city/${name}`)}
                >
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight="bold">{name}</Typography>
                    <span onClick={(e) => { e.stopPropagation(); toggleFavorite(name); }}>
                      💖
                    </span>
                  </Box>

                 {weather ? (
  <Box>
    <Typography variant="h4">
      {Math.round(getTemp(weather))}°{unit.toUpperCase()}
    </Typography>
    <Box display="flex" alignItems="center">
      <img src={weather.current.condition.icon} alt="" />
      <Typography ml={1}>{weather.current.condition.text}</Typography>
    </Box>
    <Typography>💧 {weather.current.humidity}%</Typography>
    <Typography>💨 {weather.current.wind_kph} km/h</Typography>
  </Box>
) : (
  <Typography>Loading...</Typography>
)}

                </Box>
              );
            })}
          </Box>
        </Box>
      )}
      <Box sx={{ p: 4, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3 }}>
        {cities.map((city) => {
          const weather = weatherData[city.name];
          return (
            <Box
              key={city.name}
              sx={{
                height: 220,
                borderRadius: 3,
                backgroundImage: `url(${city.img})`,
                backgroundSize: "cover",
                color: "#fff",
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/city/${city.name}`)}
            >
              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight="bold">{city.name}</Typography>
                <span onClick={(e) => { e.stopPropagation(); toggleFavorite(city.name); }}>
                  {favorites.includes(city.name) ? "💖" : "🤍"}
                </span>
              </Box>

             {weather ? (
  <Box>
    <Typography variant="h4">
      {Math.round(getTemp(weather))}°{unit.toUpperCase()}
    </Typography>
    <Box display="flex" alignItems="center">
      <img src={weather.current.condition.icon} alt="" />
      <Typography ml={1}>{weather.current.condition.text}</Typography>
    </Box>
    <Typography>💧 {weather.current.humidity}%</Typography>
    <Typography>💨 {weather.current.wind_kph} km/h</Typography>
  </Box>
) : (
  <Typography>Loading...</Typography>
)}

            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          padding: { xs: "20px", md: "60px" },
          background: "linear-gradient(135deg, #41525d 0%, #9db1ba 100%)",
          gap: { xs: "20px", md: "50px" },
        }}
      >
        {/* Text */}
        <Box sx={{ flex: "2 1 400px", textAlign: { xs: "center", md: "left" } }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={2}
            sx={{ color: "#0b1c2d" }}
          >
             ABOUT WEATHER APP
          </Typography>
          <Typography mb={2} color="text.secondary" lineHeight={1.7}>
      The Weather App provides accurate, real-time weather updates for cities
      worldwide, helping you stay informed wherever you are. Track temperature,
      humidity, and wind conditions instantly, and plan your day with hourly
      and weekly forecasts. Interactive city cards allow you to monitor multiple
      locations at once, while intuitive visuals and charts make understanding
      the weather simple and fast. With global coverage and reliable data, the
      app ensures you are always prepared for changing conditions, whether
      you're commuting, traveling, or simply planning your day. Sleek, easy-to-use
      design and timely notifications make staying ahead of the weather both
      efficient and enjoyable.
          </Typography>
          <Typography mb={2} color="text.secondary" lineHeight={1.7}>
          This weather dashboard provides an easy-to-read overview of current and
  upcoming conditions for your selected city. It combines daily and hourly
  forecasts with detailed atmospheric data such as humidity, wind speed,
  pressure, and UV index, helping you plan your day with confidence. Designed
  with a clean, modern interface, the app focuses on clarity, accuracy, and a
  smooth user experience across all devices.
          </Typography>
         
        </Box>
        <Box
          sx={{
            flex: "1 1 300px",
            maxWidth: "400px",
            height: "300px",
            borderRadius: "30px",
            backgroundImage:
              "url('https://mir-s3-cdn-cf.behance.net/projects/404/b8cd0c183425381.Y3JvcCwzNDUxLDI3MDAsNzYsMA.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
            transition: "0.5s",
            "&:hover": { transform: "scale(1.05)" },
          }}
        ></Box>
      </Box>
      <Box sx={{ padding: { xs: "30px 20px", md: "60px 50px" }, backgroundColor: "#5c6b82" }}>
        <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
          🚀 FEATURES
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: "25px",
          }}
        >
          {[
            {
              title: "Real-Time Data",
              desc: "Get live updates on temperature, humidity, and wind speed for multiple cities.",
            },
            {
              title: "Forecasts",
              desc: "View hourly and weekly weather forecasts to plan your activities efficiently.",
            },
            {
              title: "Global Coverage",
              desc: "Monitor weather across cities globally with interactive visuals and maps.",
            },
          ].map((feature) => (
            <Box
              key={feature.title}
              sx={{
                padding: "25px",
                backgroundColor: "white",
                borderRadius: "20px",
                textAlign: "center",
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={2}>
                {feature.title}
              </Typography>
              <Typography color="text.secondary">{feature.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          padding: { xs: "30px 20px", md: "60px 50px" },
          gap: "30px",
          backgroundColor: "#728189"
        }}
      >
        <Box sx={{ flex: 1,   fontFamily: "Rye, serif",
  fontWeight: 400,
  fontStyle: "normal",
              fontSize:26,
   }}>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            🌦️ WHY CHOOSE US
          </Typography>
          <Typography color="text.secondary" lineHeight={1.7}>
            Our Weather App stands out by providing fast, reliable, and easy-to-understand
      weather information for cities worldwide. With real-time updates, interactive
      visuals, and global coverage, you can monitor multiple locations effortlessly.
      Whether planning your day, a trip, or simply staying informed, our intuitive
      interface, accurate forecasts, and detailed analytics ensure you make confident
      decisions in any weather. Designed for travelers, commuters, and weather
      enthusiasts alike, our app combines convenience, clarity, and reliability in
      one seamless experience.
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            height: "250px",
            borderRadius: "20px",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        ></Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: "30px 20px", md: "60px 50px" },
          gap: "30px",
          backgroundColor: "#7a97ab",
        }}
      >
        <Box sx={{ flex: 1, height: "250px", borderRadius: "20px", backgroundImage: "url('https://s3-alpha.figma.com/hub/file/2148880611913105676/resized/800x480/7c8e3348-85b2-450e-8c99-df36d08d9083-cover.png')", backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}></Box>
        <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            📊 TRACK MULTIPLE CITIES
          </Typography>
          <Typography color="text.secondary" lineHeight={1.7}>
            Monitor weather conditions in multiple cities at once. Interactive
            cards and visuals make tracking weather smooth and efficient.
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          padding: { xs: "30px 20px", md: "60px 50px" },
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={4}>
          🗺️ EXPLORE WEATHER WORLDWIDE
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: { xs: "300px", md: "500px" },
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <iframe
            title="Weather Map"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d243646.5121162605!2d55.296249!3d25.276987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1697274741912!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Box>
      </Box>
      <Box
        sx={{
          height: "60px",
          backgroundColor: "#0b1c2d",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>© 2026 Weather App. All rights reserved.</Typography>
      </Box>
     
    </Box>
  );
}

export default Dashboard;
