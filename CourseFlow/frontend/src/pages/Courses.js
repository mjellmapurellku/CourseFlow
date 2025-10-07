import { useState } from "react";
import { FiArrowRight, FiBook, FiClock, FiFilter, FiSearch, FiStar, FiUsers } from "react-icons/fi";
import "./Courses.css";

const allCourses = [
  { 
    id: 1, 
    title: "AI for Beginners", 
    category: "AI", 
    rating: 4.7, 
    students: 1245, 
    duration: "8h 30m",
    price: 49.99,
    level: "Beginner",
    image: "https://source.unsplash.com/random/300x200?ai,technology"
  },
  { 
    id: 2, 
    title: "React from Zero to Hero", 
    category: "Programming", 
    rating: 4.8,
    students: 2987,
    duration: "12h 15m",
    price: 59.99,
    level: "Intermediate",
    image: "https://source.unsplash.com/random/300x200?react,programming"
  },
  { 
    id: 3, 
    title: "UI/UX Design Essentials", 
    category: "Design", 
    rating: 4.6,
    students: 1876,
    duration: "6h 45m",
    price: 39.99,
    level: "Beginner",
    image: "https://source.unsplash.com/random/300x200?design,ui"
  },
  { 
    id: 4, 
    title: "Machine Learning 101", 
    category: "AI", 
    rating: 4.9,
    students: 3421,
    duration: "10h 20m",
    price: 69.99,
    level: "Advanced",
    image: "https://source.unsplash.com/random/300x200?machine,learning"
  },
  { 
    id: 5, 
    title: "Marketing Mastery", 
    category: "Marketing", 
    rating: 4.5,
    students: 1567,
    duration: "7h 15m",
    price: 44.99,
    level: "Intermediate",
    image: "https://source.unsplash.com/random/300x200?marketing"
  },
  { 
    id: 6, 
    title: "Business Strategy", 
    category: "Business", 
    rating: 4.4,
    students: 2103,
    duration: "9h 10m",
    price: 54.99,
    level: "Intermediate",
    image: "https://source.unsplash.com/random/300x200?business,strategy"
  },
  { 
    id: 7, 
    title: "Deep Learning Fundamentals", 
    category: "AI", 
    rating: 4.8,
    students: 2654,
    duration: "11h 30m",
    price: 79.99,
    level: "Advanced",
    image: "https://source.unsplash.com/random/300x200?deep,learning"
  },
  { 
    id: 8, 
    title: "Python Programming Masterclass", 
    category: "Programming", 
    rating: 4.7,
    students: 3892,
    duration: "15h 45m",
    price: 64.99,
    level: "Beginner",
    image: "https://source.unsplash.com/random/300x200?python,code"
  },
  { 
    id: 9, 
    title: "Data Science with Python", 
    category: "Data Science", 
    rating: 4.8,
    students: 2341,
    duration: "13h 20m",
    price: 74.99,
    level: "Intermediate",
    image: "https://source.unsplash.com/random/300x200?data,science"
  },
  { 
    id: 10, 
    title: "Advanced JavaScript", 
    category: "Programming", 
    rating: 4.6,
    students: 1987,
    duration: "10h 30m",
    price: 54.99,
    level: "Advanced",
    image: "https://source.unsplash.com/random/300x200?javascript"
  },
  { 
    id: 11, 
    title: "Graphic Design Fundamentals", 
    category: "Design", 
    rating: 4.5,
    students: 1543,
    duration: "8h 15m",
    price: 42.99,
    level: "Beginner",
    image: "https://source.unsplash.com/random/300x200?graphic,design"
  },
  { 
    id: 12, 
    title: "Digital Marketing Strategy", 
    category: "Marketing", 
    rating: 4.7,
    students: 2156,
    duration: "9h 40m",
    price: 49.99,
    level: "Intermediate",
    image: "https://source.unsplash.com/random/300x200?digital,marketing"
  },
];

const categories = ["All", "AI", "Programming", "Design", "Marketing", "Business", "Data Science"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function Courses() {
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
          <button className="enroll-btn">
            Enroll <FiArrowRight className="arrow-icon" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="courses-page">
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
