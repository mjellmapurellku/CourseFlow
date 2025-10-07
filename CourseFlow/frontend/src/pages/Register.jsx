import { useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration data:", form);
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
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email id"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
            <button type="button" className="btn cancel-btn">
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
