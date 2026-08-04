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

async function createOrder(orderData) {
  try {
    const { data } = await api.post("/api/payments/createOrder", orderData);
    return { success: true, data };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Could not create order" };
  }
}

async function verifyPayment(verificationData) {
  try {
    const { data } = await api.post("/api/payments/verify", verificationData);
    return { success: true, data };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { success: false, error: "Could not verify payment" };
  }
}

export const paymentService = {
  getAllPayments,
  getInstructorPayments,
  createOrder,
  verifyPayment,
};
