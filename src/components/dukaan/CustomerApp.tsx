import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Search,
  MapPin,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Send,
  History,
  Store,
  Trash2,
} from "lucide-react";
import { store, uid, inr, waLink } from "@/lib/dukaan/storage";
import type { Product, Order, OrderItem } from "@/lib/dukaan/types";

type View = "discover" | "menu" | "cart" | "confirm" | "history";

type StoreInfo = { id: string; name: string; dist: string; open: boolean; rating: number; featured?: boolean };

const STORES: StoreInfo[] = [
  { id: "krishna", name: "Krishna General Store", dist: "0.2 km", open: true, rating: 4.2, featured: true },
  { id: "sharma", name: "Sharma General Store", dist: "0.5 km", open: true, rating: 4.0 },
  { id: "gupta", name: "Gupta Kirana", dist: "0.8 km", open: false, rating: 3.8 },
];

const STORE_NAME = "Krishna General Store";

function BrandBtn({
  children, onClick, variant = "solid", className = "", disabled = false,
}: {
  children: React.ReactNode; onClick?: () => void; variant?: "solid" | "soft" | "outline"; className?: string; disabled?: boolean;
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  const styles =
    variant === "solid" ? "bg-[var(--brand)] text-[var(--brand-fg)] hover:bg-[var(--brand-dark)] shadow-sm"
    : variant === "soft" ? "bg-[var(--brand-soft)] text-[var(--brand-dark)] hover:brightness-95"
    : "border-2 border-[var(--brand)] text-[var(--brand-dark)] hover:bg-[var(--brand-soft)]";
  return <button disabled={disabled} onClick={onClick} className={`${base} ${styles} ${className}`}>{children}</button>;
}

export default function CustomerApp() {
  const [view, setView] = useState<View>("discover");
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion((v) => v + 1);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const products = useMemo(() => store.getProducts().filter((p) => p.visible), [version, view]);
  const orders = useMemo(() => store.getOrders().filter((o) => o.source === "customer"), [version, view]);

  const cartItems: OrderItem[] = products
    .filter((p) => cart[p.id])
    .map((p) => ({ productId: p.id, name: p.name, price: p.price, qty: cart[p.id] }));
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const gst = +(subtotal * 0.18).toFixed(2);
  const total = +(subtotal + gst).toFixed(2);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const setQty = (id: string, q: number) => {
    setCart((c) => {
      const next = { ...c };
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  };

  const placeOrder = (customerName: string, phone: string) => {
    if (!customerName) return toast.error("Naam zaroori hai");
    if (cartItems.length === 0) return toast.error("Cart khaali hai");
    const order: Order = {
      id: "o" + Date.now().toString().slice(-6),
      customerName, phone,
      items: cartItems, subtotal, gst, total,
      date: new Date().toISOString(),
      source: "customer", status: "Placed",
    };
    const list = store.getOrders();
    list.unshift(order);
    store.setOrders(list);
    setLastOrder(order);
    setCart({});
    setView("confirm");
    refresh();
    toast.success("Order place ho gaya! 🎉");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] text-white px-4 pt-6 pb-8 rounded-b-3xl shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {view !== "discover" && (
              <button onClick={() => setView(view === "menu" ? "discover" : view === "cart" ? "menu" : "discover")} className="p-1.5 rounded-lg hover:bg-white/10">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <p className="text-xs opacity-90">DukaanMitra</p>
              <h1 className="text-xl font-bold">
                {view === "discover" && "Apne paas ki dukaan"}
                {view === "menu" && STORE_NAME}
                {view === "cart" && "Aapka Cart"}
                {view === "confirm" && "Order Confirm!"}
                {view === "history" && "Purane Orders"}
              </h1>
            </div>
          </div>
          <button onClick={() => setView("history")} className="p-2 rounded-xl bg-white/10 hover:bg-white/20">
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 mt-4">
        {view === "discover" && <Discover onPick={() => setView("menu")} />}
        {view === "menu" && <Menu products={products} cart={cart} setQty={setQty} />}
        {view === "cart" && <CartView items={cartItems} subtotal={subtotal} gst={gst} total={total} setQty={setQty} onPlace={placeOrder} />}
        {view === "confirm" && lastOrder && <Confirm order={lastOrder} onDone={() => setView("discover")} />}
        {view === "history" && <OrderHistory orders={orders} onReorder={(o) => {
          const c: Record<string, number> = {};
          o.items.forEach((i) => { c[i.productId] = i.qty; });
          setCart(c);
          setView("cart");
        }} />}
      </div>

      {view === "menu" && cartCount > 0 && (
        <button onClick={() => setView("cart")} className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[var(--brand)] text-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-3 font-semibold hover:bg-[var(--brand-dark)] z-50">
          <ShoppingCart className="w-5 h-5" />
          <span>{cartCount} items</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-lg text-sm">{inr(subtotal)}</span>
        </button>
      )}
    </div>
  );
}

function Discover({ onPick }: { onPick: () => void }) {
  const [q, setQ] = useState("");
  const list = STORES.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input className="flex-1 text-sm outline-none" placeholder="Apne paas ki dukaan dhundo" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600 px-1">
        <MapPin className="w-4 h-4 text-[var(--brand)]" />
        <span>Greater Noida, UP</span>
      </div>
      <div className="grid gap-3">
        {list.map((s) => (
          <button
            key={s.id}
            disabled={!s.open}
            onClick={() => s.id === "krishna" ? onPick() : toast("Yeh dukaan demo mein available nahi 😅")}
            className={`text-left bg-white rounded-2xl border shadow-sm p-4 transition active:scale-[0.99] ${s.featured ? "border-[var(--brand)] ring-2 ring-[var(--brand-soft)]" : "border-slate-200"} ${!s.open ? "opacity-60" : "hover:shadow-md"}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[var(--brand-soft)] flex items-center justify-center">
                <Store className="w-7 h-7 text-[var(--brand-dark)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-900">{s.name}</p>
                  {s.featured && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">FEATURED</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.dist}</span>
                  <span className={`flex items-center gap-1 font-semibold ${s.open ? "text-green-600" : "text-red-500"}`}>● {s.open ? "Open" : "Closed"}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{s.rating}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Menu({ products, cart, setQty }: { products: Product[]; cart: Record<string, number>; setQty: (id: string, q: number) => void }) {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <p className="font-bold text-slate-900">{STORE_NAME}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />9AM - 9PM</span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />4.2 (240+ ratings)</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {products.map((p) => {
          const q = cart[p.id] || 0;
          return (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-col">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-[var(--brand-soft)] to-white flex items-center justify-center text-4xl">
                🛍️
              </div>
              <p className="font-semibold text-slate-900 mt-2 text-sm">{p.name}</p>
              <p className="text-xs text-slate-500">{p.category}</p>
              <p className="font-bold text-slate-900 mt-1">{inr(p.price)}</p>
              {q === 0 ? (
                <BrandBtn className="mt-2 w-full" onClick={() => setQty(p.id, 1)}>Add</BrandBtn>
              ) : (
                <div className="mt-2 flex items-center justify-between bg-[var(--brand-soft)] rounded-xl px-2 py-1">
                  <button onClick={() => setQty(p.id, q - 1)} className="w-7 h-7 rounded-lg bg-white text-[var(--brand-dark)] font-bold"><Minus className="w-4 h-4 mx-auto" /></button>
                  <span className="font-bold text-[var(--brand-dark)]">{q}</span>
                  <button onClick={() => setQty(p.id, q + 1)} className="w-7 h-7 rounded-lg bg-white text-[var(--brand-dark)] font-bold"><Plus className="w-4 h-4 mx-auto" /></button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CartView({
  items, subtotal, gst, total, setQty, onPlace,
}: {
  items: OrderItem[]; subtotal: number; gst: number; total: number;
  setQty: (id: string, q: number) => void; onPlace: (name: string, phone: string) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  if (items.length === 0) {
    return <div className="text-center py-16 text-slate-500">🛒 Cart khaali hai</div>;
  }
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 divide-y divide-slate-100">
        {items.map((i) => (
          <div key={i.productId} className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-slate-900 text-sm">{i.name}</p>
              <p className="text-xs text-slate-500">{inr(i.price)} × {i.qty}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[var(--brand-soft)] rounded-xl px-2 py-1 gap-2">
                <button onClick={() => setQty(i.productId, i.qty - 1)} className="w-6 h-6 rounded-lg bg-white text-[var(--brand-dark)]"><Minus className="w-3 h-3 mx-auto" /></button>
                <span className="font-bold text-[var(--brand-dark)] text-sm w-5 text-center">{i.qty}</span>
                <button onClick={() => setQty(i.productId, i.qty + 1)} className="w-6 h-6 rounded-lg bg-white text-[var(--brand-dark)]"><Plus className="w-3 h-3 mx-auto" /></button>
              </div>
              <p className="font-bold text-slate-900 w-16 text-right">{inr(i.price * i.qty)}</p>
              <button onClick={() => setQty(i.productId, 0)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
        <div className="flex justify-between"><span>GST 18%</span><span>{inr(gst)}</span></div>
        <div className="flex justify-between font-bold text-base pt-1 border-t border-slate-100 mt-1"><span>Total</span><span>{inr(total)}</span></div>
      </div>

      <div className="bg-[var(--brand-soft)] rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl">🚶</div>
        <div>
          <p className="font-semibold text-[var(--brand-dark)] text-sm">Walk-in Pickup</p>
          <p className="text-xs text-slate-600">FREE · 15 min mein ready hoga</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder="Aapka naam" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder="Phone number (91...)" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <BrandBtn onClick={() => onPlace(name, phone)} className="w-full py-3 text-base">Order Place Karo · {inr(total)}</BrandBtn>
    </div>
  );
}

function Confirm({ order, onDone }: { order: Order; onDone: () => void }) {
  const text = `Aapka order #${order.id} ready hai! 15 min mein aa jaiye. — ${STORE_NAME} 🏪\n\n${order.items.map((i) => `${i.name} × ${i.qty}`).join("\n")}\nTotal: ${inr(order.total)}`;
  const stages = ["Placed", "Preparing", "Ready for Pickup"];
  const currentIdx = 0;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-6 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-3">Order Place Ho Gaya!</h2>
        <p className="text-sm text-slate-500">Order ID: <span className="font-mono font-bold text-slate-900">#{order.id}</span></p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <p className="text-sm font-semibold text-slate-900 mb-3">Order Status</p>
        <div className="flex items-center justify-between">
          {stages.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${i <= currentIdx ? "bg-[var(--brand)] text-white" : "bg-slate-200 text-slate-500"}`}>
                {i + 1}
              </div>
              <p className={`text-[10px] mt-1.5 text-center ${i <= currentIdx ? "text-slate-900 font-semibold" : "text-slate-400"}`}>{s}</p>
              {i < stages.length - 1 && <div className={`absolute top-4 left-1/2 w-full h-0.5 ${i < currentIdx ? "bg-[var(--brand)]" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <p className="text-sm font-semibold text-slate-900 mb-2">Items</p>
        <div className="space-y-1 text-sm">
          {order.items.map((i) => (
            <div key={i.productId} className="flex justify-between">
              <span>{i.name} × {i.qty}</span>
              <span>{inr(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold pt-2 border-t border-slate-100 mt-2"><span>Total</span><span>{inr(order.total)}</span></div>
        </div>
      </div>

      <BrandBtn onClick={() => window.open(waLink(text, order.phone), "_blank")} className="w-full"><Send className="w-4 h-4" />WhatsApp pe Confirmation</BrandBtn>
      <BrandBtn variant="outline" onClick={onDone} className="w-full">Aur Shopping Karo</BrandBtn>
    </div>
  );
}

function OrderHistory({ orders, onReorder }: { orders: Order[]; onReorder: (o: Order) => void }) {
  if (orders.length === 0) {
    return <div className="text-center py-16 text-slate-500">📦 Abhi tak koi order nahi</div>;
  }
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-slate-900">#{o.id}</p>
              <p className="text-xs text-slate-500">{new Date(o.date).toLocaleString("en-IN")}</p>
            </div>
            <span className="bg-[var(--brand-soft)] text-[var(--brand-dark)] text-[10px] font-bold px-2 py-1 rounded-full">{o.status}</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">{o.items.map((i) => `${i.name}×${i.qty}`).join(", ")}</p>
          <div className="flex items-center justify-between mt-3">
            <p className="font-bold text-slate-900">{inr(o.total)}</p>
            <BrandBtn variant="soft" onClick={() => onReorder(o)}>Reorder</BrandBtn>
          </div>
        </div>
      ))}
    </div>
  );
}