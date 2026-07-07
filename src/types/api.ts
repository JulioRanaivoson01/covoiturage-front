// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  cinNumber?: string;
  cinPhoto?: string;
  rating: number;
  isVerified: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cinNumber: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
  token: string;
}

// Ride Types
export interface Ride {
  luggage: any;
  status: string;
  id: string;
  departure: string;
  arrival: string;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  carModel: string;
  luggageAllowed: string;
  description?: string;
  
  // 🌟 MODIFICATION ICI : Aligner le nom avec le backend
  pricePerSeat: number; 
  driver?: any;
  carImageUri?: string;
}
// À modifier dans ton fichier de types frontend
export interface CreateRideRequest {
  departure: string;
  arrival: string;
  departureTime: string;      // Mis à jour
  pricePerSeat: number;       // Mis à jour
  totalSeats: number;
  carModel: string;           // Ajouté
  luggageAllowed?: any;       // Aligne-le selon ton Enum ou laisse en string/any temporairement
  description?: string;
}

export interface SearchRidesRequest {
  departure: string;
  arrival: string;
  date: string;
  passengers: number;
}

// Booking Types
export interface Booking {
  id: string;
  rideId: string;
  ride: Ride;
  userId: string;
  user: User;
  passengers: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface CreateBookingRequest {
  rideId: string;
  passengers: number;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participant: User;
  lastMessage?: Message;
  unreadCount: number;
}

// Review Types
export interface Review {
  id: string;
  reviewerId: string;
  reviewer: User;
  reviewedUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  reviewedUserId: string;
  rating: number;
  comment: string;
}

// API Response Wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
