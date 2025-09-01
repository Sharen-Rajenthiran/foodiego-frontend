"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useState, useEffect } from "react";
import { addToCart } from "@/lib/mock";
import MenuItemFilters, { FilterState } from "@/components/MenuItemFilters";
import { filterMenuItems } from "@/lib/mock";

type Props = { params: Promise<{ id: string }> };

export default function RestaurantMenuPage({ params }: Props) {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [allMenuItems, setAllMenuItems] = useState<any[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const id = await params.then(p => p.id);
        const [restaurantData, menuData] = await Promise.all([
          api.getRestaurant(id).catch(() => null),
          api.getRestaurantMenu(id).catch(() => []),
        ]);
        setRestaurant(restaurantData);
        setAllMenuItems(menuData);
        setFilteredMenuItems(menuData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params]);

  const handleFiltersChange = (filters: FilterState) => {
    if (allMenuItems.length > 0) {
      const filtered = filterMenuItems(allMenuItems, filters);
      setFilteredMenuItems(filtered);
    }
  };

  const handleAddToOrder = (menuItemId: number) => {
    addToCart(menuItemId, 1);
    // You could add a toast notification here
    alert('Item added to cart!');
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading restaurant...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/restaurants" className="text-sm text-black/70 dark:text-white/70">← Back to restaurants</Link>
      
      {restaurant?.image && (
        <div className="mt-6">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-64 rounded-xl object-cover"
          />
        </div>
      )}
      
      <div className="mt-3">
        <h1 className="text-3xl font-semibold">{restaurant?.name ?? "Restaurant"}</h1>
        {restaurant?.description && (
          <p className="text-black/70 dark:text-white/70 mt-1">{restaurant.description}</p>
        )}
      </div>

      <div className="mt-8 flex gap-8">
        {/* Menu Filters Sidebar */}
        <MenuItemFilters onFiltersChange={handleFiltersChange} />
        
        {/* Menu Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Menu</h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredMenuItems.length} of {allMenuItems.length} items
            </div>
          </div>

          {filteredMenuItems.length === 0 && allMenuItems.length > 0 && (
            <div className="text-center py-20">
              <div className="text-gray-500 dark:text-gray-400">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-lg font-medium mb-2">No menu items found</p>
                <p className="text-sm">Try adjusting your filters or search terms</p>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((m: any) => (
              <div key={m.id} className="rounded-xl border border-black/10 dark:border-white/15 p-5">
                {m.image ? (
                  <img 
                    src={m.image} 
                    alt={m.name}
                    className="h-32 w-full rounded-lg object-cover mb-3"
                  />
                ) : (
                  <div className="h-32 rounded-lg bg-black/5 dark:bg-white/10 mb-3" />
                )}
                
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium">{m.name}</h3>
                  {typeof m.price === "number" && (
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      ${m.price.toFixed(2)}
                    </span>
                  )}
                </div>
                
                {m.description && (
                  <p className="text-sm text-black/70 dark:text-white/70 line-clamp-2 mb-3">{m.description}</p>
                )}

                {/* Menu Item Details */}
                <div className="mb-3 space-y-2">
                  {m.category && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                        {m.category}
                      </span>
                    </div>
                  )}
                  
                  {m.spiceLevel && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                        🌶️ {m.spiceLevel}
                      </span>
                    </div>
                  )}

                  {/* Dietary Restrictions */}
                  <div className="flex flex-wrap gap-1">
                    {m.isVegetarian && (
                      <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                        🥬 Vegetarian
                      </span>
                    )}
                    {m.isVegan && (
                      <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                        🌱 Vegan
                      </span>
                    )}
                    {m.isGlutenFree && (
                      <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full">
                        🌾 Gluten-Free
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => handleAddToOrder(m.id)}
                  className="w-full px-4 py-2 rounded-md bg-foreground text-background text-sm hover:bg-foreground/90 transition-colors"
                >
                  Add to Order
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}


