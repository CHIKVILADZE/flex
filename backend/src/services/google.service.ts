import axios from 'axios';
import { NormalizedReview, ReviewCategory } from '../models/review.model';
import { logger } from '../utils/logger';
import { config } from '../config/env';

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
  formatted_address?: string;
  photoUrls?: string[];
}

export class GoogleReviewsService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    this.apiKey = config.google.placesApiKey;
    if (!this.apiKey) {
      logger.warn('Google Places API key not configured');
    }
  }

    async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
      if (!this.apiKey) {
        logger.error('Google Places API key not configured');
        return null;
      }

      try {
        logger.info('Fetching Google Place details', { placeId });
        
        const response = await axios.get(`${this.baseUrl}/details/json`, {
          params: {
            place_id: placeId,
            fields: 'place_id,name,rating,user_ratings_total,reviews,photos,formatted_address',
            key: this.apiKey,
          },
        });

        if (response.data.status !== 'OK') {
          logger.error('Google Places API error', { 
            status: response.data.status,
            error_message: response.data.error_message 
          });
          return null;
        }

        const result = response.data.result;
        
        const placeWithPhotos = {
          place_id: result.place_id,
          name: result.name,
          rating: result.rating || 0,
          user_ratings_total: result.user_ratings_total || 0,
          reviews: result.reviews || [],
          formatted_address: result.formatted_address,
          photoUrls: result.photos ? result.photos.map((photo: any) => 
            `${this.baseUrl}/photo?maxwidth=1200&photoreference=${photo.photo_reference}&key=${this.apiKey}`
          ) : []
        };

        logger.info('Google Place details fetched successfully', { 
          name: result.name,
          photosCount: result.photos?.length || 0 
        });

        return placeWithPhotos;
      } catch (error: any) {
        logger.error('Google Places API request failed', { 
          error: error.message,
          placeId 
        });
        return null;
      }
    }

async searchPlaces(query: string): Promise<any[]> {
  if (!this.apiKey) {
    logger.error('Google Places API key not configured');
    return [];
  }

  try {
    logger.info('Searching Google Places', { query });
    
    const response = await axios.get(`${this.baseUrl}/textsearch/json`, {
      params: {
        query,
        fields: 'place_id,name,formatted_address,rating,user_ratings_total,photos,geometry',
        key: this.apiKey,
      },
    });

    if (response.data.status !== 'OK') {
      logger.error('Google Places search error', { 
        status: response.data.status,
        error_message: response.data.error_message 
      });
      return [];
    }

    const resultsWithPhotos = response.data.results.map((place: any) => ({
      ...place,
      photoUrls: place.photos ? place.photos.map((photo: any) => 
        `${this.baseUrl}/photo?maxwidth=1200&photoreference=${photo.photo_reference}&key=${this.apiKey}`
      ) : []
    }));

    logger.info('Google Places search successful', { 
      resultsCount: resultsWithPhotos.length 
    });

    return resultsWithPhotos;
  } catch (error: any) {
    logger.error('Google Places search failed', { 
      error: error.message,
      query 
    });
    return [];
  }
}

  async searchFlexLivingProperties(): Promise<any[]> {
    const queries = [
      'Flex Living London',
      'Flex Living Shoreditch',
      'Flex Living Camden',
      'Flex Living property management'
    ];

    const allResults = [];
    
    for (const query of queries) {
      try {
        const results = await this.searchPlaces(query);
        allResults.push(...results);
      } catch (error) {
        logger.error('Error searching for Flex Living properties', { query, error });
      }
    }

    const uniqueResults = allResults.filter((place, index, self) => 
      index === self.findIndex(p => p.place_id === place.place_id)
    );

    return uniqueResults;
  }

  async getAllFlexLivingReviews(): Promise<NormalizedReview[]> {
    const properties = await this.searchFlexLivingProperties();
    const allReviews: NormalizedReview[] = [];

    for (const property of properties) {
      try {
        const reviews = await this.getReviewsForProperty(property.place_id);
        allReviews.push(...reviews);
      } catch (error) {
        logger.error('Error fetching reviews for property', { 
          placeId: property.place_id, 
          error 
        });
      }
    }

    return allReviews;
  }

  normalizeGoogleReview(googleReview: GoogleReview, placeName: string): NormalizedReview {
    const normalizedRating = googleReview.rating * 2;
    
    const categories = this.extractCategoriesFromText(googleReview.text, normalizedRating);
    
    const listingId = this.extractListingId(placeName);

    return {
      id: `google-${googleReview.time}-${Math.random().toString(36).substr(2, 9)}`,
      listingId,
      listingName: placeName,
      guestName: googleReview.author_name,
      rating: normalizedRating,
      comment: googleReview.text || '',
      categories,
      submittedAt: new Date(googleReview.time * 1000),
      source: 'google',
      type: 'guest-review',
      status: 'published',
      isApproved: false,
      channel: 'google',
    };
  }

  private extractCategoriesFromText(text: string, rating: number): ReviewCategory[] {
    const categories: ReviewCategory[] = [];
    const lowerText = text.toLowerCase();

    const categoryKeywords = {
      cleanliness: ['clean', 'dirty', 'tidy', 'messy', 'hygiene', 'spotless'],
      communication: ['communication', 'responsive', 'reply', 'contact', 'message'],
      location: ['location', 'area', 'neighborhood', 'nearby', 'walking distance'],
      value: ['value', 'price', 'expensive', 'cheap', 'worth', 'cost'],
      amenities: ['wifi', 'kitchen', 'bathroom', 'bed', 'furniture', 'appliances'],
      check_in: ['check-in', 'checkin', 'arrival', 'keys', 'access'],
      accuracy: ['accurate', 'description', 'photos', 'listing', 'matches']
    };

    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      const hasKeyword = keywords.some(keyword => lowerText.includes(keyword));
      if (hasKeyword) {
        const categoryRating = this.calculateCategoryRating(text, rating);
        categories.push({
          category,
          rating: categoryRating
        });
      }
    });

    if (categories.length === 0) {
      categories.push({
        category: 'overall_experience',
        rating: rating
      });
    }

    return categories;
  }

  private calculateCategoryRating(text: string, overallRating: number): number {
    const lowerText = text.toLowerCase();
    
    const positiveWords = ['excellent', 'great', 'amazing', 'perfect', 'wonderful', 'fantastic', 'outstanding'];
    const negativeWords = ['terrible', 'awful', 'horrible', 'disappointing', 'bad', 'poor', 'worst'];
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    let adjustedRating = overallRating;
    if (positiveCount > negativeCount) {
      adjustedRating = Math.min(10, overallRating + 1);
    } else if (negativeCount > positiveCount) {
      adjustedRating = Math.max(1, overallRating - 1);
    }
    
    return adjustedRating;
  }

  private extractListingId(placeName: string): string {
    return placeName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .replace(/[^a-z0-9-]/g, '');
  }

  async getReviewsForProperty(placeId: string): Promise<NormalizedReview[]> {
    const placeDetails = await this.getPlaceDetails(placeId);
    
    if (!placeDetails || !placeDetails.reviews) {
      return [];
    }

    return placeDetails.reviews.map(review => 
      this.normalizeGoogleReview(review, placeDetails.name)
    );
  }
}