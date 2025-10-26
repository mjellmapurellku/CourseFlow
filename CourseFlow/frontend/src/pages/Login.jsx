// src/components/Login.jsx
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://localhost:55554/api/auth/login", {
        email,
        password,
      });

      const token = response.data.accessToken ?? response.data.AccessToken;
      const refreshToken = response.data.refreshToken ?? response.data.RefreshToken;

      if (!token) {
        setError("Login failed. No token received.");
        return;
      }

      // ✅ Store tokens
      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // ✅ Decode Token
      const decoded = jwtDecode(token);
      console.log("Decoded Token Payload:", decoded);

      // ✅ Extract Role Safely
      let role =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"];

      if (Array.isArray(role)) role = role[0];
      if (!role) role = "User"; // Default fallback

      console.log("Final Role:", role);
      localStorage.setItem("role", role);

      // ✅ Redirect based on role
      if (role === "Admin") {
        navigate("/admin/dashboard");
      } else if (role === "Instructor") {
        navigate("/instructor-dashboard");
      } else if (role === "Student") {
        navigate("/Home");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials. Please check your email or password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
