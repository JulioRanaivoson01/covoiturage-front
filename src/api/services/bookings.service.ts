import apiClient from '../axios';
import {
  Booking,
  CreateBookingRequest,
  ApiResponse,
} from '../../types/api';

class BookingsService {
  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    const response = await apiClient.post<ApiResponse<Booking>>('/bookings', bookingData);
    return response.data.data;
  }

  async getMyBookings(): Promise<Booking[]> {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/bookings/my');
    return response.data.data;
  }

  async getBookingById(bookingId: string): Promise<Booking> {
    const response = await apiClient.get<ApiResponse<Booking>>(`/bookings/${bookingId}`);
    return response.data.data;
  }

  async cancelBooking(bookingId: string): Promise<void> {
    await apiClient.patch(`/bookings/${bookingId}/cancel`);
  }

  async confirmBooking(bookingId: string): Promise<void> {
    await apiClient.patch(`/bookings/${bookingId}/confirm`);
  }

  async getRideBookings(rideId: string): Promise<Booking[]> {
    const response = await apiClient.get<ApiResponse<Booking[]>>(`/bookings/ride/${rideId}`);
    return response.data.data;
  }
}

export default new BookingsService();
