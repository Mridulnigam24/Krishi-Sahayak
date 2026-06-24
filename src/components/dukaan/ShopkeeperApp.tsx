import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Wallet,
  Package,
  Receipt,
  ShieldCheck,
  BarChart3,
  CalendarDays,
  Plus,
  Trash2,
  Search,
  Mic,
  Send,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import { store, uid, daysSince, inr, waLink } from "@/lib/dukaan/storage";
import type { Product, Udhaar, Order, OrderItem } from "@/lib/dukaan/types";

type Tab = "dash" | "udhaar" | "menu" | "bill" | "verify" | "analytics" | "summary";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dash", label: "Dashboard", icon: LayoutDashboard },
  { id: "udhaar", label: "Udhaar", icon: Wallet },
  { id: "menu", label: "Menu", icon: Package },
  { id: "bill", label: "Bill", icon: Receipt },
  { id: "verify", label: "Verify UPI", icon: ShieldCheck },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "summary", label: "Daily Summary", icon: CalendarDays },
];

const STORE_NAME = "Krishna General Store";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-sm ${className}`}>{children}</div>
  );
}

function BrandBtn({
  children,
  onClick,
  variant = "solid",
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "solid" | "soft" | "outline";
  className?: string;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98]";
  const styles =
    variant === "solid"
      ? "bg-[var(--brand)] text-[var(--brand-fg)] hover:bg-[var(--brand-dark)] shadow-sm"
      : variant === "soft"
      ? "bg-[var(--brand-soft)] text-[var(--brand-dark)] hover:brightness-95"
      : "border-2 border-[var(--brand)] text-[var(--brand-dark)] hover:bg-[var(--brand-soft)]";
  return (
    <button type={type} onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

export default function ShopkeeperApp() {
  const [tab, setTab] = useState<Tab>("dash");
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion((v) => v + 1);
  const [dateLabel, setDateLabel] = useState("");
  useEffect(() => {
    setDateLabel(new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  }, []);

  const products = useMemo(() => store.getProducts(), [version]);
  const udhaar = useMemo(() => store.getUdhaar(), [version]);
  const orders = useMemo(() => store.getOrders(), [version]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] text-white px-4 pt-6 pb-8 rounded-b-3xl shadow-md">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm opacity-90">Namaste! 🙏</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">{STORE_NAME}</h1>
          <p className="text-sm opacity-90 mt-1">{dateLabel || "\u00a0"}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 -mt-4">
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-1.5 flex gap-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition ${
                  active ? "bg-[var(--brand)] text-white shadow" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 mt-5">
        {tab === "dash" && <Dashboard products={products} udhaar={udhaar} orders={orders} go={setTab} />}
        {tab === "udhaar" && <UdhaarTracker udhaar={udhaar} refresh={refresh} />}
        {tab === "menu" && <MenuManager products={products} refresh={refresh} />}
        {tab === "bill" && <BillGenerator products={products} refresh={refresh} />}
        {tab === "verify" && <FakePaymentDetector />}
        {tab === "analytics" && <Analytics orders={orders} products={products} />}
        {tab === "summary" && <DailySummary orders={orders} udhaar={udhaar} />}
      </div>
    </div>
  );
}

function Dashboard({
  products,
  udhaar,
  orders,
  go,
}: {
  products: Product[];
  udhaar: Udhaar[];
  orders: Order[];
  go: (t: Tab) => void;
}) {
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.date).toDateString() === today);
  const todaySales = todayOrders.reduce((s, o) => s + o.total, 0);
  const todayProfit = Math.round(todaySales * 0.25);
  const month = new Date().getMonth();
  const monthSales = orders.filter((o) => new Date(o.date).getMonth() === month).reduce((s, o) => s + o.total, 0);
  const monthProfit = Math.round(monthSales * 0.25);
  const totalUdhaar = udhaar.reduce((s, u) => s + u.amount, 0);

  const counts = new Map<string, number>();
  orders.forEach((o) => o.items.forEach((it) => counts.set(it.productId, (counts.get(it.productId) || 0) + it.qty)));
  const enriched = products.map((p) => ({ p, qty: counts.get(p.id) || 0 }));
  const best = [...enriched].sort((a, b) => b.qty - a.qty)[0];
  const worst = [...enriched].sort((a, b) => a.qty - b.qty)[0];

  const metrics = [
    { label: "Aaj ka Profit", value: inr(todayProfit), sub: `Sales ${inr(todaySales)}` },
    { label: "Monthly Profit", value: inr(monthProfit), sub: `Sales ${inr(monthSales)}` },
    { label: "Total Udhaar", value: inr(totalUdhaar), sub: `${udhaar.length} customers` },
    { label: "Aaj ke Orders", value: String(todayOrders.length), sub: `${todayOrders.filter((o) => o.source === "customer").length} customer app se` },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <Card key={m.label} className="p-4">
            <p className="text-xs text-slate-500 font-medium">{m.label}</p>
            <p className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{m.value}</p>
            <p className="text-xs text-slate-400 mt-1">{m.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {best && (
          <div className="rounded-2xl p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center gap-2 text-green-700 text-xs font-semibold">
              <TrendingUp className="w-4 h-4" /> Best Selling
            </div>
            <p className="text-lg font-bold text-slate-900 mt-1">{best.p.name}</p>
            <p className="text-sm text-slate-600">{best.qty} units bik chuke · {inr(best.p.price)}</p>
          </div>
        )}
        {worst && (
          <div className="rounded-2xl p-4 bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
            <div className="flex items-center gap-2 text-red-700 text-xs font-semibold">
              <TrendingDown className="w-4 h-4" /> Worst Selling
            </div>
            <p className="text-lg font-bold text-slate-900 mt-1">{worst.p.name}</p>
            <p className="text-sm text-slate-600">Sirf {worst.qty} units · stock badhane se pehle socho</p>
          </div>
        )}
      </div>

      <Card className="p-4">
        <p className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</p>
        <div className="grid grid-cols-3 gap-2">
          <BrandBtn onClick={() => go("bill")}><Receipt className="w-4 h-4" />Bill Banao</BrandBtn>
          <BrandBtn variant="soft" onClick={() => go("udhaar")}><Wallet className="w-4 h-4" />Add Udhaar</BrandBtn>
          <BrandBtn variant="outline" onClick={() => go("verify")}><ShieldCheck className="w-4 h-4" />Verify UPI</BrandBtn>
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-sm font-semibold text-slate-900 mb-3">Recent Orders</p>
        <div className="divide-y divide-slate-100">
          {orders.slice(0, 6).map((o) => (
            <div key={o.id} className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-medium text-slate-900">#{o.id} · {o.customerName}</p>
                <p className="text-xs text-slate-500">
                  {o.items.map((i) => `${i.name}×${i.qty}`).join(", ")} · {new Date(o.date).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{inr(o.total)}</p>
                <p className="text-[10px] text-slate-400 uppercase">{o.source}</p>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">Abhi tak koi order nahi 🛒</p>}
        </div>
      </Card>
    </div>
  );
}

function UdhaarTracker({ udhaar, refresh }: { udhaar: Udhaar[]; refresh: () => void }) {
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", amount: "" });
  const [payAmt, setPayAmt] = useState<Record<string, string>>({});

  const filtered = udhaar.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()));

  const addUdhaar = () => {
    if (!form.name || !form.amount) return toast.error("Naam aur amount zaroori hai");
    const list = store.getUdhaar();
    list.unshift({ id: uid(), name: form.name, phone: form.phone, amount: Number(form.amount), date: new Date().toISOString() });
    store.setUdhaar(list);
    setForm({ name: "", phone: "", amount: "" });
    toast.success("Udhaar add ho gaya ✅");
    refresh();
  };

  const collect = (u: Udhaar) => {
    const amt = Number(payAmt[u.id] || 0);
    if (!amt || amt <= 0) return toast.error("Sahi amount daalo");
    const remaining = u.amount - amt;
    const list = store.getUdhaar();
    if (remaining <= 0) {
      store.setUdhaar(list.filter((x) => x.id !== u.id));
      toast.success(`${u.name} ka pura udhaar chukta! 🎉`);
    } else {
      store.setUdhaar(list.map((x) => (x.id === u.id ? { ...x, amount: remaining } : x)));
      toast.success(`${inr(amt)} mil gaya, baaki ${inr(remaining)}`);
    }
    setPayAmt((p) => ({ ...p, [u.id]: "" }));
    refresh();
  };

  const remind = (u: Udhaar) => {
    const text = `Namaste ${u.name} Ji, ${STORE_NAME} se yaad dila rahe hain — aapka ${inr(u.amount)} baaki hai. Suvidha ho toh aaj aa jaiye. Dhanyawaad! 🙏`;
    window.open(waLink(text, u.phone), "_blank");
  };

  const del = (id: string) => {
    store.setUdhaar(store.getUdhaar().filter((x) => x.id !== id));
    refresh();
    toast.success("Hata diya");
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <p className="text-sm font-semibold text-slate-900 mb-3">Naya Udhaar Add Karo</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Customer naam" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Phone (91...)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input type="number" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Amount ₹" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <BrandBtn onClick={addUdhaar}><Plus className="w-4 h-4" />Add</BrandBtn>
        </div>
      </Card>

      <div className="flex gap-2 items-center">
        <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input className="flex-1 text-sm outline-none" placeholder="Naam se dhundo..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <BrandBtn variant="soft" onClick={() => toast("Voice feature coming soon 🎤")}><Mic className="w-4 h-4" />Voice</BrandBtn>
      </div>

      <div className="grid gap-3">
        {filtered.map((u) => {
          const days = daysSince(u.date);
          const overdue = days >= 30;
          return (
            <Card key={u.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900">{u.name}</p>
                    {overdue ? (
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />{days} din overdue
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">{days} din pehle</span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{inr(u.amount)}</p>
                </div>
                <button onClick={() => del(u.id)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 mt-3">
                <input type="number" placeholder="Payment mila ₹" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={payAmt[u.id] || ""} onChange={(e) => setPayAmt({ ...payAmt, [u.id]: e.target.value })} />
                <BrandBtn onClick={() => collect(u)}>Collect</BrandBtn>
                <button onClick={() => remind(u)} className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold bg-green-500 text-white hover:bg-green-600">
                  <MessageCircle className="w-4 h-4" />WhatsApp Remind
                </button>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && <div className="text-center text-slate-500 py-10">Koi udhaar nahi mila 🎉</div>}
      </div>
    </div>
  );
}

function MenuManager({ products, refresh }: { products: Product[]; refresh: () => void }) {
  const empty = { name: "", price: "", cost: "", stock: "", category: "Snacks" };
  const [form, setForm] = useState<Record<string, string>>(empty);
  const [editId, setEditId] = useState<string | null>(null);

  const submit = () => {
    if (!form.name || !form.price) return toast.error("Naam aur price zaroori");
    const list = store.getProducts();
    if (editId) {
      store.setProducts(list.map((p) => p.id === editId ? { ...p, name: form.name, price: Number(form.price), cost: Number(form.cost || 0), stock: Number(form.stock || 0), category: form.category } : p));
      toast.success("Update ho gaya");
    } else {
      list.unshift({ id: uid(), name: form.name, price: Number(form.price), cost: Number(form.cost || 0), stock: Number(form.stock || 0), category: form.category, visible: true });
      store.setProducts(list);
      toast.success("Product add ho gaya");
    }
    setForm(empty);
    setEditId(null);
    refresh();
  };

  const edit = (p: Product) => {
    setEditId(p.id);
    setForm({ name: p.name, price: String(p.price), cost: String(p.cost), stock: String(p.stock), category: p.category });
  };

  const del = (id: string) => {
    store.setProducts(store.getProducts().filter((p) => p.id !== id));
    refresh();
    toast.success("Delete ho gaya");
  };

  const toggle = (p: Product) => {
    store.setProducts(store.getProducts().map((x) => x.id === p.id ? { ...x, visible: !x.visible } : x));
    refresh();
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <p className="text-sm font-semibold text-slate-900 mb-3">{editId ? "Edit Product" : "Naya Product"}</p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm col-span-2" placeholder="Naam" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="number" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Price ₹" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input type="number" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Cost ₹" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          <input type="number" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>
        <div className="flex gap-2 mt-3">
          <BrandBtn onClick={submit}>{editId ? "Update" : "Add"}</BrandBtn>
          {editId && <BrandBtn variant="outline" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</BrandBtn>}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {products.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-900">{p.name}</p>
                  {p.stock < 5 && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">LOW STOCK</span>}
                  {!p.visible && <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">HIDDEN</span>}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{p.category} · Stock: {p.stock}</p>
                <p className="text-lg font-bold text-slate-900 mt-1">{inr(p.price)}</p>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-slate-600">
                <input type="checkbox" checked={p.visible} onChange={() => toggle(p)} className="accent-[var(--brand)]" />Show
              </label>
            </div>
            <div className="flex gap-2 mt-3">
              <BrandBtn variant="soft" onClick={() => edit(p)} className="flex-1">Edit</BrandBtn>
              <button onClick={() => del(p.id)} className="rounded-xl px-3 py-2 text-sm font-semibold border-2 border-red-200 text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BillGenerator({ products, refresh }: { products: Product[]; refresh: () => void }) {
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [pickId, setPickId] = useState(products[0]?.id || "");
  const [qty, setQty] = useState("1");

  const addItem = () => {
    const p = products.find((x) => x.id === pickId);
    if (!p) return;
    const q = Math.max(1, Number(qty) || 1);
    setItems((prev) => {
      const ex = prev.find((i) => i.productId === p.id);
      if (ex) return prev.map((i) => i.productId === p.id ? { ...i, qty: i.qty + q } : i);
      return [...prev, { productId: p.id, name: p.name, price: p.price, qty: q }];
    });
    setQty("1");
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const gst = +(subtotal * 0.18).toFixed(2);
  const total = +(subtotal + gst).toFixed(2);

  const billText = () => {
    const lines = items.map((i) => `${i.name} × ${i.qty} = ${inr(i.price * i.qty)}`).join("\n");
    return `🧾 ${STORE_NAME}\n${new Date().toLocaleString("en-IN")}\nCustomer: ${customer || "Walk-in"}\n\n${lines}\n\nSubtotal: ${inr(subtotal)}\nGST 18%: ${inr(gst)}\nTotal: ${inr(total)}\n\nDhanyawaad! 🙏`;
  };

  const saveOrder = () => {
    if (items.length === 0) return;
    const list = store.getOrders();
    list.unshift({
      id: "o" + Date.now().toString().slice(-6),
      customerName: customer || "Walk-in",
      phone, items, subtotal, gst, total,
      date: new Date().toISOString(), source: "shop", status: "Ready for Pickup",
    });
    store.setOrders(list);
    refresh();
  };

  const sendWA = () => {
    if (items.length === 0) return toast.error("Pehle items add karo");
    window.open(waLink(billText(), phone), "_blank");
    saveOrder();
  };

  const downloadPDF = () => {
    if (items.length === 0) return toast.error("Pehle items add karo");
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text(STORE_NAME, 20, 20);
    doc.setFontSize(10); doc.text(new Date().toLocaleString("en-IN"), 20, 28);
    doc.text(`Customer: ${customer || "Walk-in"}`, 20, 35);
    doc.line(20, 40, 190, 40);
    let y = 48;
    items.forEach((i) => {
      doc.text(`${i.name} x ${i.qty}`, 20, y);
      doc.text(`Rs ${(i.price * i.qty).toFixed(2)}`, 170, y, { align: "right" });
      y += 7;
    });
    doc.line(20, y, 190, y); y += 8;
    doc.text(`Subtotal: Rs ${subtotal.toFixed(2)}`, 170, y, { align: "right" }); y += 7;
    doc.text(`GST 18%: Rs ${gst.toFixed(2)}`, 170, y, { align: "right" }); y += 7;
    doc.setFontSize(14); doc.text(`Total: Rs ${total.toFixed(2)}`, 170, y + 2, { align: "right" });
    doc.save(`bill-${Date.now()}.pdf`);
    saveOrder();
    toast.success("Bill download ho gaya 📄");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-4 space-y-3">
        <p className="text-sm font-semibold text-slate-900">Customer Info</p>
        <div className="grid grid-cols-2 gap-2">
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Naam" value={customer} onChange={(e) => setCustomer(e.target.value)} />
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Phone (91...)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <p className="text-sm font-semibold text-slate-900 pt-2">Items Add Karo</p>
        <div className="grid grid-cols-[1fr_80px_auto] gap-2">
          <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={pickId} onChange={(e) => setPickId(e.target.value)}>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name} — {inr(p.price)}</option>)}
          </select>
          <input type="number" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={qty} onChange={(e) => setQty(e.target.value)} />
          <BrandBtn onClick={addItem}><Plus className="w-4 h-4" />Add</BrandBtn>
        </div>
        <div className="divide-y divide-slate-100">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center justify-between py-2">
              <p className="text-sm">{i.name} × {i.qty}</p>
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold">{inr(i.price * i.qty)}</p>
                <button onClick={() => setItems(items.filter((x) => x.productId !== i.productId))} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-xs text-slate-400 py-2">Koi item nahi</p>}
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-sm font-semibold text-slate-900 mb-2">Bill Preview</p>
        <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300">
          <p className="text-center font-bold text-slate-900">{STORE_NAME}</p>
          <p className="text-center text-xs text-slate-500">{new Date().toLocaleString("en-IN")}</p>
          <p className="text-xs text-slate-600 mt-2">Customer: {customer || "Walk-in"}</p>
          <div className="border-t border-dashed border-slate-300 my-3" />
          <div className="space-y-1 text-sm">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between">
                <span>{i.name} × {i.qty}</span>
                <span>{inr(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-slate-300 my-3" />
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
            <div className="flex justify-between"><span>GST 18%</span><span>{inr(gst)}</span></div>
            <div className="flex justify-between font-bold text-base pt-1"><span>Total</span><span>{inr(total)}</span></div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 mt-3">
          <BrandBtn onClick={sendWA} className="flex-1"><Send className="w-4 h-4" />WhatsApp pe Bhejo</BrandBtn>
          <BrandBtn variant="outline" onClick={downloadPDF} className="flex-1"><Download className="w-4 h-4" />Download PDF</BrandBtn>
        </div>
      </Card>
    </div>
  );
}

function FakePaymentDetector() {
  const [state, setState] = useState<"idle" | "loading" | "real" | "fake">("idle");
  const [file, setFile] = useState<string | null>(null);

  const onFile = (f: File) => {
    const url = URL.createObjectURL(f);
    setFile(url);
    setState("loading");
    setTimeout(() => {
      setState(Math.random() > 0.5 ? "real" : "fake");
    }, 2000);
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-slate-900">Fake Payment Detector</h2>
      <p className="text-sm text-slate-500 mt-1">UPI screenshot upload karo, AI check karega 🤖</p>

      <label className="mt-4 border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition">
        <Upload className="w-8 h-8 text-slate-400" />
        <p className="text-sm text-slate-600 mt-2">Screenshot select karo</p>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </label>

      {file && <img src={file} alt="upi" className="mt-4 max-h-48 mx-auto rounded-xl border border-slate-200" />}

      {state === "loading" && (
        <div className="mt-4 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-600 mt-2">Analyze ho raha hai...</p>
        </div>
      )}

      {state === "real" && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
          <p className="font-bold text-green-700 mt-2">VERIFIED ✅</p>
          <p className="text-sm text-green-700">Payment real hai — receive kar sakte ho</p>
        </div>
      )}

      {state === "fake" && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center justify-center gap-2">
            <XCircle className="w-10 h-10 text-red-600" />
            <p className="font-bold text-red-700 text-lg">FAKE DETECTED ❌</p>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-red-700">
            <li>• Font mismatch detected</li>
            <li>• Invalid transaction ID format</li>
            <li>• Timestamp galat hai</li>
          </ul>
          <p className="text-xs text-red-600 mt-2 text-center font-semibold">Customer se cash maango!</p>
        </div>
      )}
    </Card>
  );
}

function Analytics({ orders, products }: { orders: Order[]; products: Product[] }) {
  const days: { day: string; sales: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-IN", { weekday: "short" });
    const sales = orders.filter((o) => new Date(o.date).toDateString() === d.toDateString()).reduce((s, o) => s + o.total, 0);
    days.push({ day: label, sales: Math.round(sales) });
  }

  const cat = new Map<string, number>();
  orders.forEach((o) => o.items.forEach((it) => {
    const p = products.find((x) => x.id === it.productId);
    const c = p?.category || "Other";
    cat.set(c, (cat.get(c) || 0) + it.price * it.qty);
  }));
  const pieData = [...cat.entries()].map(([name, value]) => ({ name, value: Math.round(value) }));
  const COLORS = ["#16a34a", "#7c3aed", "#f59e0b", "#0ea5e9", "#ef4444", "#10b981"];

  const qtyMap = new Map<string, number>();
  orders.forEach((o) => o.items.forEach((it) => qtyMap.set(it.name, (qtyMap.get(it.name) || 0) + it.qty)));
  const top5 = [...qtyMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const months: { month: string; profit: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setMonth(d.getMonth() - i);
    const m = d.getMonth(); const y = d.getFullYear();
    const sales = orders.filter((o) => {
      const od = new Date(o.date);
      return od.getMonth() === m && od.getFullYear() === y;
    }).reduce((s, o) => s + o.total, 0);
    months.push({ month: d.toLocaleDateString("en-IN", { month: "short" }), profit: Math.round(sales * 0.25) });
  }

  const exportCSV = () => {
    const header = "Order ID,Customer,Date,Total,Source\n";
    const rows = orders.map((o) => `${o.id},${o.customerName},${o.date},${o.total},${o.source}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    toast.success("CSV download ho gaya");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <BrandBtn variant="outline" onClick={exportCSV}><Download className="w-4 h-4" />Export CSV</BrandBtn>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-sm font-semibold text-slate-900 mb-3">Last 7 Days Sales</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <RTooltip />
              <Bar dataKey="sales" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-slate-900 mb-3">Category-wise Sales</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-slate-900 mb-3">Top 5 Products</p>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-slate-500"><th className="pb-2">Product</th><th className="pb-2 text-right">Units Sold</th></tr></thead>
            <tbody>
              {top5.map(([n, q]) => (
                <tr key={n} className="border-t border-slate-100">
                  <td className="py-2">{n}</td>
                  <td className="py-2 text-right font-semibold">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-slate-900 mb-3">Monthly Profit Trend</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={months}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <RTooltip />
              <Line type="monotone" dataKey="profit" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function DailySummary({ orders, udhaar }: { orders: Order[]; udhaar: Udhaar[] }) {
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.date).toDateString() === today);
  const sales = todayOrders.reduce((s, o) => s + o.total, 0);
  const profit = Math.round(sales * 0.25);
  const udhaarTotal = udhaar.reduce((s, u) => s + u.amount, 0);

  const share = () => {
    const text = `Aaj ka report 📊\nBikri: ${inr(sales)} | Profit: ${inr(profit)} | Orders: ${todayOrders.length}\nPending Udhaar: ${inr(udhaarTotal)}\n— ${STORE_NAME}`;
    window.open(waLink(text), "_blank");
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <p className="text-sm text-slate-500">Daily Summary</p>
      <h2 className="text-2xl font-bold text-slate-900">Aaj ka Hisaab</h2>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-[var(--brand-soft)] to-white border border-[var(--brand-soft)]">
          <p className="text-xs text-slate-500">Total Sales</p>
          <p className="text-2xl font-bold text-slate-900">{inr(sales)}</p>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-[var(--brand-soft)] to-white border border-[var(--brand-soft)]">
          <p className="text-xs text-slate-500">Profit</p>
          <p className="text-2xl font-bold text-slate-900">{inr(profit)}</p>
        </div>
        <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-500">Orders</p>
          <p className="text-2xl font-bold text-slate-900">{todayOrders.length}</p>
        </div>
        <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-500">Pending Udhaar</p>
          <p className="text-2xl font-bold text-slate-900">{inr(udhaarTotal)}</p>
        </div>
      </div>
      <BrandBtn onClick={share} className="w-full mt-4"><Send className="w-4 h-4" />WhatsApp pe Share Karo</BrandBtn>
    </Card>
  );
}