import axios from "axios";
import { useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Register the user
      await axios.post("https://localhost:55554/api/auth/register", {
        fullName: form.fullName,
        email: form.email,
        username: form.username || form.email.split("@")[0],
        password: form.password,
      });

      // 2️⃣ Auto-login after successful registration
      const loginResponse = await axios.post("https://localhost:55554/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      // 3️⃣ Save token or user info
      localStorage.setItem("user", JSON.stringify(loginResponse.data));

      // 4️⃣ Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Error during registration or login:", error);
      alert("Registration or login failed. Please check your details.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="login-redirect">
            Already have an account? <a href="/login">Login here!</a>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button type="submit" className="btn register-btn">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
