import apiClient from '../axios';
import {
  Message,
  Conversation,
  ApiResponse,
} from '../../types/api';

class MessagesService {
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<ApiResponse<Conversation[]>>('/messages/conversations');
    return response.data.data;
  }

  async getMessages(userId: string): Promise<Message[]> {
    const response = await apiClient.get<ApiResponse<Message[]>>(`/messages/${userId}`);
    return response.data.data;
  }

  async sendMessage(receiverId: string, content: string): Promise<Message> {
    const response = await apiClient.post<ApiResponse<Message>>('/messages', {
      receiverId,
      content,
    });
    return response.data.data;
  }

  async markAsRead(messageId: string): Promise<void> {
    await apiClient.patch(`/messages/${messageId}/read`);
  }

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/messages/unread');
    return response.data.data.count;
  }
}

export default new MessagesService();
