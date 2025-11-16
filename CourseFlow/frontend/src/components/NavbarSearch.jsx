import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "../styles/NavbarSearch.css";

export default function NavbarSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/courses?search=${encodeURIComponent(query)}`);
      setQuery("");
      setOpen(false);
    }
  };

  return (
    <div className="navbar-search" ref={searchRef}>
      <form
        className={`search-form ${open ? "open" : ""}`}
        onSubmit={handleSearch}
      >
        <input
          type="text"
          className="search-input"
          placeholder="Search courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className="search-icon-btn"
          onClick={() => setOpen(!open)}
        >
          <FiSearch />
        </button>
      </form>
    </div>
  );
}
