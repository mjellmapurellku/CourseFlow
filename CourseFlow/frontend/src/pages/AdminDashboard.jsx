// src/components/AdminDashboard.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "Admin") {
      // if not admin, redirect
      navigate("/unauthorized");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <h1>🧑‍💼 Admin Dashboard</h1>
      <p>Welcome, Admin! You have full access to manage courses and users.</p>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;
