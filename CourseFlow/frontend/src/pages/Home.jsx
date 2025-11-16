import { FiArrowRight, FiClock, FiStar, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { allCourses } from "../data/CourseData";
import "../styles/Home.css";

const getRecommendedCourses = (allCourses, interest = "AI") =>
  allCourses.filter(c => c.category === interest).slice(0, 4);

const getTopRatedCourses = (allCourses) =>
  [...allCourses].sort((a, b) => b.rating - a.rating).slice(0, 6);

export default function Home() {
  const navigate = useNavigate(); // ✅ për navigim
  const recommended = getRecommendedCourses(allCourses);
  const topRated = getTopRatedCourses(allCourses);

  const renderCourseCard = (course) => (
    <div key={course.id} className="course-card">
      <div
        className="course-image"
        style={{ backgroundImage: `url(${course.image})` }}
      >
        <div className="course-rating">
          <FiStar className="star-icon" />
          <span>{course.rating}</span>
        </div>
      </div>
      <div className="course-content">
        <span className="course-category">{course.category}</span>
        <h3>{course.title}</h3>
        <div className="course-meta">
          <span>
            <FiUsers className="meta-icon" /> {course.students.toLocaleString()}
          </span>
          <span>
            <FiClock className="meta-icon" /> {course.duration}
          </span>
        </div>
        <button
          className="enroll-btn"
          onClick={() => navigate(`/courses/${course.id}`)} // ✅ lidhje drejt detajeve
        >
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
            <h1>
              Advance Your Skills with{" "}
              <span className="highlight">AI-Powered</span> Learning
            </h1>
            <p>
              Personalized course recommendations and interactive learning
              experiences designed to accelerate your career growth and
              knowledge.
            </p>
            <div className="hero-cta">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/register")} // ✅ navigon te register
              >
                Start Learning Free
              </button>
              <button
                className="btn btn-outline"
                onClick={() => navigate("/courses")} // ✅ navigon te kurset
              >
                Explore Courses
              </button>
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
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,
              82.39-16.72,168.19-17.73,250.45-.39C823.78,31,
              906.67,72,985.66,92.83c70.05,18.48,146.53,
              26.09,214.34,3V0H0V27.35A600.21,600.21,
              0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </section>

      {/* Recommended */}
      <section className="courses-section">
        <div className="section-header">
          <h2>Recommended for You</h2>
          <button className="view-all" onClick={() => navigate("/courses")}>
            View All
          </button>
        </div>
        <div className="course-grid">{recommended.map(renderCourseCard)}</div>
      </section>

      {/* Top Rated */}
      <section className="courses-section">
        <div className="section-header">
          <h2>Top Rated Courses</h2>
          <button className="view-all" onClick={() => navigate("/courses")}>
            View All
          </button>
        </div>
        <div className="course-grid">{topRated.map(renderCourseCard)}</div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to advance your career?</h2>
          <p>Join thousands of students learning with our AI-powered platform</p>
          <button
            className="btn btn-primary btn-large"
            onClick={() => navigate("/register")} // ✅ Shtohet këtu
          >
            Get Started for Free
          </button>
        </div>
      </section>
    </div>
  );
}
