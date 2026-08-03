import api from "./api";

async function getAllPayments() {
  try {
    const { data } = await api.get("/api/payments/all");
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching all payments:", error);
    return { success: false, error: "Could not fetch payments" };
  }
}

async function getInstructorPayments(instructorId) {
  try {
    const { data } = await api.get(`/api/payments/instructor/${instructorId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching instructor payments:", error);
    return { success: false, error: "Could not fetch payments" };
  }
}

export const paymentService = {
  getAllPayments,
  getInstructorPayments,
};
