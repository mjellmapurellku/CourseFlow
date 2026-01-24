import axios from "axios";

const API_BASE_URL = "https://localhost:55554/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// USERS CRUD
export const getUsers = async () => api.get("/User");
export const getUserById = async (id) => api.get(`/User/${id}`);
export const createUser = async (user) => api.post("/User", user);
export const updateUser = async (id, user) => api.put(`/User/${id}`, user);
export const deleteUser = async (id) => api.delete(`/User/${id}`);

// TRIAL endpoints (NEW)
export const startTrial = (userId) => api.post(`/user/start-trial/${userId}`);
export const getTrialStatus = (userId) => api.get(`/user/trial-status/${userId}`);

// COURSES CRUD
export const getCourses = () => api.get("/course");
export const createCourse = (data) => api.post("/course", data);
export const updateCourse = (id, data) => api.put(`/course/${id}`, data);
export const deleteCourse = (id) => api.delete(`/course/${id}`);
export const getCourseById = (id) => api.get(`/course/${id}`);

// ENROLLMENTS
export const createEnrollment = (data) =>
  // send the DTO your backend expects: { userId, courseId, progressPercent? }
  api.post("/enrollment", data);

// update whole enrollment by id (if needed)
export const updateEnrollment = (id, data) =>
  api.put(`/enrollment/${id}`, data);

// **Fixed**: backend expects query parameters for status endpoint
export const getEnrollmentStatus = (courseId) =>
  api.get(`/enrollment/status?courseId=${courseId}`);

// get enrollments by user
export const getEnrollmentsByUser = (userId) =>
  api.get(`/enrollment/user/${userId}`);

// lessons
export const getLessonsByCourse = (courseId) =>
  api.get(`/lesson/course/${courseId}`);

export const createLesson = (data) => api.post("/lesson", data);
export const updateLesson = (id, data) => api.put(`/lesson/${id}`, data);
export const deleteLesson = (id) => api.delete(`/lesson/${id}`);
export const getLessonById = (id) => api.get(`/lesson/${id}`);

// **Fixed**: backend UpdateProgress route is PUT /enrollment/progress expecting ProgressUpdateDto in body
// Use: updateProgress(userId, courseId, percent)
export const updateProgress = (userId, courseId, progressPercent) =>
  api.put("/enrollment/progress", {
    UserId: userId,
    CourseId: courseId,
    ProgressPercent: progressPercent,
  });
