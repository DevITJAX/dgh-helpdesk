import apiClient from './apiClient';

const API_BASE_URL = '/api/dashboard';

const dashboardService = {
  getStatistics: async () => {
    try {
      console.log('DashboardService: Fetching statistics...');
      const response = await apiClient.get(`${API_BASE_URL}/statistics`);
      console.log('DashboardService: Statistics response:', response.data);
      return response.data;
    } catch (error) {
      console.error('DashboardService: Error fetching statistics:', error);
      throw error;
    }
  },
};

export default dashboardService;
