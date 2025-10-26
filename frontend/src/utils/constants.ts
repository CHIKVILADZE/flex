export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const RATING_LABELS: Record<number, string> = {
  5: 'Excellent',
  4: 'Very Good',
  3: 'Good',
  2: 'Fair',
  1: 'Poor',
};

export const REVIEW_SOURCES = {
  hostaway: 'Hostaway',
  google: 'Google',
  airbnb: 'Airbnb',
  booking: 'Booking.com',
} as const;