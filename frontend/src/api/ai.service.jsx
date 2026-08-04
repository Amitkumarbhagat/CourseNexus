import axios from 'axios';
import { API_BASE_URL } from './constant';

const generateDescription = async (courseName) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_BASE_URL}/api/ai/generate-description`, 
            { courseName }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error generating description:", error);
        return { success: false, message: error.response?.data?.error || "Failed to generate AI description" };
    }
};

export const aiService = {
    generateDescription
};
