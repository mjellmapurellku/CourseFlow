import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
          <Link to="/login" className="login-btn">
            Log In
          </Link>
          <Link to="/signup" className="signup-btn">
            Get Started
          </Link>
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
