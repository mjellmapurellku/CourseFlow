import { useState } from "react";
import { FiArrowRight, FiBook, FiClock, FiFilter, FiSearch, FiStar, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { allCourses } from "../data/CourseData";
import "../styles/Courses.css";

const categories = ["All", "AI", "Programming", "Design", "Marketing", "Business", "Data Science"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function Courses() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("popular");

  const filteredCourses = allCourses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
      const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
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
      <div className="course-image" style={{ backgroundImage: `url(${course.image})` }}>
        <div className="course-rating">
          <FiStar className="star-icon" />
          <span>{course.rating}</span>
        </div>
        <div className="course-level">{course.level}</div>
      </div>
      <div className="course-content">
        <span className="course-category">{course.category}</span>
        <h3>{course.title}</h3>
        <div className="course-meta">
          <span><FiUsers className="meta-icon" /> {course.students.toLocaleString()}</span>
          <span><FiClock className="meta-icon" /> {course.duration}</span>
        </div>
        <div className="course-footer">
          <div className="course-price">${course.price}</div>
         <button 
            className="enroll-btn"
            onClick={() => navigate(`/courses/${course.id}`)} 
        >         
        Enroll <FiArrowRight className="arrow-icon" />
        </button>
        </div>
      </div>
    </div>
  );

  return (
    <div id="courses-page-container" className="courses-page">
      {/* Hero Section */}
      <section className="courses-hero">
        <div className="courses-hero-content">
          <h1>Explore Our Courses</h1>
          <p>Discover thousands of courses to advance your skills and career</p>
        </div>
      </section>

      {/* Filters and Search */}
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
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <FiBook className="filter-icon" />
              <select 
                value={selectedLevel} 
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
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
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="courses-results">
        <div className="results-header">
          <h2>
            {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'} Found
          </h2>
        </div>
        <div className="courses-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(renderCourseCard)
          ) : (
            <div className="no-results">
              <FiBook className="no-results-icon" />
              <h3>No courses found</h3>
              <p>Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
