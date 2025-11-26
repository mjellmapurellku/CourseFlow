import { useEffect, useState } from "react";
import {
  FaBook,
  FaEdit,
  FaPlus,
  FaSearch,
  FaTrash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse
} from "../services/api";

import "../styles/CoursePage.css";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructorId: "",
    category: "",
    duration: "",
    price: "",
    level: "",
    image: "",
    videoUrl: ""
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const getYoutubeThumbnail = (url) => {
    if (!url) return "";
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (!match) return "";
    const videoId = match[1];
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        image: formData.videoUrl
          ? getYoutubeThumbnail(formData.videoUrl)
          : formData.image,
      };

      if (editingId) {
        await updateCourse(editingId, payload);
        setEditingId(null);
      } else {
        await createCourse(payload);
      }

      setFormData({
        title: "",
        description: "",
        instructorId: "",
        category: "",
        duration: "",
        price: "",
        level: "",
        image: "",
        videoUrl: "",
      });

      setShowForm(false);
      loadCourses();
    } catch (err) {
      console.error("Error saving course:", err);
      alert("Failed to save course.");
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData({
      title: course.title,
      description: course.description,
      instructorId: course.instructorId,
      category: course.category,
      duration: course.duration,
      price: course.price,
      level: course.level,
      image: course.image || "",
      videoUrl: course.videoUrl || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await deleteCourse(id);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Failed to delete course.");
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      instructorId: "",
      category: "",
      duration: "",
      price: "",
      level: "",
      image: "",
      videoUrl: "",
    });
    setShowForm(true);
  };

  return (
    <div className="admin-layout">
      <div className="main-area">
        <main className="users-main-content">
          <h1 className="page-title">
            <FaBook /> Course Management
          </h1>

          {/* Toolbar */}
          <div className="users-toolbar">
            <div className="users-search-bar">
              <FaSearch />
              <input type="text" placeholder="Search courses..." />
            </div>
            <button className="add-user-btn" onClick={handleAddNew}>
              <FaPlus /> Add New Course
            </button>
          </div>

          {/* Courses table */}
          <div className="courses-table">
            {courses.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Instructor</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.title}</td>
                      <td>{course.category}</td>
                      <td>{course.instructorId}</td>
                      <td>{course.duration}</td>
                      <td>${course.price}</td>
                      <td>{course.level}</td>

                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(course)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(course.id)}
                        >
                          <FaTrash />
                        </button>

                        {/* Navigate to lessons */}
                        <button
                          className="manage-lessons-btn"
                          onClick={() =>
                            navigate(`/admin/lessons?courseId=${course.id}`)
                          }
                        >
                          Lessons
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No courses found.</p>
            )}
          </div>

          {/* Popup form */}
          {showForm && (
            <div className="overlay">
              <div className="popup-form small-popup">
                <h2 className="popup-title">
                  {editingId ? "Edit Course" : "Add New Course"}
                </h2>

                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Course Title"
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
                    type="number"
                    placeholder="Instructor ID"
                    value={formData.instructorId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        instructorId: e.target.value,
                      })
                    }
                    required
                  />

                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Programming">Programming</option>
                    <option value="AI">AI</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Duration (e.g. 10h 30m)"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder="Price ($)"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />

                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    required
                  >
                    <option value="">Select level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>

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
                      src={getYoutubeThumbnail(formData.videoUrl)}
                      alt="Preview"
                      className="preview-img"
                    />
                  )}

                  <div className="popup-buttons">
                    <button type="submit" className="popup-btn primary">
                      {editingId ? "Update Course" : "Add Course"}
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
