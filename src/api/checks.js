import axios from './axios';

export const checksAPI = {
  // Get all checks
  getChecks: async (params = {}) => {
    const response = await axios.get('/checks', { params });
    return response.data;
  },

  // Get single check
  getCheck: async (id) => {
    const response = await axios.get(`/checks/${id}`);
    return response.data;
  },

  // Create check
  createCheck: async (checkData) => {
    const response = await axios.post('/checks', checkData);
    return response.data;
  },

  // Update check
  updateCheck: async (id, checkData) => {
    const response = await axios.put(`/checks/${id}`, checkData);
    return response.data;
  },

  // Delete check
  deleteCheck: async (id) => {
    const response = await axios.delete(`/checks/${id}`);
    return response.data;
  },

  // Get check statistics
  getCheckStats: async () => {
    const response = await axios.get('/checks/stats');
    return response.data;
  },

  // Get check results
  getCheckResults: async (id, params = {}) => {
    const response = await axios.get(`/checks/${id}/results`, { params });
    return response.data;
  },

  // Get check incidents
  getCheckIncidents: async (id, params = {}) => {
    const response = await axios.get(`/checks/${id}/incidents`, { params });
    return response.data;
  },
};