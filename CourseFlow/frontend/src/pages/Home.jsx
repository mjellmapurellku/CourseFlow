import axios from "axios";
import { useEffect, useState } from "react";
import { FiArrowRight, FiClock, FiStar, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:55554/api/course") 
      .then((res) => setCourses(res.data || []))
      .catch((err) => console.log("Error loading courses:", err));
  }, []);

  // ----- SAFE ARRAYS -----
  const recommended = courses.slice(0, 3);

  // ----- FIXED TOP RATED -----
  const topRated = [...courses]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)) // treat null as 0
    .slice(0, 6);

  // ----- RENDER COURSE CARD -----
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
          <span>{course.rating ?? 0}</span>
        </div>
      </div>

      <div className="course-content">
        <span className="course-category">{course.category || "General"}</span>
        <h3>{course.title || "Untitled Course"}</h3>

        <div className="course-meta">
          <span>
            <FiUsers className="meta-icon" /> {course.students ?? 0}
          </span>
          <span>
            <FiClock className="meta-icon" /> {course.duration ?? "—"}
          </span>
        </div>

       <button
          className="enroll-btn"
          onClick={() => navigate(`/courses/${course.id}`)}
        >
          Enroll Now <FiArrowRight className="arrow-icon" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="home-container">

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Advance Your Skills with{" "}
              <span className="highlight">AI-Powered</span> Learning
            </h1>
            <p>
              Personalized course recommendations and interactive learning experiences.
            </p>

            <div className="hero-cta">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/register")}
              >
                Start Learning Free
              </button>

              <button
                className="btn btn-outline"
                onClick={() => navigate("/courses")}
              >
                Explore Courses
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RECOMMENDED */}
      <section className="courses-section">
        <div className="section-header">
          <h2>Recommended for You</h2>
          <button className="view-all" onClick={() => navigate("/courses")}>
            View All
          </button>
        </div>

        <div className="course-grid">
          {recommended.length > 0 ? (
            recommended.map(renderCourseCard)
          ) : (
            <p>No recommended courses available.</p>
          )}
        </div>
      </section>

      {/* TOP RATED */}
      <section className="courses-section">
        <div className="section-header">
          <h2>Top Rated Courses</h2>
          <button className="view-all" onClick={() => navigate("/courses")}>
            View All
          </button>
        </div>

        <div className="course-grid">
          {topRated.length > 0 ? (
            topRated.map(renderCourseCard)
          ) : (
            <p>No top-rated courses available.</p>
          )}
        </div>
      </section>

    </div>
  );
}
