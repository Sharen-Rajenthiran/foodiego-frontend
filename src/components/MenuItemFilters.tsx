"use client";

import { useState } from "react";

interface MenuItemFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  category: string;
  priceRange: string;
  spiceLevel: string;
  dietaryRestrictions: string[];
}

const categories = [
  "All Categories",
  "Appetizers",
  "Entrees",
  "Desserts",
  "Drinks"
];

const priceRanges = [
  "All Prices",
  "$ (Under $10)",
  "$$ ($10 - $25)",
  "$$$ ($25 - $50)",
  "$$$$ (Over $50)"
];

const spiceLevels = [
  "All Spice Levels",
  "Mild",
  "Medium",
  "Hot",
  "Very Hot"
];

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free"
];

export default function MenuItemFilters({ onFiltersChange }: MenuItemFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "All Categories",
    priceRange: "All Prices",
    spiceLevel: "All Spice Levels",
    dietaryRestrictions: []
  });

  const handleFilterChange = (key: keyof FilterState, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDietaryChange = (restriction: string, checked: boolean) => {
    let newRestrictions = [...filters.dietaryRestrictions];
    
    if (checked) {
      if (!newRestrictions.includes(restriction)) {
        newRestrictions.push(restriction);
      }
    } else {
      newRestrictions = newRestrictions.filter(r => r !== restriction);
    }
    
    handleFilterChange("dietaryRestrictions", newRestrictions);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      category: "All Categories",
      priceRange: "All Prices",
      spiceLevel: "All Spice Levels",
      dietaryRestrictions: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="w-80 bg-white dark:bg-black rounded-xl border border-black/10 dark:border-white/15 p-6 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Menu Filters</h2>
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
          Search Menu Items
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, description..."
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

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
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

      {/* Spice Level Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Spice Level
        </label>
        <select
          value={filters.spiceLevel}
          onChange={(e) => handleFilterChange("spiceLevel", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          {spiceLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Dietary Restrictions Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Dietary Restrictions
        </label>
        <div className="space-y-2">
          {dietaryOptions.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.dietaryRestrictions.includes(option)}
                onChange={(e) => handleDietaryChange(option, e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {option}
              </span>
            </label>
          ))}
        </div>
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
          {filters.category !== "All Categories" && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Category: {filters.category}
            </div>
          )}
          {filters.priceRange !== "All Prices" && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Price: {filters.priceRange}
            </div>
          )}
          {filters.spiceLevel !== "All Spice Levels" && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Spice: {filters.spiceLevel}
            </div>
          )}
          {filters.dietaryRestrictions.length > 0 && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Dietary: {filters.dietaryRestrictions.join(", ")}
            </div>
          )}
          {filters.search === "" && 
           filters.category === "All Categories" && 
           filters.priceRange === "All Prices" && 
           filters.spiceLevel === "All Spice Levels" && 
           filters.dietaryRestrictions.length === 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
              No active filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
