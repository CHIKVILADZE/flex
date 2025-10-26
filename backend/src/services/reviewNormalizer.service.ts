import { HostawayReview, NormalizedReview, ReviewStats, ReviewCategory } from '../models/review.model';
import { GoogleReviewsService, GoogleReview, GooglePlaceDetails } from './google.service';

export class ReviewNormalizerService {
  private googleService = new GoogleReviewsService();

  normalizeHostawayReview(review: HostawayReview): NormalizedReview {
    const avgRating = review.rating ?? this.calculateAverageRating(review.reviewCategory);

    return {
      id: `hostaway-${review.id}`,
      listingId: this.extractListingId(review.listingName),
      listingName: review.listingName,
      guestName: review.guestName,
      rating: avgRating,
      comment: review.publicReview,
      categories: review.reviewCategory,
      submittedAt: new Date(review.submittedAt),
      source: 'hostaway',
      type: review.type,
      status: review.status,
      isApproved: false,
    };
  }

  private calculateAverageRating(categories: ReviewCategory[]): number {
    if (!categories || categories.length === 0) return 0;
    const sum = categories.reduce((acc, cat) => acc + cat.rating, 0);
    return Math.round((sum / categories.length) * 10) / 10;
  }

  private extractListingId(listingName: string): string {
  return listingName
    .toLowerCase()
    .replace(/\s+/g, '-')      
    .replace(/-+/g, '-')     
    .replace(/^-|-$/g, '');      }

  normalizeReviews(reviews: HostawayReview[]): NormalizedReview[] {
    return reviews.map(review => this.normalizeHostawayReview(review));
  }

  async normalizeGoogleReviews(placeDetails: GooglePlaceDetails[]): Promise<NormalizedReview[]> {
    const normalizedReviews: NormalizedReview[] = [];

    for (const place of placeDetails) {
      for (const review of place.reviews || []) {
        const normalizedReview = this.googleService.normalizeGoogleReview(review, place.name);
        normalizedReviews.push(normalizedReview);
      }
    }

    return normalizedReviews;
  }


  async getAllReviews(): Promise<NormalizedReview[]> {
    const hostawayReviews = await this.getHostawayReviews();
    const googleReviews = await this.getGoogleReviews();
    
    return [...hostawayReviews, ...googleReviews];
  }

  private async getHostawayReviews(): Promise<NormalizedReview[]> {

    return [];
  }


  private async getGoogleReviews(): Promise<NormalizedReview[]> {
    try {
      return await this.googleService.getAllFlexLivingReviews();
    } catch (error) {
      console.error('Error fetching Google reviews:', error);
      return [];
    }
  }

  calculateStats(reviews: NormalizedReview[]): ReviewStats {
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews === 0
        ? 0
        : Math.round(
            (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews) * 10
          ) / 10;

      const ratingDistribution: { [key: number]: number } = {};
      reviews.forEach(r => {
        // Convert 10-point scale to 5-star scale
        const starRating = Math.round(r.rating / 2); // 8.0 -> 4, 9.0 -> 5, 10.0 -> 5
        const clampedRating = Math.min(5, Math.max(1, starRating)); // Ensure 1-5 range
        ratingDistribution[clampedRating] = (ratingDistribution[clampedRating] || 0) + 1;
      });

    const byChannel: { [key: string]: number } = {};
    reviews.forEach(r => {
      byChannel[r.source] = (byChannel[r.source] || 0) + 1;
    });

    const byProperty: { [key: string]: number } = {};
    reviews.forEach(r => {
      byProperty[r.listingName] = (byProperty[r.listingName] || 0) + 1;
    });

    const trendMap = new Map<string, { count: number; totalRating: number }>();
    reviews.forEach(r => {
      const date = new Date(r.submittedAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!trendMap.has(monthKey)) {
        trendMap.set(monthKey, { count: 0, totalRating: 0 });
      }
      
      const trend = trendMap.get(monthKey)!;
      trend.count++;
      trend.totalRating += r.rating;
    });

    const trends = Array.from(trendMap.entries())
      .map(([date, data]) => ({
        date,
        count: data.count,
        avgRating: Math.round((data.totalRating / data.count) * 10) / 10,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      byChannel,
      byProperty,
      trends,
    };
  }
}