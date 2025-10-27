import { usePropertyPhotos } from '../../../hooks/usePropertyPhotos';
import { LoadingSpinner } from '../../common/LoadingSpinner';

interface PropertyHeaderProps {
  listingId?: string;
}

export const PropertyHeader = ({ listingId }: PropertyHeaderProps) => {
  const { data: propertyData, isLoading } = usePropertyPhotos(listingId || '');

  const photos = propertyData?.photos || [];
  const placeInfo = propertyData?.placeInfo;

  return (
    <div className="mb-8">
      <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="large" text="Loading photos..." />
          </div>
        ) : photos.length > 0 ? (
          <div className="relative w-full h-full">
            <img
              src={photos[0]}
              alt={placeInfo?.name || 'Property'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = `https://placehold.co/1200x400/e2e8f0/64748b?text=${listingId}`;
              }}
            />
            {photos.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                +{photos.length - 1} more photos
              </div>
            )}
          </div>
        ) : (
          <img
            src={`https://placehold.co/1200x400/e2e8f0/64748b?text=${listingId}`}
            alt="Property"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {placeInfo?.name || listingId?.replace(/-/g, ' ').toUpperCase()}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {placeInfo?.address || 'Modern apartment in the heart of Shoreditch'}
        </p>
        
        {placeInfo?.rating && (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="text-lg font-semibold">{placeInfo.rating}</span>
              <span className="text-gray-600">({placeInfo.totalReviews} reviews)</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">2</span> Bedrooms
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">1</span> Bathroom
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">4</span> Guests
          </div>
        </div>
      </div>
    </div>
  );
};