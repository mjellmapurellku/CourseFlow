import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import NavbarSearch from "./NavbarSearch";

const categories = [
  { name: "AI" },
  { name: "Programming" },
  { name: "Design" },
  { name: "Marketing" },
  { name: "Business" },
  { name: "Data Science" },
  { name: "Project Management" },
  { name: "Finance" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Check login state from either token or user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!token || !!user);
  }, [location]);

  // ✅ Listen for login/register updates
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!token || !!user);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpenSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setOpenSearch(false);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* EXPLORE DROPDOWN */}
        <div className="explore-dropdown">
          <button
            className="explore-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Explore{" "}
            <FiChevronDown
              className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`}
            />
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/courses?category=${category.name.toLowerCase()}`}
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="category-name">{category.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">CourseFlow</span>
        </Link>

        {/* LINKS */}
        <ul className={menuOpen ? "navbar-links active" : "navbar-links"}>
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/courses"
              className={location.pathname === "/courses" ? "active" : ""}
            >
              Courses
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={location.pathname === "/about" ? "active" : ""}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={location.pathname === "/contact" ? "active" : ""}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* RIGHT SIDE BUTTONS */}
        <div className="navbar-actions">
          <div className="navbar-search-container" ref={searchRef}>
            <NavbarSearch />
          </div>

          {/* ✅ LOGIN / LOGOUT */}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Log In
              </Link>
              <button
                className="signup-btn"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* MENU TOGGLE (MOBILE) */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
}
