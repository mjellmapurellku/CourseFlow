import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="forgot-password">
            Lost password? <a href="/forgot-password">Click here!</a>
          </div>

          <div className="button-group">
            <button type="button" className="btn signup-btn" onClick={handleSignUp}>
              Sign Up
            </button>
            <button type="submit" className="btn login-btn">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
