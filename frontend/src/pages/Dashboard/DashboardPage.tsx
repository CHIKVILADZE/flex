import { useState, useMemo } from 'react';
import { useReviews, useReviewStats } from '../../hooks/useReviews';
import type { Filters } from '../../utils/types';
import { StatsCards } from './Stats/StatsCards';
import { FiltersBar } from './Filters/FiltersBar';
import { ReviewsTable } from './ReviewsTable/RaviewsTable';
import { ChartsSection } from './Charts/ChartsSection';
import { RecurringIssues } from './Issues/RecurringIssues';

const DashboardPage = () => {
  const { data: reviews, isLoading } = useReviews();
  const { data: stats } = useReviewStats();
  const [filters, setFilters] = useState<Filters>({});

  const filteredReviews = useMemo(() => {
    if (!reviews) return [];

    return reviews.filter((review) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          review.guestName.toLowerCase().includes(searchLower) ||
          review.comment.toLowerCase().includes(searchLower) ||
          review.listingName.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.status === 'approved' && !review.isApproved) return false;
      if (filters.status === 'pending' && review.isApproved) return false;

      if (filters.rating && review.rating < filters.rating) return false;

      if (filters.category) {
        const hasCategory = review.categories?.some(
          cat => cat.category === filters.category && cat.rating >= 7
        );
        if (!hasCategory) return false;
      }

      if (filters.dateFrom) {
        const reviewDate = new Date(review.submittedAt);
        const fromDate = new Date(filters.dateFrom);
        if (reviewDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const reviewDate = new Date(review.submittedAt);
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59);
        if (reviewDate > toDate) return false;
      }

      return true;
    });
  }, [reviews, filters]);

  const handleExport = () => {
    if (!filteredReviews || filteredReviews.length === 0) {
      alert('No reviews to export');
      return;
    }

    const headers = ['ID', 'Guest Name', 'Property', 'Rating', 'Comment', 'Date', 'Status'];
    const csvData = [
      headers.join(','),
      ...filteredReviews.map(r => [
        r.id,
        `"${r.guestName}"`,
        `"${r.listingName}"`,
        r.rating,
        `"${r.comment.replace(/"/g, '""')}"`,
        new Date(r.submittedAt).toISOString().split('T')[0],
        r.isApproved ? 'Approved' : 'Pending'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flex-reviews-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reviews Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage and approve guest reviews across all properties
        </p>
      </header>

      <StatsCards stats={stats} reviews={reviews} />
      
      <FiltersBar filters={filters} onChange={setFilters} onExport={handleExport} />
      <RecurringIssues reviews={filteredReviews} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReviewsTable reviews={filteredReviews} isLoading={isLoading} />
        </div>
        <div>
          <ChartsSection reviews={filteredReviews} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;