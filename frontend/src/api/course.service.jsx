import api from "./api";

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

async function getFeedbacks(courseId) {
  try {
    const { data } = await api.get(`/api/feedbacks/${courseId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return { success: false, error: "Unable to fetch feedbacks" };
  }
}

async function getInstructorCourses(instructorId) {
  try {
    const { data } = await api.get(`/api/courses/instructor/${instructorId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    return { success: false, error: "Could not fetch instructor courses" };
  }
}

async function postFeedback(courseId, comment, rating, userName, userId) {
  try {
    await api.post("/api/feedbacks", { comment, course_id: courseId, rating, userName, userId });
    return { success: true };
  } catch (error) {
    console.error("Error posting feedback:", error);
    return { success: false, error: "Unable to post feedback" };
  }
}

async function addMessage(payload) {
  try {
    const { data } = await api.post(`/api/discussions/addMessage`, payload);
    return { success: true, data };
  } catch (error) {
    console.error("Error posting message:", error);
    return { success: false, error: "Unable to post message" };
  }
}

async function updateLearningProgress(userId, courseId, percent) {
  try {
    const { data } = await api.put(`/api/learning/update-progress/${userId}/${courseId}?percent=${percent}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error updating progress:", error);
    return { success: false, error: "Unable to update progress" };
  }
}

async function getLearningProgress(userId, courseId) {
  try {
    const { data } = await api.get(`/api/learning/progress/${userId}/${courseId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching progress:", error);
    return { success: false, error: "Unable to fetch progress" };
  }
}

async function getMessages(courseId) {
  try {
    const { data } = await api.get(`/api/discussions/${courseId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { success: false, error: "Unable to fetch messages" };
  }
}


export const courseService = {
  getAllCourses,
  getCourseById,
  getInstructorCourses,
  getFeedbacks,
  postFeedback,
  getMessages,
  addMessage,
  updateLearningProgress,
  getLearningProgress,
};
