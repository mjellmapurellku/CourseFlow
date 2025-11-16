import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash, FaUsers } from "react-icons/fa";
import { createUser, deleteUser, getUsers, updateUser } from "../services/api";
import "../styles/UsersPage.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    role: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateUser(editingId, formData);
        setEditingId(null);
      } else {
        await createUser(formData);
      }
      setFormData({
        fullName: "",
        email: "",
        username: "",
        password: "",
        role: "",
      });
      setShowForm(false);
      loadUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Failed to save user. Check console for details.");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      role: user.role || "",
      password: "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Check console for details.");
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      fullName: "",
      email: "",
      username: "",
      password: "",
      role: "",
    });
    setShowForm(true);
  };

  return (
    <div className="admin-layout">
      <div className="main-area">
        <main className="users-main-content">
          <h1 className="page-title">
            <FaUsers /> User Management
          </h1>

          <div className="users-toolbar">
            <div className="users-search-bar">
              <FaSearch />
              <input type="text" placeholder="Search users..." />
            </div>
            <button className="add-user-btn" onClick={handleAddNew}>
              <FaPlus /> Add New User
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="crud-form">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
              {!editingId && (
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              )}
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Instructor">Instructor</option>
                <option value="Student">Student</option>
              </select>
              <button type="submit">
                {editingId ? "Update User" : "Add User"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          )}

          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.username}</td>
                  <td>{u.role}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(u)}>
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(u.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default UsersPage;
