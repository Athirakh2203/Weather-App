import { useState } from "react";
import {
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchBar({ onSelectCity }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSelectCity({ name: value.trim() });
    setValue("");
  };

  return (
    <Paper
      elevation={10}
      sx={{
        borderRadius: "30px",
        backdropFilter: "blur(14px)",
        background: "rgba(255,255,255,0.9)",
        px: 2,
      }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          placeholder="Search city..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#1976d2" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& fieldset": { border: "none" },
            input: {
              padding: "14px 0",
              fontSize: "16px",
            },
          }}
        />
      </form>
    </Paper>
  );
}

export default SearchBar;
