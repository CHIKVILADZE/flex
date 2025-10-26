import { format } from 'date-fns';
import { Star } from 'lucide-react';
import type { NormalizedReview } from '../../../utils/types';

interface ReviewCardProps {
  review: NormalizedReview;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-semibold text-gray-900">{review.guestName}</p>
          <p className="text-sm text-gray-500">
            {format(new Date(review.submittedAt), 'MMMM yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{review.rating.toFixed(1)}</span>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">{review.comment}</p>

      {review.categories && review.categories.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {review.categories.slice(0, 3).map((cat, idx) => (
              <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                <span className="capitalize">{cat.category.replace(/_/g, ' ')}</span>
                <span className="font-medium">{cat.rating}/10</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};