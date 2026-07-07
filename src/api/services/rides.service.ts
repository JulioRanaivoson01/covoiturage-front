import apiClient from '../axios';
import {
  Ride,
  CreateRideRequest,
  SearchRidesRequest,
  ApiResponse,
} from '../../types/api';

class RidesService {
  async searchRides(params: SearchRidesRequest): Promise<Ride[]> {
    const response = await apiClient.get<ApiResponse<Ride[]>>('/rides', { params });
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

  // 🌟 CORRECTION : On utilise '/rides/driver/me' au lieu de '/trips/driver/me'
  async getMyRides(): Promise<Ride[]> {
    const response = await apiClient.get<ApiResponse<Ride[]>>('/rides/driver/me');
    return response.data.data || (response.data as any);
  }

  async cancelRide(rideId: string): Promise<void> {
    await apiClient.patch(`/rides/${rideId}/cancel`);
  }

  async getAvailableRides(): Promise<Ride[]> {
    const response = await apiClient.get<ApiResponse<Ride[]>>('/rides');
    return response.data.data;
  }

  async uploadCarImage(uri: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: 'image/jpeg',
      name: 'car-image.jpg',
    } as any);

    const response = await apiClient.post<ApiResponse<{ imageUrl: string }>>('/uploads/car-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.imageUrl;
  }
}

export default new RidesService();