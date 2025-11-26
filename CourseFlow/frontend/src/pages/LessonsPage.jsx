import { useEffect, useState } from "react";
import {
    FaBook,
    FaEdit,
    FaPlus,
    FaSearch,
    FaTrash,
} from "react-icons/fa";

import {
    createLesson,
    deleteLesson,
    getCourses,
    getLessonsByCourse,
    updateLesson,
} from "../services/api";

import "../styles/CoursePage.css";
import "../styles/LessonsPage.css";

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourseId, setFilterCourseId] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    order: "",
    courseId: "",
  });

  useEffect(() => {
    loadCourses();
    loadLessons();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  };

  const loadLessons = async (courseId = null) => {
    try {
      const res = courseId
        ? await getLessonsByCourse(courseId)
        : await getLessonsByCourse();

      setLessons(res.data);
    } catch (err) {
      console.error("Error loading lessons:", err);
    }
  };

  const handleFilter = async (courseId) => {
    setFilterCourseId(courseId);
    if (courseId) loadLessons(courseId);
    else loadLessons();
  };

  const getThumbnail = (url) => {
    if (!url) return "";
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (!match) return "";
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...formData };

      if (editingId) {
        await updateLesson(editingId, payload);
      } else {
        await createLesson(payload);
      }

      setShowForm(false);
      setEditingId(null);

      loadLessons(filterCourseId);
    } catch (err) {
      console.error("Failed saving lesson:", err);
      alert("Failed to save.");
    }
  };

  const handleEdit = (l) => {
    setEditingId(l.id);
    setFormData({
      title: l.title,
      description: l.description,
      videoUrl: l.videoUrl,
      order: l.order,
      courseId: l.courseId,
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete lesson?")) return;

    try {
      await deleteLesson(id);
      setLessons(lessons.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      order: "",
      courseId: "",
    });
    setShowForm(true);
  };

  return (
    <div className="admin-layout">
      <div className="main-area">
        <main className="users-main-content">
          <h1 className="page-title">
            <FaBook /> Lesson Management
          </h1>

          {/* Toolbar */}
          <div className="users-toolbar">
            <div className="users-search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              value={filterCourseId}
              onChange={(e) => handleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <button className="add-user-btn" onClick={handleAddNew}>
              <FaPlus /> Add Lesson
            </button>
          </div>

          {/* Table */}
          <div className="courses-table">
            {lessons.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Course</th>
                    <th>Video</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {lessons
                    .filter((l) =>
                      l.title.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((l) => (
                      <tr key={l.id}>
                        <td>{l.order}</td>
                        <td>{l.title}</td>
                        <td className="desc-column">{l.description}</td>
                        <td>
                          {
                            courses.find((c) => c.id === l.courseId)
                              ?.title
                          }
                        </td>
                        <td>
                          {l.videoUrl ? (
                            <img
                              src={getThumbnail(l.videoUrl)}
                              className="lesson-thumb"
                              alt="thumb"
                            />
                          ) : (
                            "—"
                          )}
                        </td>

                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(l)}
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(l.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p>No lessons found.</p>
            )}
          </div>

          {/* Popup Form */}
          {showForm && (
            <div className="overlay">
              <div className="popup-form small-popup">
                <h2 className="popup-title">
                  {editingId ? "Edit Lesson" : "Add Lesson"}
                </h2>

                <form onSubmit={handleSubmit}>
                  <select
                    value={formData.courseId}
                    onChange={(e) =>
                      setFormData({ ...formData, courseId: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Order"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: e.target.value })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Lesson Title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />

                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="YouTube Video URL"
                    value={formData.videoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, videoUrl: e.target.value })
                    }
                  />

                  {formData.videoUrl && (
                    <img
                      src={getThumbnail(formData.videoUrl)}
                      alt="Preview"
                      className="preview-img"
                    />
                  )}

                  <div className="popup-buttons">
                    <button type="submit" className="popup-btn primary">
                      {editingId ? "Update Lesson" : "Add Lesson"}
                    </button>

                    <button
                      type="button"
                      className="popup-btn secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
