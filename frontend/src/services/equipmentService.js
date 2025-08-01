import apiClient from './apiClient';

export const equipmentService = {
  getAllEquipment: async (params = {}) => {
    try {
      console.log('EquipmentService: Fetching all equipment with params:', params);
      const response = await apiClient.get('/api/equipment', { params });
      console.log('EquipmentService: All equipment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error fetching all equipment:', error);
      throw error;
    }
  },

  getEquipmentById: async (id) => {
    try {
      const response = await apiClient.get(`/api/equipment/${id}`);
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error fetching equipment by ID:', error);
      throw error;
    }
  },

  getEquipmentByType: async (equipmentType) => {
    try {
      const response = await apiClient.get(`/api/equipment/type/${equipmentType}`);
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error fetching equipment by type:', error);
      throw error;
    }
  },

  getEquipmentByStatus: async (status) => {
    try {
      const response = await apiClient.get(`/api/equipment/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error fetching equipment by status:', error);
      throw error;
    }
  },

  getEquipmentByLocation: async (location) => {
    try {
      const response = await apiClient.get(`/api/equipment/location/${encodeURIComponent(location)}`);
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error fetching equipment by location:', error);
      throw error;
    }
  },

  getManagedEquipment: async () => {
    try {
      const response = await apiClient.get('/api/equipment/managed');
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error fetching managed equipment:', error);
      throw error;
    }
  },

  getUnmanagedEquipment: async () => {
    try {
      const response = await apiClient.get('/api/equipment/unmanaged');
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error fetching unmanaged equipment:', error);
      throw error;
    }
  },

  getEquipmentNotSeen: async (hours = 24) => {
    try {
      const response = await apiClient.get('/api/equipment/not-seen', {
        params: { hours }
      });
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error fetching equipment not seen:', error);
      throw error;
    }
  },

  getEquipmentWithExpiringWarranty: async (daysFromNow = 30) => {
    try {
      const response = await apiClient.get('/api/equipment/warranty-expiring', {
        params: { daysFromNow }
      });
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error fetching equipment with expiring warranty:', error);
      throw error;
    }
  },

  getDistinctLocations: async () => {
    try {
      const response = await apiClient.get('/api/equipment/locations');
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error fetching distinct locations:', error);
      throw error;
    }
  },

  getDistinctManufacturers: async () => {
    try {
      const response = await apiClient.get('/api/equipment/manufacturers');
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error fetching distinct manufacturers:', error);
      throw error;
    }
  },

  createEquipment: async (equipmentData) => {
    try {
      console.log('EquipmentService: Creating equipment:', equipmentData);
      const response = await apiClient.post('/api/equipment', equipmentData);
      console.log('EquipmentService: Equipment created:', response.data);
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error creating equipment:', error);
      throw error;
    }
  },

  updateEquipment: async (id, equipmentData) => {
    try {
      console.log('EquipmentService: Updating equipment:', id, equipmentData);
      const response = await apiClient.put(`/api/equipment/${id}`, equipmentData);
      console.log('EquipmentService: Equipment updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error updating equipment:', error);
      throw error;
    }
  },

  updateEquipmentStatus: async (id, status) => {
    try {
      const response = await apiClient.put(`/api/equipment/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error updating equipment status:', error);
      throw error;
    }
  },

  updateLastSeen: async (id) => {
    try {
      const response = await apiClient.put(`/api/equipment/${id}/last-seen`);
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error updating last seen:', error);
      throw error;
    }
  },

  markAsManaged: async (id) => {
    try {
      const response = await apiClient.put(`/api/equipment/${id}/manage`);
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error marking as managed:', error);
      throw error;
    }
  },

  markAsUnmanaged: async (id) => {
    try {
      const response = await apiClient.put(`/api/equipment/${id}/unmanage`);
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error marking as unmanaged:', error);
      throw error;
    }
  },

  deleteEquipment: async (id) => {
    try {
      console.log('EquipmentService: Deleting equipment:', id);
      const response = await apiClient.delete(`/api/equipment/${id}`);
      console.log('EquipmentService: Equipment deleted');
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error deleting equipment:', error);
      throw error;
    }
  },

  getEquipmentStatistics: async () => {
    try {
      const response = await apiClient.get('/api/equipment/statistics');
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error fetching equipment statistics:', error);
      throw error;
    }
  },

  createFromDiscovery: async (discoveryData) => {
    try {
      console.log('EquipmentService: Creating equipment from discovery:', discoveryData);
      const response = await apiClient.post('/api/equipment/discovery', discoveryData);
      console.log('EquipmentService: Equipment created from discovery:', response.data);
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error creating equipment from discovery:', error);
      throw error;
    }
  },

  searchEquipment: async (searchTerm) => {
    try {
      const response = await apiClient.get('/api/equipment', {
        params: { search: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('EquipmentService: Error searching equipment:', error);
      throw error;
    }
  }
};