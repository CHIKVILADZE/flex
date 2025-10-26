import { AlertTriangle } from 'lucide-react';
import type { NormalizedReview } from '../../../utils/types';

interface RecurringIssuesProps {
  reviews: NormalizedReview[];
}

export const RecurringIssues = ({ reviews }: RecurringIssuesProps) => {
  const categoryIssues = reviews.reduce((acc, review) => {
    review.categories?.forEach(cat => {
      if (cat.rating < 7) { 
        if (!acc[cat.category]) {
          acc[cat.category] = { count: 0, totalRating: 0 };
        }
        acc[cat.category].count++;
        acc[cat.category].totalRating += cat.rating;
      }
    });
    return acc;
  }, {} as Record<string, { count: number; totalRating: number }>);

  const issues = Object.entries(categoryIssues)
    .map(([category, data]) => ({
      category,
      count: data.count,
      avgRating: (data.totalRating / data.count).toFixed(1),
      percentage: ((data.count / reviews.length) * 100).toFixed(0)
    }))
    .filter(issue => issue.count >= 2) 
    .sort((a, b) => b.count - a.count);

  if (issues.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-2">✓ No Recurring Issues</h3>
        <p className="text-green-700 text-sm">All review categories are performing well!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-yellow-600" />
        <h3 className="text-lg font-semibold text-gray-900">Recurring Issues Detected</h3>
      </div>
      
      <div className="space-y-3">
        {issues.map(issue => (
          <div key={issue.category} className="border-l-4 border-yellow-500 pl-4 py-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {issue.category.replace(/_/g, ' ')}
                </p>
                <p className="text-sm text-gray-600">
                  {issue.count} complaints • Avg rating: {issue.avgRating}/10
                </p>
              </div>
              <span className="text-sm font-medium text-yellow-600">
                {issue.percentage}% of reviews
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};