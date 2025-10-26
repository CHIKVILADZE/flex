import type { NormalizedReview, ReviewStats } from '../utils/types';
import { apiClient } from './client';

export const reviewsApi = {
  getHostawayReviews: () =>
    apiClient.get<{ data: NormalizedReview[] }>('/api/reviews/all'),

  getReviewStats: () =>
    apiClient.get<{ data: ReviewStats }>('/api/reviews/stats'),

  getReviewsByListing: (listingId: string) =>
    apiClient.get<{ data: NormalizedReview[] }>(`/api/reviews/listing/${listingId}`),

  getApprovedReviews: () =>
    apiClient.get<{ data: NormalizedReview[] }>('/api/reviews/approved'),

  toggleApproval: (reviewId: string, isApproved: boolean) =>
    apiClient.patch(`/api/reviews/${reviewId}/approval`, { isApproved }),

  searchGooglePlaces: async (query: string) => {
    const response = await apiClient.get(`/api/reviews/google/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  getGoogleReviews: async (placeId: string) => {
    const response = await apiClient.get(`/api/reviews/google/${placeId}`);
    return response.data;
  },

  getAllReviews: async () => {
    const response = await apiClient.get('/api/reviews/all');
    return response.data;
  },

  clearGoogleReviews: async () => {
  const response = await apiClient.delete('/api/reviews/google/clear');
  return response.data;
},
};