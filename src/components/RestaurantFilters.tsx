"use client";

import { useState } from "react";

interface RestaurantFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  cuisineType: string;
  priceRange: string;
  location: string;
  rating: string;
}

const cuisineTypes = [
  "All Cuisines",
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Indian",
  "American",
  "Mediterranean",
  "Thai",
  "French",
  "Greek",
  "Korean",
  "Vietnamese",
  "Middle Eastern",
  "Caribbean",
  "African",
  "Spanish",
  "German",
  "Russian",
  "Brazilian"
];

const priceRanges = [
  "All Prices",
  "$ (Under $10)",
  "$$ ($10 - $25)",
  "$$$ ($25 - $50)",
  "$$$$ (Over $50)"
];

const locations = [
  "All Locations",
  "New York",
  "San Francisco",
  "Chicago",
  "Austin",
  "Seattle",
  "Boston",
  "Denver",
  "Los Angeles",
  "Portland",
  "Miami"
];

const ratings = [
  "All Ratings",
  "4.5+ Stars",
  "4.0+ Stars",
  "3.5+ Stars",
  "3.0+ Stars"
];

export default function RestaurantFilters({ onFiltersChange }: RestaurantFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    cuisineType: "All Cuisines",
    priceRange: "All Prices",
    location: "All Locations",
    rating: "All Ratings"
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      cuisineType: "All Cuisines",
      priceRange: "All Prices",
      location: "All Locations",
      rating: "All Ratings"
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="w-80 bg-white dark:bg-black rounded-xl border border-black/10 dark:border-white/15 p-6 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Restaurants
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, cuisine..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Cuisine Type Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cuisine Type
        </label>
        <select
          value={filters.cuisineType}
          onChange={(e) => handleFilterChange("cuisineType", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          {cuisineTypes.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Price Range
        </label>
        <select
          value={filters.priceRange}
          onChange={(e) => handleFilterChange("priceRange", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          {priceRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rating
        </label>
        <select
          value={filters.rating}
          onChange={(e) => handleFilterChange("rating", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          {ratings.map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters Summary */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Active Filters
        </h3>
        <div className="space-y-1">
          {filters.search && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Search: "{filters.search}"
            </div>
          )}
          {filters.cuisineType !== "All Cuisines" && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Cuisine: {filters.cuisineType}
            </div>
          )}
          {filters.priceRange !== "All Prices" && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Price: {filters.priceRange}
            </div>
          )}
          {filters.location !== "All Locations" && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Location: {filters.location}
            </div>
          )}
          {filters.rating !== "All Ratings" && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Rating: {filters.rating}
            </div>
          )}
          {filters.search === "" && 
           filters.cuisineType === "All Cuisines" && 
           filters.priceRange === "All Prices" && 
           filters.location === "All Locations" && 
           filters.rating === "All Ratings" && (
            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
              No active filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
