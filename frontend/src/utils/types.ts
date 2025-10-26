export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface NormalizedReview {
  id: string;
  listingId: string;
  listingName: string;
  guestName: string;
  rating: number;
  comment: string;
  categories: ReviewCategory[];
  submittedAt: string;
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

export interface Filters {
  property?: string;
  rating?: number;
  channel?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  status?: 'all' | 'approved' | 'pending';
  category?: string; 
}

export interface PropertyRating {
  property: string;
  ratings: number[];
  totalReviews: number;
  avgRating: number;
}