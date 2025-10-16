import { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/NavBar";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import Courses from "./pages/Courses";
import Home from "./pages/Home";
import InstructorDashboard from "./pages/InstructorDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./routes/ProtectedRoute";

function RequireRole({ children, role }) {
  const userRole = localStorage.getItem("role");
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition">
        <Navbar />

        <div className="flex justify-end p-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/instructor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["Instructor"]}>
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
