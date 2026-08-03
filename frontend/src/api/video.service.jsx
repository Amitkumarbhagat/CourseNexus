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

export const videoService = {
  getVideosByCourse: async (courseId) => {
    try {
      const response = await api.get(`/api/videos/course/${courseId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error fetching videos:", error);
      return { success: false, error: "Could not fetch videos" };
    }
  },
  addVideo: async (courseId, videoData) => {
    try {
      const response = await api.post(`/api/videos/course/${courseId}`, videoData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error adding video:", error);
      return { success: false, error: "Could not add video" };
    }
  },
  deleteVideo: async (videoId) => {
    try {
      await api.delete(`/api/videos/${videoId}`);
      return { success: true };
    } catch (error) {
      console.error("Error deleting video:", error);
      return { success: false, error: "Could not delete video" };
    }
  },
  uploadVideoFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/api/videos/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return { success: true, url: response.data.url };
    } catch (error) {
      console.error("Error uploading video:", error);
      return { success: false, error: "Could not upload video file" };
    }
  }
};
