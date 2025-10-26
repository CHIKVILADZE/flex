import axios from 'axios';
import { HostawayReview } from '../models/review.model';
import mockData from '../mocks/reviewsData.json';
import { config } from '../config/env';

export class HostawayService {
  private apiClient;

  constructor() {
    this.apiClient = axios.create({
      baseURL: config.hostaway.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.hostaway.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async fetchReviews(): Promise<HostawayReview[]> {
    try {
      const response = await this.apiClient.get('/reviews', {
        params: {
          accountId: config.hostaway.accountId,
        },
      });

      if (!response.data.result || response.data.result.length === 0) {
        return mockData as HostawayReview[];
      }

      return response.data.result;
    } catch (error) {
      console.error('Hostaway API Error, using mock data:', error);
      return mockData as HostawayReview[];
    }
  }

  async fetchReviewsByListing(listingId: string): Promise<HostawayReview[]> {
    try {
      const response = await this.apiClient.get('/reviews', {
        params: {
          accountId: config.hostaway.accountId,
          listingId,
        },
      });

      if (!response.data.result || response.data.result.length === 0) {
        return mockData as HostawayReview[];
      }

      return response.data.result;
    } catch (error) {
      console.error('Hostaway API Error, using mock data:', error);
      return mockData as HostawayReview[];
    }
  }
}