import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { toast } from "sonner";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "cust1" && password === "pass") {
      // Minimal auth: persist role and demo card for route guards
      sessionStorage.setItem("role", "CUSTOMER");
      sessionStorage.setItem("cardNumber", "4123456789012345");
      navigate("/customer");
      toast.success("Welcome, Customer");
    } else if (username === "admin" && password === "admin") {
      sessionStorage.setItem("role", "ADMIN");
      navigate("/admin");
      toast.success("Welcome, Admin");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Bank Login</h2>

      <TextField
        fullWidth
        label="Username"
        variant="outlined"
        margin="normal"
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        variant="outlined"
        margin="normal"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        fullWidth
        variant="contained"
        style={{ marginTop: 20 }}
        onClick={handleLogin}
        startIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M10 17l5-5l-5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 12h11"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        }
      >
        Login
      </Button>
    </div>
  );
}
