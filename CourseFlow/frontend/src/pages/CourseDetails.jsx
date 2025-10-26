import { useState } from "react";
import "../styles/CourseDetails.css";

function CourseDetails() {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = () => {
    setIsEnrolling(true);
    setTimeout(() => setIsEnrolling(false), 2000);
  };

  return (
    <div className="course-details">
      <div className="course-header">
        <div className="header-badge">Featured Course</div>
        <h1 className="course-title">
          Master Modern Web Development
        </h1>
        <p className="course-subtitle">
          Transform your career with cutting-edge skills in React, TypeScript, and modern web technologies.
        </p>
      </div>

      <div className="course-content">
        <div className="video-section">
          <div className="video-wrapper">
            <video controls poster="/assets/youware-bg.png">
              <source src="/path/to/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-overlay">
              <div className="play-button">▶</div>
            </div>
          </div>
          
          <div className="course-stats">
            <div className="stat-item">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-value">12,847</div>
                <div className="stat-label">Students Enrolled</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-value">4.8/5.0</div>
                <div className="stat-label">Course Rating</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎓</div>
              <div className="stat-content">
                <div className="stat-value">9,234</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h2 className="section-title">About This Course</h2>
            <p className="section-description">
              This comprehensive course takes you from fundamentals to advanced concepts.
              You'll build real-world projects, master industry best practices, and gain
              the confidence to tackle any web development challenge.
            </p>

            <div className="course-meta">
              <div className="meta-item">
                <span className="meta-icon">⏱️</span>
                <div className="meta-details">
                  <span className="meta-label">Duration</span>
                  <span className="meta-value">8h 30m</span>
                </div>
              </div>
              <div className="meta-item">
                <span className="meta-icon">👨‍🏫</span>
                <div className="meta-details">
                  <span className="meta-label">Instructor</span>
                  <span className="meta-value">John Doe</span>
                </div>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📊</span>
                <div className="meta-details">
                  <span className="meta-label">Level</span>
                  <span className="meta-value">Beginner</span>
                </div>
              </div>
            </div>

            <button 
              className={`enroll-btn ${isEnrolling ? 'enrolling' : ''}`}
              onClick={handleEnroll}
              disabled={isEnrolling}
            >
              {isEnrolling ? (
                <>
                  <span className="btn-spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  Enroll Now
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>

            <div className="course-features">
              <h3 className="features-title">What You'll Learn</h3>
              <ul className="features-list">
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  Build production-ready React applications
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  Master TypeScript for type-safe development
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  Implement modern state management patterns
                </li>
                <li className="feature-item">
                  <span className="feature-check">✓</span>
                  Deploy scalable web applications
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
