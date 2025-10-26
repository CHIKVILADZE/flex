import { format } from 'date-fns';
import { Star, Check, X, Eye, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToggleApproval } from '../../../hooks/useReviews';
import type { NormalizedReview } from '../../../utils/types';
import { showToast } from '../../../components/common/Toaster';

interface ReviewRowProps {
  review: NormalizedReview;
}

export const ReviewRow = ({ review }: ReviewRowProps) => {
  const toggleApproval = useToggleApproval();

  const handleToggleApproval = async () => {
    try {
      await toggleApproval.mutateAsync({
        reviewId: review.id,
        isApproved: !review.isApproved,
      });
      showToast(
        review.isApproved ? 'Review hidden from public' : 'Review approved for public display',
        'success'
      );
    } catch (error) {
      showToast('Failed to update review status', 'error');
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-900">{review.guestName}</p>
          <div className="flex items-center gap-2">
            <Link 
              to={`/properties/${review.listingId}`}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              {review.listingName}
            </Link>
            <Link
              to={`/properties/${review.listingId}`}
              className="text-blue-500 hover:text-blue-700"
              title="View property page"
            >
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-gray-700 line-clamp-2 max-w-md">
          {review.comment}
        </p>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{review.rating.toFixed(1)}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {format(new Date(review.submittedAt), 'MMM dd, yyyy')}
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            review.isApproved
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {review.isApproved ? 'Approved' : 'Pending'}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleToggleApproval}
            disabled={toggleApproval.isPending}
            className={`p-2 rounded-lg transition-colors ${
              review.isApproved
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
            title={review.isApproved ? 'Hide from public' : 'Approve for public'}
          >
            {review.isApproved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          </button>
          <Link
            to={`/properties/${review.listingId}`}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            title="View property page"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </td>
    </tr>
  );
};