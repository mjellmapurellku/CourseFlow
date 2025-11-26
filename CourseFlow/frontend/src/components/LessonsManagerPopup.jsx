import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import {
  createLesson,
  deleteLesson,
  getLessonsByCourse,
  updateLesson
} from "../services/api";
// import "../styles/LessonsManagerPopup.css";

export default function LessonsManagerPopup({
  courseId,
  lessonToEdit,
  onClose,
  onSaved
}) {
  const [lesson, setLesson] = useState({
    title: "",
    description: "",
    videoUrl: "",
    order: 1,
    courseId: courseId,
  });

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
    if (lessonToEdit) setLesson(lessonToEdit);
  }, [courseId, lessonToEdit]);

  const loadLessons = async () => {
    try {
      const res = await getLessonsByCourse(courseId);
      setLessons(res.data);
    } catch (err) {
      console.error("Failed to load lessons", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (lessonToEdit) {
        await updateLesson(lesson.id, lesson);
      } else {
        await createLesson(lesson);
      }

      onSaved();
    } catch (err) {
      console.error("Failed to save lesson", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete lesson?")) return;
    try {
      await deleteLesson(id);
      loadLessons();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">

        <h2>{lessonToEdit ? "Edit Lesson" : "Add Lesson"}</h2>

        <label>Title</label>
        <input
          type="text"
          value={lesson.title}
          onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
        />

        <label>Description</label>
        <textarea
          value={lesson.description}
          onChange={(e) =>
            setLesson({ ...lesson, description: e.target.value })
          }
        />

        <label>Video URL</label>
        <input
          type="text"
          value={lesson.videoUrl}
          onChange={(e) => setLesson({ ...lesson, videoUrl: e.target.value })}
        />

        <label>Order</label>
        <input
          type="number"
          value={lesson.order}
          onChange={(e) =>
            setLesson({ ...lesson, order: Number(e.target.value) })
          }
        />

        <div className="popup-actions">
          <button className="save-btn" onClick={handleSave}>
            <FaPlus /> Save
          </button>

          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <hr />

        <h3>Existing Lessons</h3>

        {loading ? (
          <p>Loading…</p>
        ) : lessons.length === 0 ? (
          <p>No lessons found.</p>
        ) : (
          <ul className="lessons-list">
            {lessons.map((l) => (
              <li key={l.id}>
                <span>
                  {l.order}. {l.title}
                </span>

                <div className="lesson-actions">
                  <button onClick={() => onSaved(l)}>
                    <FaEdit />
                  </button>

                  <button onClick={() => handleDelete(l.id)}>
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
