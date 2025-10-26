import { Star } from 'lucide-react';
import type { NormalizedReview } from '../../../utils/types';
import { ReviewCard } from './ReviewCard';

interface ReviewsListProps {
  reviews?: NormalizedReview[];
}

export const ReviewsList = ({ reviews }: ReviewsListProps) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No reviews yet</p>
      </div>
    );
  }

  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8 pb-8 border-b">
        <div className="flex items-center gap-2">
          <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
          <span className="text-4xl font-bold">{avgRating.toFixed(1)}</span>
        </div>
        <div>
          <p className="text-xl font-semibold">Excellent</p>
          <p className="text-gray-600">{reviews.length} reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};