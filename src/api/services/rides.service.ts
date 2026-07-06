import apiClient from '../axios';
import {
  Ride,
  CreateRideRequest,
  SearchRidesRequest,
  ApiResponse,
} from '../../types/api';

class RidesService {
  async searchRides(params: SearchRidesRequest): Promise<Ride[]> {
    const response = await apiClient.get<ApiResponse<Ride[]>>('/rides/search', { params });
    return response.data.data;
  }

  async getRideById(rideId: string): Promise<Ride> {
    const response = await apiClient.get<ApiResponse<Ride>>(`/rides/${rideId}`);
    return response.data.data;
  }

  async createRide(rideData: CreateRideRequest): Promise<Ride> {
    const response = await apiClient.post<ApiResponse<Ride>>('/rides', rideData);
    return response.data.data;
  }

  async getMyRides(): Promise<Ride[]> {
    const response = await apiClient.get<ApiResponse<Ride[]>>('/rides/my');
    return response.data.data;
  }

  async cancelRide(rideId: string): Promise<void> {
    await apiClient.patch(`/rides/${rideId}/cancel`);
  }

  async getAvailableRides(): Promise<Ride[]> {
    const response = await apiClient.get<ApiResponse<Ride[]>>('/rides/available');
    return response.data.data;
  }
}

export default new RidesService();
