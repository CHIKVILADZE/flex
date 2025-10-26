import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { NormalizedReview } from '../../../utils/types';

interface ChartsSectionProps {
  reviews?: NormalizedReview[];
}

export const ChartsSection = ({ reviews }: ChartsSectionProps) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No data available</p>
      </div>
    );
  }

  const ratingDistribution = reviews.reduce((acc, review) => {
    const rating = Math.floor(review.rating);
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const ratingData = [5, 4, 3, 2, 1].map(rating => ({
    rating: `${rating} ★`,
    count: ratingDistribution[rating] || 0,
  }));

  const approvalData = [
    { name: 'Approved', value: reviews.filter(r => r.isApproved).length },
    { name: 'Pending', value: reviews.filter(r => !r.isApproved).length },
  ];

  const COLORS = ['#10b981', '#6b7280'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ratingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={approvalData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {approvalData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};