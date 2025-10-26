import { useState } from 'react';
import { Search, MapPin, Star, ExternalLink } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../../api/reviews.api';
import { showToast } from '../common/Toaster';

interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  rating: number;
  user_ratings_total: number;
}

export const GoogleReviewsSearch = () => {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<GooglePlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await reviewsApi.searchGooglePlaces(query);
      setPlaces(response.data);
    } catch (err: unknown) {
      setError('Failed to search Google Places');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportReviews = async (placeId: string, placeName: string) => {
    try {
      const response = await reviewsApi.getGoogleReviews(placeId);
      console.log('Imported reviews:', response.data);
      
      await queryClient.invalidateQueries({ queryKey: ['reviews'] });
      await queryClient.invalidateQueries({ queryKey: ['reviewStats'] });
      
      showToast(`Imported ${response.data.length} reviews from ${placeName}`, 'success');
    } catch (err: unknown) {
      console.error('Import error:', err);
      showToast('Failed to import reviews', 'error');
    }
  };


  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Import Google Reviews
      </h3>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your property on Google..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {places.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Search Results:</h4>
          {places.map((place) => (
            <div key={place.place_id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{place.name}</h5>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {place.formatted_address}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{place.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({place.user_ratings_total} reviews)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleImportReviews(place.place_id, place.name)}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center gap-1 text-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  Import
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> You need a Google Places API key to use this feature. 
          Configure it in your backend environment variables.
        </p>
      </div>
    </div>
  );
};