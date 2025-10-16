import { useNavigate } from "react-router-dom";

function InstructorDashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <h1>👨‍🏫 Instructor Dashboard</h1>
      <p>Welcome! Manage your courses and view enrolled students here.</p>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default InstructorDashboard;
