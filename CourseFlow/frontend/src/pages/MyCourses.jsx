import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserEnrollments, updateProgress } from "../services/api";
import "../styles/MyCourses.css";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id ?? 1;

  useEffect(() => {
    if (!userId) return;

    async function load() {
      try {
        const res = await getUserEnrollments(userId);
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to load enrollments", err);
      }
    }

    load();
  }, [userId]);

  const handleProgress = async (courseId, newValue) => {
    try {
      await updateProgress(userId, courseId, newValue);

      setCourses(prev =>
        prev.map(c =>
          c.courseId === courseId ? { ...c, progressPercent: newValue } : c
        )
      );
    } catch (error) {
      console.error("Failed to update progress", error);
    }
  };

  return (
    <div className="my-courses-container">
      <h1>My Courses</h1>

      {courses.length === 0 && <p>You are not enrolled in any courses.</p>}

      <div className="course-list">
        {courses.map((e) => (
          <div key={e.id} className="course-card">
            <img src={e.course.image || "/assets/default-course.jpg"} alt="" />

            <h3>{e.course.title}</h3>

            <div className="progress-section">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${e.progressPercent}%` }}
                />
              </div>
              <span>{e.progressPercent}% completed</span>

              <input
                type="range"
                min="0"
                max="100"
                value={e.progressPercent}
                onChange={(ev) =>
                  handleProgress(e.courseId, parseInt(ev.target.value))
                }
              />
            </div>

            <Link className="continue-btn" to={`/course/${e.courseId}`}>
              Continue →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
