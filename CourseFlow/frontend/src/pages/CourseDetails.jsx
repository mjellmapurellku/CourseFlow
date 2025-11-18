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

  // get the logged in user
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;

  // 📌 FETCH COURSE DETAILS
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

  // 📌 FETCH ENROLLMENT STATUS
  useEffect(() => {
    if (!userId) return;

    getEnrollmentStatus(userId, courseId)
      .then(res => {
        setEnrollment(res.data);
        setProgress(res.data?.progressPercent || 0);
      })
      .catch(() => {
        // Not enrolled → ignore
      });
  }, [userId, courseId]);

  // 📌 HANDLE ENROLL
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

  const alreadyEnrolled = !!enrollment;

  // 📌 Determine what video to show
  const renderVideo = () => {
    if (course.videoUrl?.includes("youtube.com") || course.videoUrl?.includes("youtu.be")) {
      return (
        <iframe
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${extractYouTubeId(course.videoUrl)}`}
          title={course.title}
          frameBorder="0"
          allowFullScreen
        />
      );
    }

    if (course.videoUrl?.endsWith(".mp4")) {
      return (
        <video width="100%" height="360" controls>
          <source src={course.videoUrl} type="video/mp4" />
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

        {/* LEFT SIDE — VIDEO + STATS */}
        <div className="video-section">
          {renderVideo()}

          <div className="course-stats">
            <div>⭐ {course.rating || "—"}</div>
            <div>⏳ {course.duration || "—"}</div>
            <div>📊 {course.level || "—"}</div>
            <div>📚 {course.category || "—"}</div>
          </div>
        </div>

        {/* RIGHT SIDE — INFO CARD */}
        <div className="info-section">
          <div className="info-card">
            <h2>About this course</h2>

            <p>{course.description}</p>

            <div className="info-field">
              <strong>Price:</strong> {course.price ? `$${course.price}` : "Free"}
            </div>

            {/* ---------- Progress ---------- */}
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

            {/* ---------- Enroll Button ---------- */}
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

          {/* ---------- OPTIONAL: Lessons ---------- */}
          {course.lessons && course.lessons.length > 0 && (
            <div className="lessons-card">
              <h3>Course Lessons</h3>
              <ul>
                {course.lessons.map((lesson) => (
                  <li key={lesson.id}>{lesson.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function extractYouTubeId(url = "") {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/");
    return parts[parts.length - 1];
  } catch {
    return "";
  }
}
