import axios from "axios";
import { API_BASE_URL } from "./constant";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

async function getAllCoursesAdmin() {
  try {
    const { data } = await api.get("/api/courses/all");
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { success: false, error: "Could not fetch courses" };
  }
}

async function getAllCourses() {
  try {
    const { data } = await api.get("/api/courses");
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { success: false, error: "Could not fetch courses" };
  }
}

async function getCourseById(courseId) {
  try {
    const { data } = await api.get(`/api/courses/${courseId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching course:", error);
    return { success: false, error: "Could not fetch course details" };
  }
}

async function createCourse(courseData) {
  try {
    const { data } = await api.post("/api/courses", courseData);
    return { success: true, data };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, error: "Could not create course" };
  }
}

async function updateCourse(courseId, courseData) {
  try {
    const { data } = await api.put(`/api/courses/${courseId}`, courseData);
    return { success: true, data };
  } catch (error) {
    console.error("Error updating course:", error);
    return { success: false, error: "Could not update course" };
  }
}

async function deleteCourse(courseId) {
  try {
    const { data } = await api.delete(`/api/courses/${courseId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: "Could not delete course" };
  }
}

async function approveCourse(courseId) {
  try {
    const { data } = await api.patch(`/api/courses/${courseId}/approve`);
    return { success: true, data };
  } catch (error) {
    console.error("Error approving course:", error);
    return { success: false, error: "Could not approve course" };
  }
}

async function getAllUsers() {
  try {
    const { data } = await api.get("/api/users");
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Could not fetch users" };
  }
}

async function getAllLearning() {
  try {
    const { data } = await api.get("/api/learning");
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return { success: false, error: "Could not fetch enrollments" };
  }
}

async function updateUser(userId, updatedData) {
  try {
    const { data } = await api.put(`/api/users/${userId}`, updatedData);
    return { success: true, data };
  } catch (err) {
    console.error("Error updating user:", err);
    return { success: false, error: "Unable to update user" };
  }
}



export const adminService = {
  getAllCoursesAdmin,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  approveCourse,
  getAllUsers,
  updateUser,
  getAllLearning,
};
