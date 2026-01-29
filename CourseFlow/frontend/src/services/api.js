import axios from "axios";

const API_BASE_URL = "https://localhost:55554/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // 🔑 PRIMARY SOURCE (what backend actually uses)
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    // 🔁 FALLBACK (if token is stored inside user object)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const fallbackToken =
          user?.token ||
          user?.accessToken ||
          user?.data?.token;

        if (fallbackToken) {
          config.headers.Authorization = `Bearer ${fallbackToken}`;
        }
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= USERS =================
export const getUsers = () => api.get("/User");
export const getUserById = (id) => api.get(`/User/${id}`);
export const createUser = (user) => api.post("/User", user);
export const updateUser = (id, user) => api.put(`/User/${id}`, user);
export const deleteUser = (id) => api.delete(`/User/${id}`);

// ================= COURSES =================
export const getCourses = () => api.get("/course");
export const getCourseById = (id) => api.get(`/course/${id}`);
export const createCourse = (data) => api.post("/course", data);
export const updateCourse = (id, data) => api.put(`/course/${id}`, data);
export const deleteCourse = (id) => api.delete(`/course/${id}`);

// ================= LESSONS =================
export const getLessonsByCourse = (courseId) =>
  api.get(`/lesson/course/${courseId}`);

export const getLessonById = (id) => api.get(`/lesson/${id}`);
export const createLesson = (data) => api.post("/lesson", data);
export const updateLesson = (id, data) => api.put(`/lesson/${id}`, data);
export const deleteLesson = (id) => api.delete(`/lesson/${id}`);

// ================= ENROLLMENTS =================
export const getEnrollmentStatus = (courseId) =>
  api.get(`/enrollment/status?courseId=${courseId}`);

export const getEnrollmentsByUser = (userId) =>
  api.get(`/enrollment/user/${userId}`);

export const confirmPayment = (sessionId) =>
  api.post("/enrollment/confirm-payment", { sessionId });

export const updateProgress = (userId, courseId, progressPercent) =>
  api.put("/enrollment/progress", {
    UserId: userId,
    CourseId: courseId,
    ProgressPercent: progressPercent,
  });

// ================= TRIAL =================
export const startTrial = (userId) =>
  api.post(`/user/start-trial/${userId}`);

export const getTrialStatus = (userId) =>
  api.get(`/user/trial-status/${userId}`);

export const completeLesson = (courseId) =>
  api.post(`/Enrollment/complete-lesson?courseId=${courseId}`);