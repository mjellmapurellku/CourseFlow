import axios from "axios";
import { useEffect, useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import AdminSidebar from "../components/AdminSidebar";
import CoursesPage from "../pages/CoursePage";
import UsersPage from "../pages/UsersPage";
import { getUsers } from "../services/api";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard"); // 👈 New state

  const COLORS = ["#4CAF50", "#2196F3", "#FF9800"]; // Students, Instructors, Courses

  useEffect(() => {
    loadUsers();
    loadCourses();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

 const loadCourses = async () => {
  try {
    const res = await axios.get("https://localhost:55554/api/course");
    setCourses(res.data);
  } catch (err) {
    console.error("Error loading courses:", err);
  }
};


  // Prepare chart data
  useEffect(() => {
    const studentCount = users.filter((u) => u.role === "Student").length;
    const instructorCount = users.filter((u) => u.role === "Instructor").length;
    const courseCount = courses.length;

    setChartData([
      { name: "Students", value: studentCount },
      { name: "Instructors", value: instructorCount },
      { name: "Courses", value: courseCount },
    ]);
  }, [users, courses]);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <AdminSidebar onSelectSection={setActiveSection} />

      {/* Main content */}
      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="search-bar">
            <FaSearch />
            <input type="text" placeholder="Search..." />
          </div>
          <div className="topbar-actions">
            <FaBell className="icon" />
            <div className="user-info">
              <div className="user-avatar">AD</div>
              <div>
                <p className="user-name">Admin</p>
                <p className="user-role">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* === SECTION SWITCHING === */}
        {activeSection === "dashboard" && (
          <>
            <h1 className="page-title">Dashboard Overview</h1>
            <div className="chart-container">
              <h2>System Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeSection === "users" && <UsersPage />}
        {activeSection === "courses" && <CoursesPage />}
      </main>
    </div>
  );
};

export default AdminDashboard;
