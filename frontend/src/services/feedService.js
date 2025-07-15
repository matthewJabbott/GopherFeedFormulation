import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL + '/api/feed' || 'http://localhost:5000/api/feed';

export const addFeedService = async (feed, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add`,feed , {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error adding feed:', error);
    throw error;
  }
};

export const fetchAllFeeds = async (token, first, rows, sortField, sortOrder, globalSearch) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        first,
        rows,
        sortField,
        sortOrder,
        globalSearch
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching feeds:', error);
    throw error;
  }
};

export const updateFeedService = async (feedId, updatedFeed, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${feedId}`, updatedFeed, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating feed:', error);
    throw error;
  }
};

export const deleteFeedService = async (id, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting feed with id ${id}:`, error);
    throw error;
  }
};

export const fetchFeedById = async (token, first, rows, sortField, sortOrder, globalSearch) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getByUserId`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        first,
        rows,
        sortField,
        sortOrder,
        globalSearch
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching feed: `, error);
    throw error;
  }
};
