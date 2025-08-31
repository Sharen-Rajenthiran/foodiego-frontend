export default function Footer() {
  return (
    <footer className="border-t border-black/[.08] dark:border-white/[.12] mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-sm text-black/70 dark:text-white/70 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} FoodieGo. All rights reserved.</p>
        <p className="opacity-80">Built with Next.js + Tailwind CSS</p>
      </div>
    </footer>
  );
}


