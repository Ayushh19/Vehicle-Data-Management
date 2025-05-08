import axios from 'axios';
import type { Vehicle, VehicleFormData } from '../types/vehicle';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const vehicleService = {
getVehicles: async (limit = 250000): Promise<Vehicle[]> => {
  try {
    const response = await api.get('/vehicles');
    console.log("Raw response:", response.data);

    const vehicles = Array.isArray(response.data)
      ? response.data
      : response.data?.data ?? [];

    return vehicles.slice(0, limit);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
},



  createVehicle: async (vehicleData: VehicleFormData): Promise<Vehicle> => {
    try {
      const response = await api.post<Vehicle>('/vehicles', vehicleData);
      return response.data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  deleteVehicle: async (id: number): Promise<void> => {
    try {
      await api.delete(`/vehicles/${id}`);
    } catch (error) {
      console.error(`Error deleting vehicle ${id}:`, error);
      throw error;
    }
  },
};