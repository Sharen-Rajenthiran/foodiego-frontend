import Link from "next/link";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function RestaurantsPage() {
  try {
    const restaurants = await api.getRestaurants();

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-semibold">Explore Restaurants</h1>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((r: any) => (
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
            {r.location && (
              <p className="text-xs text-black/60 dark:text-white/60 mt-2">{r.location}</p>
            )}
          </Link>
        ))}
        {restaurants.length === 0 && (
          <p className="text-black/70 dark:text-white/70">No restaurants found.</p>
        )}
      </div>
    </main>
  );
  } catch (e: any) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-semibold">Explore Restaurants</h1>
        <p className="mt-6 text-red-600 dark:text-red-400">Failed to load restaurants: {e?.message || String(e)}</p>
      </main>
    );
  }
}


