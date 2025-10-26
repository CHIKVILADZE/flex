import { useReviews, useReviewStats } from '../../hooks/useReviews';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AnalyticsPage = () => {
  const { data: reviews } = useReviews();
  const { data: stats } = useReviewStats();

  const monthlyTrends = stats?.trends || [];

const propertyPerformance = Object.entries(stats?.byProperty || {}).map(([property, count]) => {
  const propertyReviews = reviews?.filter(r => r.listingName === property) || [];
  const totalRating = propertyReviews.reduce((acc, r) => acc + r.rating, 0);
  
  return {
    property: property.split(' ')[0] + '...', 
    reviews: count,
    avgRating: propertyReviews.length > 0 ? totalRating / propertyReviews.length : 0
  };
});

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Deep dive into review metrics and trends
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Review Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Property Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={propertyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="property" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reviews" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
        <div className="grid grid-cols-5 gap-4">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = stats?.ratingDistribution[rating] || 0;
            const percentage = stats?.totalReviews ? (count / stats.totalReviews * 100) : 0;
            
            return (
              <div key={rating} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{rating} ⭐</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;