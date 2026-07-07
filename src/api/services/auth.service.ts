import apiClient from '../axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
} from '../../types/api';

class AuthService {
 // Dans auth.service.ts (Frontend)
async login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
  const authData = response.data?.data || response.data; 
  
  // 🌟 CORRECTION ICI : on lit 'access_token' au lieu de 'token'
  const token = authData.access_token || authData.token; 

  if (!token) {
    throw new Error("Invalid response from server: missing token");
  }
  
  await AsyncStorage.setItem('authToken', token);
  await AsyncStorage.setItem('user', JSON.stringify(authData.user));
  
  return authData;
}

 async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('Register payload:', JSON.stringify(userData));

    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);

    console.log('Register response status:', response.status);
    console.log('Register response data:', JSON.stringify(response.data));

    // Handle both response structures: { data: { user, token } } or { user, token }
    const authData = (response.data as any).data || response.data;

    console.log('Extracted authData:', JSON.stringify(authData));

    // Handle both access_token and token field names
    const token = authData.access_token || authData.token;

    if (!authData || !token) {
      throw new Error('Invalid response from server: missing token');
    }

    // NE PAS stocker le token et l'utilisateur après inscription
    // L'utilisateur doit se connecter manuellement

    return authData;
  }
  async uploadCIN(userId: string, photoUri: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'cin_photo.jpg',
    } as any);

    await apiClient.post(`/auth/cin/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  }

  async getCurrentUser(): Promise<any> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export default new AuthService();