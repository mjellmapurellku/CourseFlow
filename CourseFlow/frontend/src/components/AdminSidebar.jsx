import { useState } from "react";
import { FaBars, FaBook, FaCog, FaSignOutAlt, FaTachometerAlt, FaUsers } from "react-icons/fa";
import "../styles/AdminSidebar.css";

function AdminSidebar({ onSelectSection }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <aside className="sidebar">
      {/* Logo & Toggle */}
      <div className="logo">
        {isOpen ? (
          <>
            Course<span>Flow</span>
          </>
        ) : (
          "CF"
        )}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "none",
          border: "none",
          color: "#4caf50",
          fontSize: "1.2rem",
          marginBottom: "20px",
          cursor: "pointer",
        }}
        title="Toggle Sidebar"
      >
        <FaBars />
      </button>

      {/* Sidebar Sections */}
      <div className="sidebar-section">
        <p className="sidebar-title">MAIN</p>

        <button onClick={() => onSelectSection("dashboard")}>
          <FaTachometerAlt style={{ marginRight: "10px" }} />
          {isOpen && "Dashboard"}
        </button>

        <button onClick={() => onSelectSection("users")}>
          <FaUsers style={{ marginRight: "10px" }} />
          {isOpen && "Manage Users"}
        </button>

        <button onClick={() => onSelectSection("courses")}>
          <FaBook style={{ marginRight: "10px" }} />
          {isOpen && "Manage Courses"}
        </button>

        <button onClick={() => onSelectSection("settings")}>
          <FaCog style={{ marginRight: "10px" }} />
          {isOpen && "Settings"}
        </button>
      </div>

      {/* Logout button at bottom */}
      <div style={{ marginTop: "auto" }}>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt style={{ marginRight: "10px" }} />
          {isOpen && "Logout"}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
