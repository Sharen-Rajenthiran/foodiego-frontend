"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import RestaurantFilters, { FilterState } from "@/components/RestaurantFilters";
import { filterRestaurants } from "@/lib/mock";

export default function RestaurantsPage() {
  const [allRestaurants, setAllRestaurants] = useState<any[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    search: "",
    cuisineType: "All Cuisines",
    priceRange: "All Prices",
    location: "All Locations",
    rating: "All Ratings"
  });

  useEffect(() => {
    async function loadRestaurants() {
      try {
        setLoading(true);
        const data = await api.getRestaurants();
        setAllRestaurants(data);
        setFilteredRestaurants(data);
        setError(null);
      } catch (e: any) {
        setError(e?.message || "Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  const handleFiltersChange = (filters: FilterState) => {
    setActiveFilters(filters);
    
    if (allRestaurants.length > 0) {
      const filtered = filterRestaurants(allRestaurants, filters);
      setFilteredRestaurants(filtered);
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-semibold mb-8">Explore Restaurants</h1>
        <div className="flex gap-8">
          <RestaurantFilters onFiltersChange={handleFiltersChange} />
          <div className="flex-1">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading restaurants...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-semibold">Explore Restaurants</h1>
        <p className="mt-6 text-red-600 dark:text-red-400">Failed to load restaurants: {error}</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-semibold mb-8">Explore Restaurants</h1>
      
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <RestaurantFilters onFiltersChange={handleFiltersChange} />
        
        {/* Restaurants Grid */}
        <div className="flex-1">
          {/* Results Summary */}
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredRestaurants.length} of {allRestaurants.length} restaurants
            </div>
            {filteredRestaurants.length === 0 && allRestaurants.length > 0 && (
              <div className="text-sm text-amber-600 dark:text-amber-400">
                No restaurants match your current filters
              </div>
            )}
          </div>

          {/* Restaurants Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((r: any) => (
              <Link key={r.id} href={`/restaurants/${r.id}`} className="rounded-xl border border-black/10 dark:border-white/15 p-5 hover:shadow-sm transition">
                {r.image ? (
                  <img 
                    src={r.image} 
                    alt={r.name}
                    className="h-36 w-full rounded-lg object-cover mb-4"
                  />
                ) : (
                  <div className="h-36 rounded-lg bg-black/5 dark:bg-white/10 mb-4" />
                )}
                <h3 className="font-medium">{r.name}</h3>
                {r.description && (
                  <p className="text-sm text-black/70 dark:text-white/70 line-clamp-2 mt-1">{r.description}</p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  {r.location && (
                    <span className="text-xs text-black/60 dark:text-white/60">{r.location}</span>
                  )}
                  {r.priceRange && (
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {r.priceRange}
                    </span>
                  )}
                  {r.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">★</span>
                      <span className="text-xs text-black/60 dark:text-white/60">
                        {r.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                {r.cuisines && r.cuisines.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                      {r.cuisines[0]}
                    </span>
                  </div>
                )}
              </Link>
            ))}
            {filteredRestaurants.length === 0 && allRestaurants.length > 0 && (
              <div className="col-span-full text-center py-20">
                <div className="text-gray-500 dark:text-gray-400">
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">No restaurants found</p>
                  <p className="text-sm">Try adjusting your filters or search terms</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


