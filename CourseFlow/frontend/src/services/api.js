import axios from "axios";

const API_BASE_URL = "https://localhost:55554/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// USERS CRUD
export const getUsers = async () => api.get("/User");
export const getUserById = async (id) => api.get(`/User/${id}`);
export const createUser = async (user) => api.post("/User", user);
export const updateUser = async (id, user) => api.put(`/User/${id}`, user);
export const deleteUser = async (id) => api.delete(`/User/${id}`);

// COURSES CRUD
export const getCourses = () => api.get("/course");

export const createCourse = (data) => api.post("/course", data);
export const updateCourse = (id, data) => api.put(`/course/${id}`, data);

export const deleteCourse = (id) => api.delete(`/course/${id}`);
