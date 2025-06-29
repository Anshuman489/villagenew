// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Village API functions
export const villageAPI = {
  // Get all villages with filtering
  getVillages: async (searchTerm = '', filters = {}) => {
    try {
      const params = {};
      
      // Add search term
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      // Add filter parameters
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all' && filters[key] !== '') {
          params[key] = filters[key];
        }
      });
      
      console.log('🔍 API request params:', params);
      
      const response = await api.get('/villages', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch villages');
    }
  },

  // Create new village
  createVillage: async (villageData) => {
    try {
      const response = await api.post('/villages', villageData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create village');
    }
  },

  // Delete village
  deleteVillage: async (villageId) => {
    try {
      console.log('🗑️ Deleting village:', villageId);
      const response = await api.delete(`/villages/${villageId}`);
      console.log('✅ Village deleted successfully');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete village');
    }
  },

  // Get dashboard stats
  getStats: async () => {
    try {
      const response = await api.get('/villages/stats/overview');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch stats');
    }
  }
};

export default api;