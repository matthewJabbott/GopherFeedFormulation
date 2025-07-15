// ingredientService.js

import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL + '/api/ingredient' ||
  'http://localhost:5000/api/ingredient';

export const fetchAllIngredients = async (
  token,
  page = 1,
  itemsPerPage= 20,
  params
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        itemsPerPage,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
};

export const deleteIngredient = async (token, id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting Ingredient with id :', id, 'Error: ', error);
    throw error;
  }
};

export const addIngredientService = async (ingredient, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add`, ingredient, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error adding ingredient:', error);
    // Throw structured error for the frontend to use
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};


export const getIngredientByUserId = async (token, page, itemsPerPage, search, sortBy, sortOrder) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getByUserId`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        itemsPerPage,
        search,
        sortBy,
        sortOrder
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching ingredients by user ID:', error);
    throw error;
  }
}

