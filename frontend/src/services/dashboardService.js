import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL + '/api/dashboard' || 'http://localhost:5000/api/dashboard';

export const getUsersCounts = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getUsersCounts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }   
        }); 
        return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
}

export const getFeedsCounts = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getFeedsCounts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching feeds:', error);
        throw error;
    }
}

export const getIngredientCounts = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getIngredientCounts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
    }
}

export const getFeedsPerSpecies = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getFeedsPerSpecies`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            }
        });
      return response.data;
    } catch (error) {
      console.error('Error fetching feeds:', error);
      throw error;
    }
};

export const getIngredientUsage = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getIngredientUsage`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            }
        });
      return response.data;
    }
    catch (error) {
      console.error('Error fetching ingredient usage:', error);
      throw error;
    }
}
