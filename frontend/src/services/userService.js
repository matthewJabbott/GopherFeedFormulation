import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL + '/api/user' || 'http://localhost:5000/api/user';

export const getUserRole = async (token, id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getUserRole?clerkId=${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      return response.data.role;
    } catch (error) {
      console.error('Error fetching feeds:', error);
      throw error;
    }
  };

export const getUsers = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAll`, {
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
}

export const addUser = async (token, user) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add`, user, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  }
  catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

export const updateUser = async (token, updatedUser) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/update`, updatedUser, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  }
  catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export const deleteUser = async (token, ids) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete/${ids}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  }
  catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  } 
}

