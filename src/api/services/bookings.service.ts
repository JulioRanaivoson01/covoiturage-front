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

  // 🌟 CORRECTION : On appelle '/bookings' à la place de '/bookings/my'
  async getMyBookings(): Promise<Booking[]> {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/bookings');
    // Gestion de sécurité si l'API renvoie directement le tableau ou encapsulé dans .data
    return response.data.data || (response.data as any);
  }

  async getBookingById(bookingId: string): Promise<Booking> {
    const response = await apiClient.get<ApiResponse<Booking>>(`/bookings/${bookingId}`);
    return response.data.data;
  }

  // 🌟 ADAPTATION : Utilise la route de ton contrôleur @Patch(':id/status')
  async cancelBooking(bookingId: string): Promise<void> {
    await apiClient.patch(`/bookings/${bookingId}/status`, { status: 'cancelled' });
  }

  // 🌟 ADAPTATION : Utilise la route de ton contrôleur @Patch(':id/status')
  async confirmBooking(bookingId: string): Promise<void> {
    await apiClient.patch(`/bookings/${bookingId}/status`, { status: 'confirmed' });
  }

  async getRideBookings(rideId: string): Promise<Booking[]> {
    const response = await apiClient.get<ApiResponse<Booking[]>>(`/bookings/ride/${rideId}`);
    return response.data.data;
  }
}

export default new BookingsService();