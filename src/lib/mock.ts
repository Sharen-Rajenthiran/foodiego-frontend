// Lightweight mock data for local development when the backend is unavailable

export type MockRestaurant = {
  id: number;
  name: string;
  location?: string;
  description?: string;
  image?: string;
  priceRange: string;
  cuisines: string[];
  rating: number;
};

export type MockMenuItem = {
  id: number;
  restaurantId: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  dietaryRestrictions: string[];
  spiceLevel: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
};

export type MockOrderItem = {
  menuItemId: number;
  quantity: number;
};

export type MockOrder = {
  id: string | number;
  restaurantId?: number;
  status?: string;
  createdAt?: string;
  items?: MockOrderItem[];
  total?: number;
};

function generateRestaurants(count: number): MockRestaurant[] {
  const cities = [
    "New York",
    "San Francisco",
    "Chicago",
    "Austin",
    "Seattle",
    "Boston",
    "Denver",
    "Los Angeles",
    "Portland",
    "Miami",
  ];
  
  const restaurantNames = [
    "The Golden Plate",
    "Saffron Kitchen",
    "Blue Moon Bistro",
    "Rustic Table",
    "Spice Garden",
    "Coastal Catch",
    "Urban Farmhouse",
    "Mountain View Grill",
    "Sunset Terrace",
    "Heritage Kitchen"
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    return {
      id,
      name: restaurantNames[i % restaurantNames.length],
      location: cities[i % cities.length],
      description: `A delightful place to enjoy curated flavors and seasonal specials. ${restaurantNames[i % restaurantNames.length]}.`,
      image: `/restaurants/restaurant-${id}.jpg`,
      priceRange: ["$", "$$", "$$$", "$$$$"][i % 4],
      cuisines: [["Italian", "Japanese", "Mexican", "Chinese", "American", "French", "Thai", "Indian", "Korean", "Spanish"][i % 10]],
      rating: 4.0 + (i % 10) * 0.1,
    };
  });
}

function generateMenuItems(restaurants: MockRestaurant[], perRestaurant: number): MockMenuItem[] {
  const adjectives = ["Crispy", "Smoky", "Zesty", "Creamy", "Hearty", "Spicy", "Savory", "Tangy", "Sweet", "Umami"];
  const foods = ["Tacos", "Burger", "Pasta", "Salad", "Ramen", "Curry", "Pizza", "Sushi Roll", "Wrap", "Stew"];
  const items: MockMenuItem[] = [];
  let idCounter = 1;
  for (const r of restaurants) {
    for (let j = 0; j < perRestaurant; j++) {
      const adjective = adjectives[j % adjectives.length];
      const food = foods[(j + r.id) % foods.length];
      const price = Number((8 + ((j * 1.7 + r.id * 0.9) % 17)).toFixed(2));
      items.push({
        id: idCounter++,
        restaurantId: r.id,
        name: `${adjective} ${food}`,
        description: `Chef's special ${food.toLowerCase()} with a ${adjective.toLowerCase()} twist.`,
        price,
        image: `/menus/menu-${(j + 1)}.jpg`,
        category: ["Appetizers", "Entrees", "Desserts", "Drinks"][j % 4],
        dietaryRestrictions: [],
        spiceLevel: ["Mild", "Medium", "Hot", "Very Hot"][j % 4],
        isVegetarian: j % 2 === 0,
        isVegan: j % 3 === 0,
        isGlutenFree: j % 5 === 0,
      });
    }
  }
  return items;
}

export const MOCK_RESTAURANTS: MockRestaurant[] = generateRestaurants(10);
export const MOCK_MENU_ITEMS: MockMenuItem[] = generateMenuItems(MOCK_RESTAURANTS, 10);

export function getRestaurantById(id: string | number): MockRestaurant | undefined {
  const numericId = typeof id === "string" ? Number(id) : id;
  return MOCK_RESTAURANTS.find(r => r.id === numericId);
}

export function getMenuItemById(id: string | number): MockMenuItem | undefined {
  const numericId = typeof id === "string" ? Number(id) : id;
  return MOCK_MENU_ITEMS.find(m => m.id === numericId);
}

export function getMenuForRestaurant(id: string | number): MockMenuItem[] {
  const numericId = typeof id === "string" ? Number(id) : id;
  return MOCK_MENU_ITEMS.filter(m => m.restaurantId === numericId);
}

