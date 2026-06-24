import type { Product, Udhaar, Order } from "./types";

const KEYS = {
  products: "dm_products",
  udhaar: "dm_udhaar",
  orders: "dm_orders",
  seeded: "dm_seeded_v1",
};

const SAMPLE_PRODUCTS: Product[] = [
  { id: "p1", name: "Parle-G", price: 10, cost: 7, stock: 50, category: "Snacks", visible: true },
  { id: "p2", name: "Surf Excel", price: 45, cost: 35, stock: 12, category: "Household", visible: true },
  { id: "p3", name: "Maggi", price: 14, cost: 10, stock: 30, category: "Snacks", visible: true },
  { id: "p4", name: "Lays", price: 20, cost: 14, stock: 4, category: "Snacks", visible: true },
  { id: "p5", name: "Colgate", price: 55, cost: 40, stock: 8, category: "Personal Care", visible: true },
  { id: "p6", name: "Dettol", price: 85, cost: 65, stock: 3, category: "Personal Care", visible: true },
];

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const SAMPLE_UDHAAR: Udhaar[] = [
  { id: "u1", name: "Ramesh Kumar", phone: "919000000001", amount: 600, date: daysAgo(38) },
  { id: "u2", name: "Suresh Sharma", phone: "919000000002", amount: 1200, date: daysAgo(52) },
  { id: "u3", name: "Pinki Devi", phone: "919000000003", amount: 350, date: daysAgo(15) },
  { id: "u4", name: "Raju Bhaiya", phone: "919000000004", amount: 800, date: daysAgo(60) },
];

function sampleOrders(): Order[] {
  const items = (idx: number) => {
    const p = SAMPLE_PRODUCTS[idx % SAMPLE_PRODUCTS.length];
    const qty = 1 + (idx % 4);
    const subtotal = p.price * qty;
    return { items: [{ productId: p.id, name: p.name, price: p.price, qty }], subtotal };
  };
  const out: Order[] = [];
  // 30 orders over last 7 days
  for (let i = 0; i < 30; i++) {
    const { items: it, subtotal } = items(i);
    const gst = +(subtotal * 0.18).toFixed(2);
    const total = +(subtotal + gst).toFixed(2);
    const d = new Date();
    d.setDate(d.getDate() - (i % 7));
    d.setHours(10 + (i % 8), 0, 0, 0);
    out.push({
      id: "o" + (1000 + i),
      customerName: ["Aman", "Neha", "Vikas", "Pooja", "Ravi"][i % 5],
      items: it,
      subtotal,
      gst,
      total,
      date: d.toISOString(),
      source: i % 3 === 0 ? "customer" : "shop",
      status: "Ready for Pickup",
    });
  }
  return out;
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
}

export function seedIfNeeded() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEYS.seeded)) return;
  safeSet(KEYS.products, SAMPLE_PRODUCTS);
  safeSet(KEYS.udhaar, SAMPLE_UDHAAR);
  safeSet(KEYS.orders, sampleOrders());
  localStorage.setItem(KEYS.seeded, "1");
}

export const store = {
  getProducts: () => safeGet<Product[]>(KEYS.products, []),
  setProducts: (v: Product[]) => safeSet(KEYS.products, v),
  getUdhaar: () => safeGet<Udhaar[]>(KEYS.udhaar, []),
  setUdhaar: (v: Udhaar[]) => safeSet(KEYS.udhaar, v),
  getOrders: () => safeGet<Order[]>(KEYS.orders, []),
  setOrders: (v: Order[]) => safeSet(KEYS.orders, v),
};

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function daysSince(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export function waLink(text: string, phone?: string) {
  const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}