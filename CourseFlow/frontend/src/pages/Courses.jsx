import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiBook,
  FiClock,
  FiFilter,
  FiSearch,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../services/api";
import "../styles/Courses.css";

export default function Courses() {
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("popular");

  const [categories, setCategories] = useState(["All"]);
  const [levels, setLevels] = useState(["All Levels"]);
  const [paidCourses, setPaidCourses] = useState(new Set());

  useEffect(() => {
  const fetchCoursesAndEnrollments = async () => {
    try {
      const res = await getCourses();

      const coursesArray = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setAllCourses(coursesArray);

      setCategories([
        "All",
        ...new Set(coursesArray.map((c) => c.category).filter(Boolean)),
      ]);

      setLevels([
        "All Levels",
        ...new Set(coursesArray.map((c) => c.level).filter(Boolean)),
      ]);

      const token = localStorage.getItem("token");
      if (!token) return;

      // 🔑 check enrollment status for each course
      const paidSet = new Set();

      await Promise.all(
        coursesArray.map(async (course) => {
          try {
            const res = await fetch(
              `https://localhost:55554/api/enrollment/status?courseId=${course.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (res.ok) {
              const data = await res.json();
              if (data.isEnrolled) {
                paidSet.add(course.id);
              }
            }
          } catch (_) {}
        })
      );

      setPaidCourses(paidSet);
    } catch (err) {
      console.error("COURSE FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCoursesAndEnrollments();
}, []);

  const filteredCourses = allCourses
    .filter((course) => {
      const matchesSearch = course.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;

      const matchesLevel =
        selectedLevel === "All Levels" || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.students - a.students;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

  const renderCourseCard = (course) => (
    <div key={course.id} className="course-card">
      <div
        className="course-image"
        style={{
          backgroundImage: `url(${course.image || "/placeholder.jpg"})`,
        }}
      >
        <div className="course-rating">
          <FiStar className="star-icon" />
          <span>{course.rating || 0}</span>
        </div>
        <div className="course-level">{course.level || "N/A"}</div>
      </div>

      <div className="course-content">
        <span className="course-category">{course.category}</span>
        <h3>{course.title}</h3>

        <div className="course-meta">
          <span>
            <FiUsers className="meta-icon" /> {course.students || 0}
          </span>
          <span>
            <FiClock className="meta-icon" /> {course.duration || "—"}
          </span>
        </div>

        <div className="course-footer">
          <div className="course-price">
            {course.price ? `$${course.price}` : "Free"}
          </div>

       <button
          className="enroll-btn"
          onClick={() => {
            if (paidCourses.has(course.id)) {
              navigate(`/courses/${course.id}/player`);
            } else {
              navigate(`/courses/${course.id}`);
            }
          }}
        >
          {paidCourses.has(course.id)
            ? "Continue Learning"
            : "Enroll"}
          <FiArrowRight className="arrow-icon" />
       </button>
        </div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="loading-courses">
        <h3>Loading Courses...</h3>
      </div>
    );

  return (
    <div id="courses-page-container" className="courses-page">
      <section className="courses-hero">
        <div className="courses-hero-content">
          <h1>Explore Our Courses</h1>
          <p>Discover courses to advance your skills</p>
        </div>
      </section>

      <section className="filters-section">
        <div className="filters-container">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <FiFilter className="filter-icon" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <FiBook className="filter-icon" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {levels.map((lvl) => (
                  <option key={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="courses-results">
        <div className="courses-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(renderCourseCard)
          ) : (
            <div className="no-results">
              <FiBook />
              <h3>No courses found</h3>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