export function buildMockOrder(orderId: string | number): MockOrder {
  // Deterministic but varied order contents based on orderId
  const restaurant = MOCK_RESTAURANTS[(Number(String(orderId).replace(/\D/g, "")) || 1) % MOCK_RESTAURANTS.length];
  const menu = getMenuForRestaurant(restaurant.id);
  const items: MockOrderItem[] = [];
  for (let i = 0; i < 3; i++) {
    const menuItem = menu[(i * 3 + restaurant.id) % menu.length];
    items.push({ menuItemId: menuItem.id, quantity: (i % 2) + 1 });
  }
  const total = items.reduce((sum, it) => {
    const mi = getMenuItemById(it.menuItemId)!;
    return sum + mi.price * it.quantity;
  }, 0);
  return {
    id: orderId,
    restaurantId: restaurant.id,
    status: "processing",
    createdAt: new Date().toISOString(),
    items,
    total: Number(total.toFixed(2)),
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Order management functions
export function addToCart(menuItemId: number, quantity: number = 1): void {
  try {
    const cart = getCart();
    const existingItem = cart.find(item => item.menuItemId === menuItemId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ menuItemId, quantity });
    }
    
    localStorage.setItem('foodiego-cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
}

export function getCart(): MockOrderItem[] {
  try {
    const cart = localStorage.getItem('foodiego-cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Failed to get cart:', error);
    return [];
  }
}

export function clearCart(): void {
  try {
    localStorage.removeItem('foodiego-cart');
  } catch (error) {
    console.error('Failed to clear cart:', error);
  }
}

export function createOrderFromCart(): MockOrder | null {
  try {
    const cart = getCart();
    if (cart.length === 0) return null;
    
    // Get the first item to determine restaurant
    const firstItem = getMenuItemById(cart[0].menuItemId);
    if (!firstItem) return null;
    
    const restaurant = getRestaurantById(firstItem.restaurantId);
    if (!restaurant) return null;
    
    const total = cart.reduce((sum, item) => {
      const menuItem = getMenuItemById(item.menuItemId);
      return sum + (menuItem?.price || 0) * item.quantity;
    }, 0);
    
    const order: MockOrder = {
      id: Date.now().toString(),
      restaurantId: restaurant.id,
      status: "processing",
      createdAt: new Date().toISOString(),
      items: [...cart],
      total: Number(total.toFixed(2)),
    };
    
    // Save order to localStorage
    const orders = getOrders();
    orders.push(order);
    localStorage.setItem('foodiego-orders', JSON.stringify(orders));
    
    // Clear cart after order is created
    clearCart();
    
    return order;
  } catch (error) {
    console.error('Failed to create order:', error);
    return null;
  }
}

export function getOrders(): MockOrder[] {
  try {
    const orders = localStorage.getItem('foodiego-orders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Failed to get orders:', error);
    return [];
  }
}

// Filter restaurants based on filter criteria
export function filterRestaurants(restaurants: MockRestaurant[], filters: any): MockRestaurant[] {
  return restaurants.filter(restaurant => {
    // Search filter
    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.description?.toLowerCase().includes(searchTerm) ||
        restaurant.cuisines.some(cuisine => 
          cuisine.toLowerCase().includes(searchTerm)
        ) ||
        restaurant.location?.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }

    // Cuisine type filter
    if (filters.cuisineType && filters.cuisineType !== "All Cuisines") {
      if (!restaurant.cuisines.includes(filters.cuisineType)) {
        return false;
      }
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange !== "All Prices") {
      const priceMap: { [key: string]: string } = {
        "$ (Under $10)": "$",
        "$$ ($10 - $25)": "$$",
        "$$$ ($25 - $50)": "$$$",
        "$$$$ (Over $50)": "$$$$"
      };
      
      if (restaurant.priceRange !== priceMap[filters.priceRange]) {
        return false;
      }
    }

    // Location filter
    if (filters.location && filters.location !== "All Locations") {
      if (restaurant.location !== filters.location) {
        return false;
      }
    }

    // Rating filter
    if (filters.rating && filters.rating !== "All Ratings") {
      const ratingMap: { [key: string]: number } = {
        "4.5+ Stars": 4.5,
        "4.0+ Stars": 4.0,
        "3.5+ Stars": 3.5,
        "3.0+ Stars": 3.0
      };
      
      if (restaurant.rating < ratingMap[filters.rating]) {
        return false;
      }
    }

    return true;
  });
}

// Filter menu items based on filter criteria
export function filterMenuItems(menuItems: MockMenuItem[], filters: any): MockMenuItem[] {
  return menuItems.filter(item => {
    // Search filter
    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category && filters.category !== "All Categories") {
      if (item.category !== filters.category) {
        return false;
      }
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange !== "All Prices") {
      const priceMap: { [key: string]: { min: number; max: number } } = {
        "$ (Under $10)": { min: 0, max: 10 },
        "$$ ($10 - $25)": { min: 10, max: 25 },
        "$$$ ($25 - $50)": { min: 25, max: 50 },
        "$$$$ (Over $50)": { min: 50, max: Infinity }
      };
      
      const range = priceMap[filters.priceRange];
      if (item.price < range.min || item.price > range.max) {
        return false;
      }
    }

    // Spice level filter
    if (filters.spiceLevel && filters.spiceLevel !== "All Spice Levels") {
      if (item.spiceLevel !== filters.spiceLevel) {
        return false;
      }
    }

    // Dietary restrictions filter
    if (filters.dietaryRestrictions && filters.dietaryRestrictions.length > 0) {
      const hasMatchingRestriction = filters.dietaryRestrictions.some((restriction: string) => {
        switch (restriction) {
          case "Vegetarian":
            return item.isVegetarian;
          case "Vegan":
            return item.isVegan;
          case "Gluten-Free":
            return item.isGlutenFree;
          default:
            return false;
        }
      });
      
      if (!hasMatchingRestriction) return false;
    }

    return true;
  });
}


