import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CityCard from "./components/CityCard";
import Login from "./pages/login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Dashboard" element={<Dashboard />} />
         <Route path="/" element={< Login/>} />
        <Route path="/city/:cityName" element={<CityCard />} />
      </Routes>
    </Router>
  );
}

export default App;
