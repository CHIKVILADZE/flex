import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reviewsApi } from '../../api/reviews.api';
import { ReviewsList } from '../../components/public/ReviewsList/ReviewsList';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { PropertyHeader } from '../../components/public/PropertyDetails/PropertyHeader';

const PropertyDetailsPage = () => {
  const { listingId } = useParams();

  const { data: approvedReviews, isLoading } = useQuery({
    queryKey: ['approvedReviews', listingId],
    queryFn: async () => {
      const { data } = await reviewsApi.getApprovedReviews();
      return data.data.filter(r => r.listingId === listingId);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" text="Loading property..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PropertyHeader listingId={listingId} />
      
      <section className="mb-12 max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
        <p className="text-gray-700 leading-relaxed">
          Experience luxury living in this beautifully designed apartment. 
          Perfect for families or groups, featuring modern amenities and 
          stunning views. Located in the vibrant Shoreditch area.
        </p>
      </section>

      <section className="mb-12 max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['WiFi', 'Kitchen', 'Washer', 'Air conditioning', 'Heating', 'TV'].map(amenity => (
            <div key={amenity} className="flex items-center gap-2 text-gray-700">
              <span>✓</span> {amenity}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Reviews</h2>
        <ReviewsList reviews={approvedReviews} />
      </section>
    </div>
  );
};

export default PropertyDetailsPage;