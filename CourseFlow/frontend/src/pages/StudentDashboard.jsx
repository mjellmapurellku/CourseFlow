import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <h1>🎓 Student Dashboard</h1>
      <p>Welcome! View your enrolled courses and progress here.</p>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default StudentDashboard;
