import { useReviews } from '../../hooks/useReviews';
import { Star } from 'lucide-react';
import type { PropertyRating } from '../../utils/types';



const RatingsPage = () => {
  const { data: reviews } = useReviews();

  const propertyRatings = reviews?.reduce((acc, review) => {
    if (!acc[review.listingName]) {
      acc[review.listingName] = {
        property: review.listingName,
        ratings: [],
        totalReviews: 0,
        avgRating: 0
      };
    }
    acc[review.listingName].ratings.push(review.rating);
    acc[review.listingName].totalReviews++;
    return acc;
  }, {} as Record<string, PropertyRating>) || {};

  Object.values(propertyRatings).forEach((property) => {
    property.avgRating = Number((property.ratings.reduce((a, b) => a + b, 0) / property.totalReviews).toFixed(1));
  });

  const properties = Object.values(propertyRatings).sort((a, b) => b.avgRating - a.avgRating);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Ratings Overview</h1>
        <p className="text-gray-600 mt-1">
          Property-by-property rating breakdown
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.property} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {property.property}
            </h3>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.floor(property.avgRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {property.avgRating}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              {property.totalReviews} review{property.totalReviews !== 1 ? 's' : ''}
            </div>

            <div className="mt-4 space-y-1">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = property.ratings.filter((r) => Math.floor(r) === rating).length;
                const percentage = (count / property.totalReviews * 100).toFixed(0);
                
                return (
                  <div key={rating} className="flex items-center gap-2 text-xs">
                    <span className="w-3">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-yellow-400 h-1.5 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingsPage;