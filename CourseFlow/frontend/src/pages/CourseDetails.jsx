import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import CoursePlayer from "../pages/CoursePlayer";
import "../styles/CourseDetails.css";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [showTrialModal, setShowTrialModal] = useState(false);

  const user = useSelector((state) => state.user.user);
  const userId = user?.id ?? user?.userId;

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Fetch course data
        const courseRes = await fetch(`https://localhost:55554/api/course/${id}`, {
          credentials: "include",
        });

        if (!courseRes.ok) throw new Error("Failed to fetch course");

        const courseData = await courseRes.json();

        // Normalize lessons
        const lessons = courseData.Lessons || courseData.lessons || [];
        const normalizedLessons = lessons.map((lesson) => ({
          id: lesson.id ?? lesson.Id,
          title: lesson.title ?? lesson.Title,
          videoUrl: lesson.videoUrl ?? lesson.VideoUrl,
          order: lesson.order ?? lesson.Order,
          allowedSegments: lesson.allowedSegments ?? lesson.AllowedSegments,
        }));

        setCourse({
          ...courseData,
          lessons: normalizedLessons,
        });

        if (normalizedLessons.length > 0) {
          setCurrentLesson(normalizedLessons[0]);
        }

        // Check enrollment
        if (userId) {
          try {
            const enrollmentRes = await fetch(
              `https://localhost:55554/api/enrollment/status?userId=${userId}&courseId=${id}`,
              { credentials: "include" }
            );
            setEnrolled(enrollmentRes.ok);
          } catch (err) {
            console.error("Error checking enrollment:", err);
            setEnrolled(false);
          }
        }

        // Fetch instructor name if not already present
        if (courseData.InstructorId && !courseData.teacherName) {
          try {
            const userRes = await fetch(
              `https://localhost:55554/api/user/${courseData.InstructorId}`,
              { credentials: "include" }
            );
            if (userRes.ok) {
              const instructorData = await userRes.json();
              setCourse((prev) => ({
                ...prev,
                teacherName: instructorData.name ?? instructorData.username ?? "Unknown",
              }));
            }
          } catch (err) {
            console.error("Error fetching instructor:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };

    fetchCourseData();
  }, [id, userId]);

  const handleEnroll = async () => {
    try {
      const response = await fetch("https://localhost:55554/api/enrollment/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId: id }),
        credentials: "include",
      });
      if (response.ok) setEnrolled(true);
    } catch (err) {
      console.error("Error enrolling in course:", err);
    }
  };

  const handleStripeCheckout = async () => {
    try {
      const response = await fetch(
        "https://localhost:55554/api/billing/create-checkout-session",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            email: user?.email ?? user?.data?.email,
            courseId: id,
          }),
        }
      );

      const data = await response.json();
      if (!data.url) return alert("Stripe session failed");

      window.location.href = data.url;
    } catch (err) {
      console.error("Stripe Checkout error", err);
      alert("Unable to start checkout.");
    }
  };

  if (!course) return <p>Loading course...</p>;

  return (
    <>
      <Navbar />
      <div className="course-details-container">
        {/* Left side */}
        <div className="course-main">
          <h1>{course.title}</h1>

          <div className="video-container">
            {enrolled ? (
              <CoursePlayer
                videoUrl={currentLesson?.videoUrl}
                allowedSegments={currentLesson?.allowedSegments}
              />
            ) : (
              <div className="locked-video">
                {currentLesson?.videoUrl ? (
                  <CoursePlayer videoUrl={currentLesson.videoUrl} previewMode={true} />
                ) : (
                  <p>No video preview available.</p>
                )}
                <div className="video-overlay">
                  <h2>This lesson is locked</h2>
                  <button className="btn primary" onClick={handleStripeCheckout}>
                    Start free trial (Stripe)
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lessons-section">
            <h2>Lessons</h2>
            <ul className="lesson-list">
              {course.lessons.length > 0 ? (
                course.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    onClick={() => {
                      if (enrolled || lesson.id === course.lessons[0]?.id) {
                        setCurrentLesson(lesson);
                      }
                    }}
                    className={!enrolled && lesson.id !== course.lessons[0]?.id ? "locked" : ""}
                  >
                    {lesson.title}
                    {!enrolled && lesson.id !== course.lessons[0]?.id && <span className="lock-icon">🔒</span>}
                  </li>
                ))
              ) : (
                <p>No lessons available.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="course-sidebar">
          <h3>About this course</h3>
          <p><strong>Lessons:</strong> {course.lessons?.length ?? 0}</p>
          <p><strong>Category:</strong> {course.category}</p>
          <p><strong>Uploaded by:</strong> {course.teacherName}</p>
          <p className="course-description">{course.description}</p>

          {!enrolled ? (
            <>
              <button className="btn primary" onClick={handleEnroll}>Enroll in course</button>
              <p className="or">or</p>
              <button className="btn outline" onClick={handleStripeCheckout}>
                Start 7-day free trial (Stripe)
              </button>
            </>
          ) : (
            <p className="enrolled-text">You are enrolled</p>
          )}
        </div>
      </div>

      {showTrialModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Start Free Trial</h2>
            <p>Unlock all courses for 7 days — cancel anytime.</p>
            <button className="btn primary" onClick={handleStripeCheckout}>Start Free Trial (Stripe)</button>
            <button className="btn outline" onClick={() => setShowTrialModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
