import { useState } from "react";
import { FaBars, FaBook, FaCog, FaSignOutAlt, FaTachometerAlt, FaUsers } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white min-h-screen transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className={`${isOpen ? "block" : "hidden"} text-lg font-semibold`}>Admin Panel</span>
          <button onClick={() => setIsOpen(!isOpen)}>
            <FaBars className="text-xl" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 flex flex-col gap-2 px-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            <FaTachometerAlt />
            {isOpen && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            <FaUsers />
            {isOpen && <span>Manage Users</span>}
          </NavLink>

          <NavLink
            to="/admin/courses"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            <FaBook />
            {isOpen && <span>Manage Courses</span>}
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            <FaCog />
            {isOpen && <span>Settings</span>}
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg mt-auto bg-red-600 hover:bg-red-700 transition"
          >
            <FaSignOutAlt />
            {isOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>
    </div>
  );
}
