interface PropertyHeaderProps {
  listingId?: string;
}

export const PropertyHeader = ({ listingId }: PropertyHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-6">
        <img
          src={`https://placehold.co/1200x400/e2e8f0/64748b?text=${listingId}`}
          alt="Property"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {listingId?.replace(/-/g, ' ').toUpperCase()}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Modern apartment in the heart of Shoreditch
        </p>
        
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