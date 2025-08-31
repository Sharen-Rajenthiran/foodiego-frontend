export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-semibold">About FoodieGo</h1>
      <p className="mt-4 text-black/80 dark:text-white/80">
        FoodieGo helps you discover the best places to eat around you. We bring menus, prices, and ordering into one simple experience.
      </p>
      <div className="mt-8 grid sm:grid-cols-3 gap-6">
        {["Fast", "Reliable", "Local"].map((t) => (
          <div key={t} className="rounded-xl border border-black/10 dark:border-white/15 p-6">
            <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-semibold">{t[0]}</div>
            <h3 className="mt-4 font-medium">{t}</h3>
            <p className="mt-2 text-sm text-black/70 dark:text-white/70">
              {t === "Fast" && "Quick discovery and ordering with minimal clicks."}
              {t === "Reliable" && "Stable experience powered by modern web tech."}
              {t === "Local" && "Focused on restaurants in your area."}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}


