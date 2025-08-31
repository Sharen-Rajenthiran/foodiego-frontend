"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useState, useEffect } from "react";
import { addToCart } from "@/lib/mock";

type Props = { params: Promise<{ id: string }> };

export default function RestaurantMenuPage({ params }: Props) {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menu, setMenu] = useState<any[]>([]);
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
        setMenu(menuData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params]);

  const handleAddToOrder = (menuItemId: number) => {
    addToCart(menuItemId, 1);
    // You could add a toast notification here
    alert('Item added to cart!');
  };

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
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

      <h2 className="mt-8 text-xl font-semibold">Menu</h2>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((m: any) => (
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
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium">{m.name}</h3>
              {typeof m.price === "number" && (
                <span className="text-sm">${m.price.toFixed(2)}</span>
              )}
            </div>
            {m.description && (
              <p className="text-sm text-black/70 dark:text-white/70 mt-1 line-clamp-2">{m.description}</p>
            )}
            <button 
              onClick={() => handleAddToOrder(m.id)}
              className="mt-3 w-full px-4 py-2 rounded-md bg-foreground text-background text-sm hover:bg-foreground/90 transition-colors"
            >
              Add to Order
            </button>
          </div>
        ))}
        {menu.length === 0 && (
          <p className="text-black/70 dark:text-white/70">No menu items found.</p>
        )}
      </div>
    </main>
  );
}


