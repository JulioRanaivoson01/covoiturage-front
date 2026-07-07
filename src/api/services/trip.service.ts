import apiClient from '../axios';
import {
  CreateRideRequest,
  Ride,
  ApiResponse,
} from '../../types/api';

class TripService {
  async createTrip(tripData: CreateRideRequest): Promise<Ride> {
    const response = await apiClient.post<ApiResponse<Ride>>('/trips', tripData);
    const createdTrip = response.data?.data || response.data;
    return createdTrip;
  }

  async getUserTrips(): Promise<Ride[]> {
    const response = await apiClient.get<ApiResponse<Ride[]>>('/trips/driver/me');
    const trips = response.data?.data || response.data;
    return trips;
  }

  async getTripById(tripId: string): Promise<Ride> {
    const response = await apiClient.get<ApiResponse<Ride>>(`/trips/${tripId}`);
    const tripData = response.data?.data || response.data;
    return tripData;
  }

  async updateTrip(tripId: string, tripData: Partial<CreateRideRequest>): Promise<Ride> {
    const response = await apiClient.patch<ApiResponse<Ride>>(`/trips/${tripId}`, tripData);
    const updatedTrip = response.data?.data || response.data;
    return updatedTrip;
  }

  async deleteTrip(tripId: string): Promise<void> {
    await apiClient.delete(`/trips/${tripId}`);
  }
}

export default new TripService();
