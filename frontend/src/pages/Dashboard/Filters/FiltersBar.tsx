import { Search, Filter, Download, Calendar, X } from 'lucide-react';
import type { Filters } from '../../../utils/types';
import { useState } from 'react';

interface FiltersBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onExport?: () => void;
}

export const FiltersBar = ({ filters, onChange, onExport }: FiltersBarProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, status: e.target.value as any });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, rating: e.target.value ? Number(e.target.value) : undefined });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, category: e.target.value || undefined });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, dateFrom: e.target.value || undefined });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, dateTo: e.target.value || undefined });
  };

  const clearFilters = () => {
    onChange({});
  };

  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key as keyof Filters] !== undefined && 
    filters[key as keyof Filters] !== '' &&
    filters[key as keyof Filters] !== 'all'
  ).length;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reviews, guests, properties..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="w-full md:w-48">
          <select
            value={filters.status || 'all'}
            onChange={handleStatusChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Reviews</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="w-full md:w-48">
          <select
            value={filters.rating || ''}
            onChange={handleRatingChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 relative"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden md:inline">More Filters</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <button 
            onClick={onExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export</span>
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Advanced Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline w-4 h-4 mr-1" />
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="cleanliness">Cleanliness</option>
                <option value="communication">Communication</option>
                <option value="value">Value</option>
                <option value="location">Location</option>
                <option value="respect_house_rules">House Rules</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={handleDateFromChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={handleDateToChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {filters.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Category: {filters.category}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => onChange({ ...filters, category: undefined })}
                  />
                </span>
              )}
              {filters.dateFrom && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  From: {filters.dateFrom}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => onChange({ ...filters, dateFrom: undefined })}
                  />
                </span>
              )}
              {filters.dateTo && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  To: {filters.dateTo}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => onChange({ ...filters, dateTo: undefined })}
                  />
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};