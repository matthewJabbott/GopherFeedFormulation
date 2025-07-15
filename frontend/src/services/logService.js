import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL + '/api/log' || 'http://localhost:5000/api/log';

export const getLogs = async (token, lazyParams) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getAll?`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        params: {
            lazyParams: lazyParams
        }
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
}
