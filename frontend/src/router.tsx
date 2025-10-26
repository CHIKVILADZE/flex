import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Layout } from './components/Layout/Layout';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const ReviewsPage = lazy(() => import('./pages/Reviews/ReviewsPage'));
const AnalyticsPage = lazy(() => import('./pages/Analitycs/AnalitycsPage'));
const RatingsPage = lazy(() => import('./pages/Ratings/RatingsPage'));
const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage'));
const PropertyDetailsPage = lazy(() => import('./pages/PropertyDetails/PropertyDetailsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFound/NotFoundPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="large" text="Loading..." />
  </div>
);

export const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="ratings" element={<RatingsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/properties" element={<Layout isPublic />}>
          <Route path=":listingId" element={<PropertyDetailsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};