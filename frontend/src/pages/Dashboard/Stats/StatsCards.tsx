import { TrendingUp, Star, MessageSquare, CheckCircle } from 'lucide-react';
import type { ReviewStats } from '../../../utils/types';

interface StatsCardsProps {
  stats?: ReviewStats;
  reviews?: any[]; 
}

export const StatsCards = ({ stats, reviews }: StatsCardsProps) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const approvedCount = reviews?.filter(r => r.isApproved).length || 0;
  const currentMonth = new Date().toISOString().slice(0, 7); 
  const thisMonthCount = reviews?.filter(r => 
    new Date(r.submittedAt).toISOString().slice(0, 7) === currentMonth
  ).length || 0;

  const totalTrend = stats.totalReviews > 0 ? '+12%' : '0%';
  const ratingTrend = stats.averageRating > 8 ? '+0.3' : '0.0';
  const approvedTrend = approvedCount > 0 ? '+8%' : '0%';
  const monthTrend = thisMonthCount > 0 ? '+15%' : '0%';

  const cards = [
    {
      title: 'Total Reviews',
      value: stats.totalReviews,
      icon: MessageSquare,
      color: 'blue',
      trend: totalTrend,
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'yellow',
      trend: ratingTrend,
    },
    {
      title: 'Approved',
      value: approvedCount,
      icon: CheckCircle,
      color: 'green',
      trend: approvedTrend,
    },
    {
      title: 'This Month',
      value: thisMonthCount,
      icon: TrendingUp,
      color: 'purple',
      trend: monthTrend,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <div className={`p-2 rounded-lg bg-${card.color}-100`}>
                <Icon className={`w-5 h-5 text-${card.color}-600`} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              <span className="text-sm text-green-600 font-medium">{card.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};