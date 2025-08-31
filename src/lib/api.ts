export type Restaurant = {
  id: number | string;
  name: string;
  location?: string;
  description?: string;
  image?: string;
};

export type MenuItem = {
  id: number | string;
  restaurantId?: number | string;
  name: string;
  description?: string;
  price: number;
  image?: string;
};

export type Order = {
  id: number | string;
  restaurantId?: number;
  status?: string;
  createdAt?: string;
  items?: { menuItemId: number; quantity: number }[];
  total?: number;
};

const BASE_URL = "https://localhost:8000";

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}

// When the backend is down, fall back to local mock data
const useMock = true;

export const api = useMock
  ? {
      getRestaurants: async () => {
        const { delay, MOCK_RESTAURANTS } = await import("./mock");
        await delay(150);
        return MOCK_RESTAURANTS as unknown as Restaurant[];
      },
      getRestaurant: async (id: string | number) => {
        const { delay, getRestaurantById } = await import("./mock");
        await delay(120);
        const r = getRestaurantById(id);
        if (!r) throw new Error("Restaurant not found");
        return r as unknown as Restaurant;
      },
      getRestaurantMenu: async (id: string | number) => {
        const { delay, getMenuForRestaurant } = await import("./mock");
        await delay(120);
        return getMenuForRestaurant(id) as unknown as MenuItem[];
      },
      getMenuItems: async () => {
        const { delay, MOCK_MENU_ITEMS } = await import("./mock");
        await delay(150);
        return MOCK_MENU_ITEMS as unknown as MenuItem[];
      },
      getMenuItem: async (id: string | number) => {
        const { delay, getMenuItemById } = await import("./mock");
        await delay(120);
        const m = getMenuItemById(id);
        if (!m) throw new Error("Menu item not found");
        return m as unknown as MenuItem;
      },
      getOrder: async (id: string | number) => {
        const { delay, buildMockOrder } = await import("./mock");
        await delay(200);
        return buildMockOrder(id) as unknown as Order;
      },
    }
  : {
      getRestaurants: () => fetchJson<Restaurant[]>(`${BASE_URL}/api/Restaurants`),
      getRestaurant: (id: string | number) => fetchJson<Restaurant>(`${BASE_URL}/api/Restaurants/${id}`),
      getRestaurantMenu: (id: string | number) => fetchJson<MenuItem[]>(`${BASE_URL}/api/Restaurants/${id}/menuitems`),
      getMenuItems: () => fetchJson<MenuItem[]>(`${BASE_URL}/api/MenuItems`),
      getMenuItem: (id: string | number) => fetchJson<MenuItem>(`${BASE_URL}/api/MenuItems/${id}`),
      getOrder: (id: string | number) => fetchJson<Order>(`${BASE_URL}/api/Orders/${id}`),
    };


