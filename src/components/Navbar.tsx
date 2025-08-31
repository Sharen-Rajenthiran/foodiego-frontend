"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getCart, createOrderFromCart } from "@/lib/mock";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/restaurants", label: "Explore" },
  { href: "/orders", label: "My Orders" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Update cart count when component mounts
    const updateCartCount = () => {
      const cart = getCart();
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    updateCartCount();

    // Listen for storage changes to update cart count
    const handleStorageChange = () => updateCartCount();
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleCheckout = () => {
    const order = createOrderFromCart();
    if (order) {
      alert(`Order created! Order ID: ${order.id}`);
      // Dispatch custom event to update cart count
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      alert('Your cart is empty!');
    }
  };

  return (
    <header className="border-b border-black/[.08] dark:border-white/[.12] sticky top-0 z-50 backdrop-blur bg-background/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          FoodieGo
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "hover:bg-black/[.05] dark:hover:bg-white/[.08]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          
          {/* Cart Section */}
          <div className="flex items-center gap-2 ml-4">
            <div className="relative">
              <button
                onClick={handleCheckout}
                className="px-3 py-2 rounded-md bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                Cart ({cartCount})
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}


