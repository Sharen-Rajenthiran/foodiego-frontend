import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200 via-white to-white dark:from-amber-900/40 dark:via-black dark:to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
              Crave it. Find it. FoodieGo.
            </h1>
            <p className="mt-4 text-lg text-black/70 dark:text-white/70">
              Explore top-rated restaurants, browse mouth-watering menus, and place your order in seconds.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/restaurants" className="px-5 py-3 rounded-md bg-foreground text-background font-medium">
                Explore Restaurants
              </Link>
              <Link href="/about" className="px-5 py-3 rounded-md border border-black/10 dark:border-white/20 hover:bg-black/[.05] dark:hover:bg-white/[.06]">
                Learn More
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-black/10 dark:border-white/15 p-6 bg-white/60 dark:bg-white/5">
            <div className="grid grid-cols-3 gap-3">
              <img src="/images/pexels-pixabay-460537.jpg" alt="Delicious food" className="h-24 w-full rounded-lg object-cover" />
              <img src="/images/pexels-fotios-photos-776538.jpg" alt="Delicious food" className="h-24 w-full rounded-lg object-cover" />
              <img src="/images/pexels-reneterp-1581384.jpg" alt="Delicious food" className="h-24 w-full rounded-lg object-cover" />
              <img src="/images/pexels-pixabay-260922.jpg" alt="Delicious food" className="h-24 w-full rounded-lg object-cover" />
              <img src="/images/pexels-willpicturethis-2641886.jpg" alt="Delicious food" className="h-24 w-full rounded-lg object-cover" />
              <img src="/images/pexels-rajesh-tp-749235-1633525.jpg" alt="Delicious food" className="h-24 w-full rounded-lg object-cover" />
            </div>
            <p className="mt-4 text-sm text-black/60 dark:text-white/60">A taste of what awaits you…</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="mt-6 grid sm:grid-cols-3 gap-6">
          {["Discover", "Browse", "Enjoy"].map((title, idx) => (
            <div key={title} className="rounded-xl border border-black/10 dark:border-white/15 p-6">
              <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-semibold">
                {idx + 1}
              </div>
              <h3 className="mt-4 font-medium">{title}</h3>
              <p className="mt-2 text-sm text-black/70 dark:text-white/70">
                {idx === 0 && "Find restaurants near you with the best ratings and cuisine types."}
                {idx === 1 && "Explore detailed menus with prices and mouth-watering descriptions."}
                {idx === 2 && "Place your order and track it easily in your orders page."}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


