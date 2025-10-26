import { useEffect, useState } from "react";
import { FiChevronDown, FiLogOut, FiMenu, FiSearch, FiX } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const categories = [
  { name: "AI", count: 45 },
  { name: "Programming", count: 67 },
  { name: "Design", count: 32 },
  { name: "Marketing", count: 28 },
  { name: "Business", count: 39 },
  { name: "Data Science", count: 51 },
  { name: "Project Management", count: 24 },
  { name: "Finance", count: 36 },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in on component mount and when location changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* EXPLORE DROPDOWN */}
        <div className="explore-dropdown">
          <button 
            className="explore-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Explore <FiChevronDown className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
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
                  <span className="category-count">{category.count} courses</span>
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
          <button className="search-btn" aria-label="Search">
            <FiSearch />
          </button>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Log In
              </Link>
              <Link to="/signup" className="signup-btn">
                Get Started
              </Link>
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
