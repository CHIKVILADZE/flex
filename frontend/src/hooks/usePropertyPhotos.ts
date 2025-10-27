import { useQuery } from '@tanstack/react-query';
import { reviewsApi } from '../api/reviews.api';

export const usePropertyPhotos = (listingId: string) => {
  return useQuery({
    queryKey: ['propertyPhotos', listingId],
    queryFn: async () => {
      const searchResponse = await reviewsApi.searchGooglePlaces(listingId);
      
      if (searchResponse.success && searchResponse.data.length > 0) {
        const exactMatch = searchResponse.data.find((place: {
          name: string;
          photoUrls?: string[];
          formatted_address: string;
          rating: number;
          user_ratings_total: number;
        }) => 
          place.name.toLowerCase().includes(listingId.toLowerCase()) ||
          listingId.toLowerCase().includes(place.name.toLowerCase())
        );
        
        const place = exactMatch || searchResponse.data[0];
        
        return {
          photos: place.photoUrls || [],
          placeInfo: {
            name: place.name,
            address: place.formatted_address,
            rating: place.rating,
            totalReviews: place.user_ratings_total
          }
        };
      }
      
      return {
        photos: [],
        placeInfo: null
      };
    },
    enabled: !!listingId,
    staleTime: 24 * 60 * 60 * 1000, 
    retry: 1
  });
};