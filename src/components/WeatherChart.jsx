import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function WeatherChart({ hourlyData = [], unit = "c" }) {
  const data = hourlyData.map((h) => ({
    ...h,
    temp: unit === "c" ? h.temp : Math.round(h.temp * 9/5 + 32),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis label={{ value: `°${unit.toUpperCase()}`, angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temp" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default WeatherChart;
