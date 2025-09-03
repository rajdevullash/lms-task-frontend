import axios from "axios";
import Cookies from "js-cookie";
import {
  ApiResponse,
  Course,
  Module,
  Lecture,
  Progress,
  PaginationParams,
  CourseWithProgress,
} from "@/types";

const API_BASE_URL = "https://lms-task-backend.onrender.com/api/v1";

// const API_BASE_URL = "http://localhost:8080/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse>("/auth/login", data),

  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse>("/auth/register", data),

  logout: () => api.post<ApiResponse>("/auth/logout"),

  refreshToken: () => api.post<ApiResponse>("/auth/refresh-token"),
};

// Course API
export const courseApi = {
  getAll: (params?: PaginationParams) =>
    api.get<ApiResponse<Course[]>>("/course/get-all", { params }),
  getAllUsers: (params?: PaginationParams) =>
    api.get<ApiResponse<Course[]>>("/course/get-all-course-user", { params }),

  getById: (id: string) => api.get<ApiResponse<Course>>(`/course/${id}`),
  getByIdUser: (id: string) =>
    api.get<ApiResponse<Course>>(`/course/user-single-course/${id}`),

  create: (data: FormData) =>
    api.post<ApiResponse<Course>>("/course/create-course", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id: string, data: FormData) =>
    api.patch<ApiResponse<Course>>(`/course/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id: string) => api.delete<ApiResponse>(`/course/${id}`),

  getWithProgress: (id: string) =>
    api.get<ApiResponse<CourseWithProgress>>(`/course/with-progress/${id}`),
};

// Module API
export const moduleApi = {
  getAll: (courseId: string, params?: PaginationParams) =>
    api.get<ApiResponse<Module[]>>(`/module/get-all/${courseId}`, { params }),

  create: (data: { title: string; courseId: string }) =>
    api.post<ApiResponse<Module>>("/module/create-module", data),

  update: (id: string, data: { title?: string; courseId?: string }) =>
    api.patch<ApiResponse<Module>>(`/module/${id}`, data),

  delete: (id: string) => api.delete<ApiResponse>(`/module/${id}`),
};

// Lecture API
export const lectureApi = {
  getAll: (
    params?: PaginationParams & { courseId?: string; moduleId?: string }
  ) => api.get<ApiResponse<Lecture[]>>("/lecture/get-all", { params }),

  getById: (id: string) => api.get<ApiResponse<Lecture>>(`/lecture/${id}`),

  create: (data: FormData) =>
    api.post<ApiResponse<Lecture>>("/lecture/create-lecture", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id: string, data: FormData) =>
    api.patch<ApiResponse<Lecture>>(`/lecture/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id: string) => api.delete<ApiResponse>(`/lecture/${id}`),

  getWithAccess: (params: { courseId?: string; moduleId?: string }) =>
    api.get<ApiResponse<Lecture[]>>("/lecture/with-access", { params }),
};

// Progress API
export const progressApi = {
  getCourseProgress: (courseId: string) =>
    api.get<ApiResponse<Progress>>(`/progress/get-course/${courseId}`),

  getUserProgress: () =>
    api.get<ApiResponse<Progress[]>>("/progress/get-user-progress"),

  markLectureComplete: (data: { courseId: string; lectureId: string }) =>
    api.post<ApiResponse>("/progress/lecture-completed", data),

  updateCurrentLecture: (data: { courseId: string; lectureId: string }) =>
    api.patch<ApiResponse>("/progress/current-lecture", data),

  checkLectureAccess: (courseId: string, lectureId: string) =>
    api.get<ApiResponse>(
      `/progress/check-lecture-access/${courseId}/${lectureId}`
    ),
};

export default api;
