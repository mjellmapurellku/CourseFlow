import { FiArrowRight, FiBook, FiClock, FiStar, FiUsers } from "react-icons/fi";
import "./Home.css";

const courses = [
  { 
    id: 1, 
    title: "AI for Beginners", 
    category: "AI", 
    rating: 4.7, 
    students: 1245, 
    duration: "8h 30m",
    image: "https://source.unsplash.com/random/300x200?ai,technology"
  },
  { 
    id: 2, 
    title: "React from Zero to Hero", 
    category: "Programming", 
    rating: 4.8,
    students: 2987,
    duration: "12h 15m",
    image: "https://source.unsplash.com/random/300x200?react,programming"
  },
  { 
    id: 3, 
    title: "UI/UX Design Essentials", 
    category: "Design", 
    rating: 4.6,
    students: 1876,
    duration: "6h 45m",
    image: "https://source.unsplash.com/random/300x200?design,ui"
  },
  { 
    id: 4, 
    title: "Machine Learning 101", 
    category: "AI", 
    rating: 4.9,
    students: 3421,
    duration: "10h 20m",
    image: "https://source.unsplash.com/random/300x200?machine,learning"
  },
  { 
    id: 5, 
    title: "Marketing Mastery", 
    category: "Marketing", 
    rating: 4.5,
    students: 1567,
    duration: "7h 15m",
    image: "https://source.unsplash.com/random/300x200?marketing"
  },
  { 
    id: 6, 
    title: "Business Strategy", 
    category: "Business", 
    rating: 4.4,
    students: 2103,
    duration: "9h 10m",
    image: "https://source.unsplash.com/random/300x200?business,strategy"
  },
  { 
    id: 7, 
    title: "Deep Learning Fundamentals", 
    category: "AI", 
    rating: 4.8,
    students: 2654,
    duration: "11h 30m",
    image: "https://source.unsplash.com/random/300x200?deep,learning"
  }
];

const categories = [
  { name: "AI", icon: <FiBook />, count: 45 },
  { name: "Programming", icon: <FiBook />, count: 67 },
  { name: "Design", icon: <FiBook />, count: 32 },
  { name: "Marketing", icon: <FiBook />, count: 28 },
  { name: "Business", icon: <FiBook />, count: 39 },
  { name: "Data Science", icon: <FiBook />, count: 51 },
  { name: "Project Management", icon: <FiBook />, count: 24 },
  { name: "Finance", icon: <FiBook />, count: 36 },
];

const getRecommendedCourses = (allCourses, interest = "AI") =>
  allCourses.filter(c => c.category === interest).slice(0, 4);

const getTopRatedCourses = (allCourses) =>
  [...allCourses].sort((a, b) => b.rating - a.rating).slice(0, 6);

export default function Home() {
  const recommended = getRecommendedCourses(courses);
  const topRated = getTopRatedCourses(courses);

  const renderCourseCard = (course) => (
    <div key={course.id} className="course-card">
      <div className="course-image" style={{ backgroundImage: `url(${course.image})` }}>
        <div className="course-rating">
          <FiStar className="star-icon" />
          <span>{course.rating}</span>
        </div>
      </div>
      <div className="course-content">
        <span className="course-category">{course.category}</span>
        <h3>{course.title}</h3>
        <div className="course-meta">
          <span><FiUsers className="meta-icon" /> {course.students.toLocaleString()}</span>
          <span><FiClock className="meta-icon" /> {course.duration}</span>
        </div>
        <button className="enroll-btn">
          Enroll Now <FiArrowRight className="arrow-icon" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Advance Your Skills with <span className="highlight">AI-Powered</span> Learning</h1>
            <p>
              Personalized course recommendations and interactive learning experiences
              designed to accelerate your career growth and knowledge.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary">Start Learning Free</button>
              <button className="btn btn-outline">Explore Courses</button>
            </div>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Courses</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Expert Instructors</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card">
              <div className="floating-card-content">
                <div className="floating-card-header">
                  <div className="instructor-avatar">AI</div>
                  <div>
                    <h4>Your Personal AI Tutor</h4>
                    <p>24/7 Learning Assistant</p>
                  </div>
                </div>
                <p>Ready to help you master new skills!</p>
                <div className="floating-card-footer">
                  <span>Active Now</span>
                  <div className="online-indicator"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="wave-shape">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Explore Categories</h2>
          <a href="#" className="view-all">View All</a>
        </div>
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.name} className="category-card">
              <div className="category-icon">
                {category.icon}
              </div>
              <h3>{category.name}</h3>
              <p>{category.count} Courses</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section className="courses-section">
        <div className="section-header">
          <h2>Recommended for You</h2>
          <a href="#" className="view-all">View All</a>
        </div>
        <div className="course-grid">
          {recommended.map(renderCourseCard)}
        </div>
      </section>

      {/* Top Rated */}
      <section className="courses-section">
        <div className="section-header">
          <h2>Top Rated Courses</h2>
          <a href="#" className="view-all">View All</a>
        </div>
        <div className="course-grid">
          {topRated.map(renderCourseCard)}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to advance your career?</h2>
          <p>Join thousands of students learning with our AI-powered platform</p>
          <button className="btn btn-primary btn-large">Get Started for Free</button>
        </div>
      </section>
    </div>
  );
}
