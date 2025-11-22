import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  createEnrollment,
  getCourseById,
  getEnrollmentStatus
} from "../services/api";
import "../styles/CourseDetails.css";

export default function CourseDetails() {
  const { id } = useParams();
  const courseId = parseInt(id, 10);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [progress, setProgress] = useState(0);
  const [lessons, setLessons] = useState([]);

  const [selectedLesson, setSelectedLesson] = useState(null);

  // ---------------------------------------------------------
  // Extract userId from localStorage
  // ---------------------------------------------------------
  const storedUser = localStorage.getItem("user");
  let userId = null;

  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed?.id) userId = parsed.id;
      if (parsed?.data?.id) userId = parsed.data.id;
      if (parsed?.user?.id) userId = parsed.user.id;
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
    }
  }

  // ---------------------------------------------------------
  // Fetch Course Details
  // ---------------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        const res = await getCourseById(courseId);
        setCourse(res.data);
      } catch (err) {
        console.error("Failed to fetch course", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  // ---------------------------------------------------------
  // Fetch Lessons
  // ---------------------------------------------------------
  useEffect(() => {
    async function loadLessons() {
      try {
        const res = await axios.get(
          `https://localhost:55554/api/lesson/course/${courseId}`
        );
        setLessons(res.data);

        // Set default selected lesson
        if (res.data.length > 0) setSelectedLesson(res.data[0]);
      } catch (err) {
        console.error("Failed to load lessons", err);
      }
    }
    loadLessons();
  }, [courseId]);

  // ---------------------------------------------------------
  // Fetch Enrollment Status
  // ---------------------------------------------------------
  useEffect(() => {
    if (!userId) return;

    getEnrollmentStatus(userId, courseId)
      .then(res => {
        setEnrollment(res.data);
        setProgress(res.data?.progressPercent || 0);
      })
      .catch(() => {});
  }, [userId, courseId]);

  const alreadyEnrolled = !!enrollment;

  // ---------------------------------------------------------
  // Handle Clicking Lesson
  // ---------------------------------------------------------
  const handleLessonClick = (lesson) => {
    if (!alreadyEnrolled) {
      alert("You must enroll to watch the lessons.");
      return;
    }
    setSelectedLesson(lesson);
  };

  // ---------------------------------------------------------
  // Handle Enroll
  // ---------------------------------------------------------
  const handleEnroll = async () => {
    if (!userId) {
      alert("You must be logged in.");
      return;
    }

    setIsEnrolling(true);

    try {
      const res = await createEnrollment({ userId, courseId });
      setEnrollment(res.data);
      setProgress(res.data.progressPercent || 0);
      alert("Enrolled successfully!");
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Already enrolled.");
      } else {
        alert("Enrollment failed.");
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  // ---------------------------------------------------------
  // Render Video (selected lesson if enrolled)
  // ---------------------------------------------------------
  const renderVideo = () => {
    const videoUrl =
      alreadyEnrolled && selectedLesson
        ? selectedLesson.videoUrl
        : course.videoUrl;

    if (!videoUrl) {
      return <div>No video available</div>;
    }

    if (
      videoUrl.includes("youtube.com") ||
      videoUrl.includes("youtu.be")
    ) {
      return (
        <iframe
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}`}
          title={selectedLesson?.title || course.title}
          frameBorder="0"
          allowFullScreen
        />
      );
    }

    if (videoUrl.endsWith(".mp4")) {
      return (
        <video width="100%" height="360" controls>
          <source src={videoUrl} type="video/mp4" />
        </video>
      );
    }

    return (
      <img
        src={course.image || "/assets/default-course.jpg"}
        alt=""
        width="100%"
        height="360"
        style={{ objectFit: "cover" }}
      />
    );
  };

  return (
    <div className="course-details">

      {/* ------------------- HEADER ------------------- */}
      <div className="course-header">
        <h1>{course.title}</h1>
        {alreadyEnrolled && <span className="badge enrolled">Enrolled</span>}
      </div>

      {/* ------------------- CONTENT ------------------- */}
      <div className="course-content">

        {/* LEFT SIDE — VIDEO */}
        <div className="video-section">
          {renderVideo()}

          <div className="course-stats">
            <div>⭐ {course.rating || "—"}</div>
            <div>⏳ {course.duration || "—"}</div>
            <div>📊 {course.level || "—"}</div>
            <div>📚 {course.category || "—"}</div>
          </div>
        </div>

        {/* RIGHT SIDE — INFO + LESSONS */}
        <div className="info-section">

          {/* ABOUT COURSE */}
          <div className="info-card">
            <h2>About this course</h2>

            <p>{course.description}</p>

            <div className="info-field">
              <strong>Price:</strong>{" "}
              {course.price ? `$${course.price}` : "Free"}
            </div>

            {alreadyEnrolled && (
              <div className="progress-block">
                <strong>Your Progress:</strong>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span>{progress}% completed</span>
              </div>
            )}

            <button
              className="enroll-btn"
              onClick={handleEnroll}
              disabled={alreadyEnrolled || isEnrolling}
            >
              {alreadyEnrolled
                ? "You are enrolled"
                : isEnrolling
                ? "Processing..."
                : "Enroll Now →"}
            </button>
          </div>

          {/* --------- LESSONS SIDEBAR --------- */}
          {lessons.length > 0 && (
            <div className="lessons-card">
              <h3>Course Lessons</h3>
              <ul className="lessons-list">
                {lessons.map((lesson) => {
                  const locked = !alreadyEnrolled;

                  return (
                    <li
                      key={lesson.id}
                      className={`lesson-item ${
                        selectedLesson?.id === lesson.id ? "active" : ""
                      } ${locked ? "locked" : ""}`}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <span>
                        {lesson.order}. {lesson.title}
                      </span>

                      {locked && <span className="lock-icon">🔒</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Extract YouTube ID
// ---------------------------------------------------------
function extractYouTubeId(url = "") {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    return u.pathname.split("/").pop();
  } catch {
    return "";
  }
}
 