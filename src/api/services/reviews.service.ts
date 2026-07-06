import apiClient from '../axios';
import {
  Review,
  CreateReviewRequest,
  ApiResponse,
} from '../../types/api';

class ReviewsService {
  async getUserReviews(userId: string): Promise<Review[]> {
    const response = await apiClient.get<ApiResponse<Review[]>>(`/reviews/user/${userId}`);
    return response.data.data;
  }

  async createReview(reviewData: CreateReviewRequest): Promise<Review> {
    const response = await apiClient.post<ApiResponse<Review>>('/reviews', reviewData);
    return response.data.data;
  }

  async getMyReviews(): Promise<Review[]> {
    const response = await apiClient.get<ApiResponse<Review[]>>('/reviews/my');
    return response.data.data;
  }

  async getAverageRating(userId: string): Promise<number> {
    const response = await apiClient.get<ApiResponse<{ rating: number }>>(`/reviews/rating/${userId}`);
    return response.data.data.rating;
  }
}

export default new ReviewsService();
