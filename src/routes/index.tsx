import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { Store, ShoppingBag } from "lucide-react";
import ShopkeeperApp from "@/components/dukaan/ShopkeeperApp";
import CustomerApp from "@/components/dukaan/CustomerApp";
import { seedIfNeeded } from "@/lib/dukaan/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DukaanMitra — AI Assistant for Kirana Stores" },
      { name: "description", content: "Kirana store ka apna AI assistant — udhaar, billing, payment verification aur customer ordering, sab ek jagah." },
      { property: "og:title", content: "DukaanMitra" },
      { property: "og:description", content: "AI-powered assistant for Indian kirana stores." },
    ],
  }),
  component: Index,
});

function Index() {
  const [mode, setMode] = useState<"shop" | "cust">("shop");
  const [ready, setReady] = useState(false);
  useEffect(() => { seedIfNeeded(); setReady(true); }, []);

  return (
    <div className={mode === "shop" ? "mode-shop" : "mode-cust"}>
      <Toaster position="top-center" richColors />
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-3 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[var(--brand)] text-white flex items-center justify-center font-bold">D</div>
            <div>
              <p className="font-bold text-slate-900 leading-tight">DukaanMitra</p>
              <p className="text-[10px] text-slate-500 leading-tight">Kirana ka AI dost</p>
            </div>
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setMode("shop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition ${mode === "shop" ? "bg-white shadow text-green-700" : "text-slate-500"}`}
            >
              <Store className="w-4 h-4" /> Shopkeeper
            </button>
            <button
              onClick={() => setMode("cust")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition ${mode === "cust" ? "bg-white shadow text-violet-700" : "text-slate-500"}`}
            >
              <ShoppingBag className="w-4 h-4" /> Customer
            </button>
          </div>
        </div>
      </header>
      {ready && (mode === "shop" ? <ShopkeeperApp /> : <CustomerApp />)}
    </div>
  );
}
