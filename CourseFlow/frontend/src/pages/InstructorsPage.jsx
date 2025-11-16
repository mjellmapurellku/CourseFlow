import { useEffect, useState } from "react";
import { FaEdit, FaEnvelope, FaPlus, FaSearch, FaTrash, FaUsers } from "react-icons/fa";
import { createUser, deleteUser, getUsers, updateUser } from "../services/api";
import "../styles/UsersPage.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
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
      if (editing) {
        await updateUser(editing, form);
        alert("User updated successfully!");
        setEditing(null);
      } else {
        await createUser(form);
        alert("User added successfully!");
      }
      setForm({ name: "", email: "", role: "" });
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      alert("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleEdit = (user) => {
    setEditing(user.id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role || "",
    });
  };

  return (
    <div className="users-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">
          Admin<span>Dashboard</span>
        </h2>
        <div className="sidebar-section">
          <p className="sidebar-title">MAIN</p>
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/courses">Courses</a>
          <a href="/instructors">Instructors</a>
          <a href="/users" className="active">Users</a>
        </div>
      </aside>

      {/* Main content */}
      <main className="users-main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="search-bar">
            <FaSearch />
            <input type="text" placeholder="Search users..." />
          </div>
          <div className="topbar-actions">
            <div className="user-info">
              <div className="user-avatar">AD</div>
              <div>
                <p className="user-name">Admin</p>
                <p className="user-role">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        <h1 className="page-title">
          <FaUsers /> User Management
        </h1>

        {/* User Stats */}
        <div className="user-stats">
          <div className="user-stat-card">
            <div className="user-stat-number">{users.length}</div>
            <div className="user-stat-label">Total Users</div>
          </div>
          <div className="user-stat-card">
            <div className="user-stat-number">{users.filter(u => u.role === 'student').length}</div>
            <div className="user-stat-label">Students</div>
          </div>
          <div className="user-stat-card">
            <div className="user-stat-number">{users.filter(u => u.role === 'instructor').length}</div>
            <div className="user-stat-label">Instructors</div>
          </div>
          <div className="user-stat-card">
            <div className="user-stat-number">{users.filter(u => u.role === 'admin').length}</div>
            <div className="user-stat-label">Admins</div>
          </div>
        </div>

        {/* Users Toolbar */}
        <div className="users-toolbar">
          <div className="users-search-bar">
            <FaSearch />
            <input type="text" placeholder="Search users by name or email..." />
          </div>
          <button
            className="add-user-btn"
            onClick={() => {
              setForm({ name: "", email: "", role: "" });
              setEditing(null);
            }}
          >
            <FaPlus /> Add New User
          </button>
        </div>

        {/* User Filters */}
        <div className="user-filters">
          <div className="filter-group">
            <label>Role:</label>
            <select>
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status:</label>
            <select>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* User Form */}
        <form onSubmit={handleSubmit} className="crud-form">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
            <option value="moderator">Moderator</option>
          </select>
          <button type="submit">{editing ? "Update User" : "Add User"}</button>
        </form>

        {/* Users Grid */}
        <div className="users-grid">
          {users.map((user) => (
            <div className="user-card" key={user.id}>
              <div className="user-card-header">
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-info">
                  <h3 className="user-name">{user.name}</h3>
                  <p className="user-email">
                    <FaEnvelope /> {user.email}
                  </p>
                </div>
              </div>
              <div className="user-card-body">
                <div className="user-details">
                  <div className="user-detail">
                    <span className="user-detail-label">Role:</span>
                    <span className={`user-role ${user.role || 'student'}`}>
                      {user.role || 'Student'}
                    </span>
                  </div>
                  <div className="user-detail">
                    <span className="user-detail-label">Status:</span>
                    <span className="user-status active">Active</span>
                  </div>
                  <div className="user-detail">
                    <span className="user-detail-label">ID:</span>
                    <span className="user-detail-value">#{user.id}</span>
                  </div>
                </div>
                <div className="user-card-actions">
                  <button className="edit-btn" onClick={() => handleEdit(user)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`user-role ${u.role || 'student'}`}>
                    {u.role || 'Student'}
                  </span>
                </td>
                <td><span className="user-status active">Active</span></td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(u)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(u.id)}>
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default UsersPage;
