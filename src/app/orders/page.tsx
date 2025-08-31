"use client";
import { useState, useEffect } from "react";
import { getCart, getOrders, createOrderFromCart, clearCart, getMenuItemById, getRestaurantById } from "@/lib/mock";

export default function OrdersPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    updateData();
  }, []);

  const updateData = () => {
    setCart(getCart());
    setOrders(getOrders());
  };

  const handleCheckout = () => {
    const order = createOrderFromCart();
    if (order) {
      alert(`Order created successfully! Order ID: ${order.id}`);
      updateData();
    } else {
      alert('Your cart is empty!');
    }
  };

  const removeFromCart = (menuItemId: number) => {
    const newCart = cart.filter(item => item.menuItemId !== menuItemId);
    localStorage.setItem('foodiego-cart', JSON.stringify(newCart));
    updateData();
  };

  const updateQuantity = (menuItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    
    const newCart = cart.map(item => 
      item.menuItemId === menuItemId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('foodiego-cart', JSON.stringify(newCart));
    updateData();
  };

  const cartTotal = cart.reduce((sum, item) => {
    const menuItem = getMenuItemById(item.menuItemId);
    return sum + (menuItem?.price || 0) * item.quantity;
  }, 0);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-semibold">My Orders</h1>

      {/* Current Cart */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Current Cart</h2>
        {cart.length > 0 ? (
          <div className="rounded-xl border border-black/10 dark:border-white/15 p-6">
            {cart.map((item) => {
              const menuItem = getMenuItemById(item.menuItemId);
              if (!menuItem) return null;
              
              return (
                <div key={item.menuItemId} className="flex items-center justify-between py-3 border-b border-black/5 dark:border-white/5 last:border-b-0">
                  <div className="flex items-center gap-4">
                    {menuItem.image && (
                      <img 
                        src={menuItem.image} 
                        alt={menuItem.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{menuItem.name}</h3>
                      <p className="text-sm text-black/70 dark:text-white/70">${menuItem.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.menuItemId)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/15">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total: ${cartTotal.toFixed(2)}</span>
                <div className="flex gap-3">
                  <button 
                    onClick={clearCart}
                    className="px-4 py-2 rounded-md border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Clear Cart
                  </button>
                  <button 
                    onClick={handleCheckout}
                    className="px-4 py-2 rounded-md bg-foreground text-background hover:bg-foreground/90"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-black/10 dark:border-white/15 p-6 text-center">
            <p className="text-black/70 dark:text-white/70">Your cart is empty</p>
            <p className="text-sm text-black/50 dark:text-white/50 mt-1">Add some items from the restaurants!</p>
          </div>
        )}
      </div>

      {/* Order History */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Order History</h2>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const restaurant = getRestaurantById(order.restaurantId);
              return (
                <div key={order.id} className="rounded-xl border border-black/10 dark:border-white/15 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <p className="text-sm text-black/70 dark:text-white/70">
                        {restaurant?.name || 'Restaurant'} • {order.status || 'Processing'}
                      </p>
                      <p className="text-xs text-black/50 dark:text-white/50 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-semibold">${order.total?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Items:</h4>
                    <ul className="space-y-1">
                      {order.items?.map((item: any, idx: number) => {
                        const menuItem = getMenuItemById(item.menuItemId);
                        return (
                          <li key={idx} className="text-sm text-black/70 dark:text-white/70">
                            {menuItem?.name || `Item ${item.menuItemId}`} x {item.quantity}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-black/10 dark:border-white/15 p-6 text-center">
            <p className="text-black/70 dark:text-white/70">No orders yet</p>
            <p className="text-sm text-black/50 dark:text-white/50 mt-1">Your order history will appear here</p>
          </div>
        )}
      </div>
    </main>
  );
}


