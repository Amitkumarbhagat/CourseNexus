import axios from 'axios';
import { API_BASE_URL } from './constant';

const API_URL = `${API_BASE_URL}/payments`;

const createOrder = async (orderData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/createOrder`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, message: error.response?.data || "Failed to create order" };
    }
};

const verifyPayment = async (verificationData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/verify`, verificationData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error verifying payment:", error);
        return { success: false, message: error.response?.data || "Failed to verify payment" };
    }
};

export const paymentService = {
    createOrder,
    verifyPayment
};
