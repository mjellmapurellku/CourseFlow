import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/CoursePlayer.css";

const CoursePlayer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const token = localStorage.getItem("token");

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("watch?v=")) {
      const videoId = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await axios.get(
          `https://localhost:55554/api/course/${courseId}/player`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : undefined,
          }
        );

        const data = res.data;

        setEnrolled(data.enrolled);
        setCourse(data.course);
        setProgress(data.course.progress ?? 0);
        setLessons(data.lessons);

        if (!lessonId && data.lessons.length > 0) {
          navigate(`/courses/${courseId}/player/${data.lessons[0].id}`);
        }
      } catch (err) {
        console.error("Failed to load course player", err);

        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, lessonId, token, navigate]);

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>Course not found</p>;

  // ✅ DEFINE FIRST (this was the crash)
  const currentLesson =
    lessons.find((l) => String(l.id) === String(lessonId)) || lessons[0];

  const currentIndex = lessons.findIndex(
    (l) => String(l.id) === String(currentLesson?.id)
  );

  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="course-player">
      {/* COURSE HEADER */}
      <div className="course-header">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </div>

      {/* PROGRESS */}
      <div className="course-progress">
        Progress: {progress}%
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* VIDEO PLAYER */}
      {enrolled && currentLesson ? (
        <div className="video-wrapper">
          <h2>{currentLesson.title}</h2>

          <iframe
            width="100%"
            height="480"
            src={getYoutubeEmbedUrl(currentLesson.videoUrl)}
            title={currentLesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "10px", marginBottom: "20px" }}
          ></iframe>

          <div className="lesson-navigation">
            <button
              disabled={!prevLesson}
              onClick={() =>
                navigate(`/courses/${courseId}/player/${prevLesson.id}`)
              }
              className="nav-btn"
            >
              ⬅ Previous
            </button>

            <button
              className="nav-btn"
              disabled={!nextLesson}
              onClick={async () => {
                try {
                  const res = await axios.post(
                    `https://localhost:55554/api/Enrollment/complete-lesson?courseId=${courseId}`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  setProgress(res.data.progressPercent);

                  navigate(
                    `/courses/${courseId}/player/${nextLesson.id}`
                  );
                } catch (err) {
                  console.error("Failed to update progress", err);
                }
              }}
            >
              Next ➡
            </button>
          </div>
        </div>
      ) : (
        <div className="locked-message">
          <p>This course is locked. Please enroll to access lessons.</p>
        </div>
      )}

      {/* LESSON LIST */}
      <div className="lessons-section">
        <h2>Lessons ({lessons.length})</h2>

        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="lesson-card">
            <div className="lesson-info">
              <span className="lesson-index">{index + 1}</span>
              <span className="lesson-title">{lesson.title}</span>
            </div>

            {enrolled ? (
              <button
                className="lesson-btn"
                onClick={() =>
                  navigate(`/courses/${courseId}/player/${lesson.id}`)
                }
              >
                ▶ Play
              </button>
            ) : (
              <span className="lesson-locked">🔒 Locked</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePlayer;
