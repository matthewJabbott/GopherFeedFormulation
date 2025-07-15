import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to add auth token to requests
const withAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getAllSpecies = async (token, params = {}) => {
  try {
    const response = await apiClient.get("/species", {
      ...withAuth(token),
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching species:", error);
    throw error;
  }
};

export const getSpeciesById = async (token, id) => {
  try {
    const response = await apiClient.get(`/species/${id}`, withAuth(token));
    return response.data;
  } catch (error) {
    console.error(`Error fetching species ${id}:`, error);
    throw error;
  }
};

export const createSpecies = async (token, speciesData) => {
  try {
    const response = await apiClient.post(
      "/species",
      speciesData,
      withAuth(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error creating species:", error);
    throw error;
  }
};

export const updateSpecies = async (token, id, speciesData) => {
  try {
    const response = await apiClient.put(
      `/species/${id}`,
      speciesData,
      withAuth(token)
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating species ${id}:`, error);
    throw error;
  }
};

export const deleteSpecies = async (token, id) => {
  try {
    const response = await apiClient.delete(`/species/${id}`, withAuth(token));
    return response.data;
  } catch (error) {
    console.error(`Error deleting species ${id}:`, error);
    throw error;
  }
};

export const searchSpecies = async (token, searchTerm) => {
  try {
    const response = await apiClient.get("/species", {
      ...withAuth(token),
      params: { search: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error(`Error searching species with term "${searchTerm}":`, error);
    throw error;
  }
};
