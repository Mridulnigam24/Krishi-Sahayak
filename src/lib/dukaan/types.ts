export type Product = {
  id: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  category: string;
  visible: boolean;
};

export type Udhaar = {
  id: string;
  name: string;
  phone?: string;
  amount: number;
  date: string; // ISO
};

export type OrderItem = { productId: string; name: string; price: number; qty: number };

export type Order = {
  id: string;
  customerName: string;
  phone?: string;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  total: number;
  date: string;
  source: "shop" | "customer";
  status: "Placed" | "Preparing" | "Ready for Pickup";
};