export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface NormalizedReview {
  id: string;
  listingId: string;
  listingName: string;
  guestName: string;
  rating: number;
  comment: string;
  categories: ReviewCategory[];
  submittedAt: Date;
  source: 'hostaway' | 'google' | 'airbnb' | 'booking';
  type: string;
  status: string;
  isApproved: boolean;
  channel?: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  byChannel: { [key: string]: number };
  byProperty: { [key: string]: number };
  trends: {
    date: string;
    count: number;
    avgRating: number;
  }[];
}

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
}