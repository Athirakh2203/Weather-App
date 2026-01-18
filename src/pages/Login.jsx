import React from "react";
import { Box, Button, Typography, Paper, AppBar, Toolbar, Avatar } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import CloudIcon from "@mui/icons-material/Cloud";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      console.log("User:", result.user);
      const messageBox = document.createElement("div");
      messageBox.innerText = "Login successful!";
      messageBox.style.position = "fixed";
      messageBox.style.top = "20px";
      messageBox.style.left = "50%";
      messageBox.style.transform = "translateX(-50%)";
      messageBox.style.background = "#4caf50";
      messageBox.style.color = "#fff";
      messageBox.style.padding = "12px 24px";
      messageBox.style.borderRadius = "8px";
      messageBox.style.zIndex = 9999;
      document.body.appendChild(messageBox);

      setTimeout(() => {
        document.body.removeChild(messageBox);
        navigate("/Dashboard");
      }, 2000);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #042540, #043152)" }}>
      <AppBar position="static" sx={{ background: "transparent", boxShadow: "none", py: 1 }}>
        <Toolbar sx={{ justifyContent: "center", gap: 1 }}>
          <Avatar sx={{ bgcolor: "#212b33" }}>
            <CloudIcon />
          </Avatar>
          <Typography variant="h3" fontWeight="bold" color="#fff">
            SkyCast
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)", 
          px: 2,
        }}
      >
        <Paper
          elevation={12}
          sx={{
            p: 5,
            width: "100%",
            maxWidth: "400px",
            textAlign: "center",
            borderRadius: "25px",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={2} color="#1976d2">
            Welcome!
          </Typography>

          <Typography color="text.secondary" mb={4}>
            Sign in to get real-time weather updates
          </Typography>

          <Button
            fullWidth
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
              backgroundColor: "#fff",
              color: "#000",
              fontWeight: "bold",
              textTransform: "none",
              py: 1.5,
              borderRadius: "30px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            Sign in with Google
          </Button>

          <Typography variant="caption" display="block" mt={4} color="text.secondary">
            By continuing, you agree to our Terms & Privacy Policy
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
