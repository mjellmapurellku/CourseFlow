import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLessonsByCourseId } from "../services/api";

export default function CourseCard({ course }) {
  const [firstLesson, setFirstLesson] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await getLessonsByCourseId(course.id);
      setFirstLesson(res.data[0]);
    }
    load();
  }, [course.id]);

  return (
    <div className="course-card">
      <Link to={`/course/${course.id}`}>
        <img src={course.imageUrl} alt={course.title} />
      </Link>

      <h3>{course.title}</h3>
      <p>{course.shortDescription}</p>

      {firstLesson ? (
        <Link
          className="start-btn"
          to={`/courseplayer/${course.id}/${firstLesson.id}`}
        >
          Start My First Lesson →
        </Link>
      ) : (
        <Link className="start-btn" to={`/course/${course.id}`}>
          View Course →
        </Link>
      )}
    </div>
  );
}
