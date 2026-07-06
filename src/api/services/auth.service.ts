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

// Dans ton fichier auth.service.ts côté FRONTEND, à l'intérieur de la classe :
async register(userData: any): Promise<any> {
  try {
    let payload: any = {};

    // 🌟 Technique ultime pour React Native : extraire les données depuis _parts
    if (userData && userData._parts) {
      userData._parts.forEach(([key, value]: [string, any]) => {
        // Si c'est le numéro de téléphone, on s'assure d'alimenter 'phoneNumber'
        if (key === 'phone' || key === 'phoneNumber') {
          payload['phoneNumber'] = value;
        } else {
          payload[key] = value;
        }
      });
    } else if (typeof userData === 'object') {
      payload = userData;
    }

    // Ce log va ENFIN te montrer l'objet JSON propre (ex: { email: "...", password: "..." })
    console.log("=== VRAI PAYLOAD JSON EXTRAIT ===", payload);

    const response = await apiClient.post('/auth/register', payload);
    
    const authData = response.data?.data || response.data; 
    return authData; 
  } catch (error) {
    throw error;
  }
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