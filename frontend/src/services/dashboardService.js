import apiClient from './apiClient';

const API_BASE_URL = '/dashboard';

const dashboardService = {
  getStatistics: async () => {
    const response = await apiClient.get(`${API_BASE_URL}/statistics`);
    return response.data;
  },
};

export default dashboardService;
