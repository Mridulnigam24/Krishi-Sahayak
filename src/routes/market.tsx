import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { IndianRupee, Search, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { mandiRows, priceTrend } from "@/lib/krishi/data";
import { inr } from "@/lib/krishi/store";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Mandi Prices & Trends — Krishi Sahayk" },
      { name: "description", content: "Check today's mandi rates for wheat, paddy, onion, cotton and more, with a 14-day price trend to plan when to sell." },
      { property: "og:title", content: "Mandi Prices & Trends — Krishi Sahayk" },
      { property: "og:description", content: "Live-style mandi rates and price trends for Indian crops." },
    ],
  }),
  component: MarketPage,
});

function MarketPage() {
  const { t, lang } = useLang();
  const rows = useMemo(() => mandiRows(), []);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(rows[0]);

  const filtered = rows.filter((r) => (r.crop + r.mandi + r.state).toLowerCase().includes(q.toLowerCase()));
  const trend = priceTrend(selected.modal);
  const change = trend[trend.length - 1].price - trend[0].price;
  const pct = ((change / trend[0].price) * 100).toFixed(1);

  return (
    <Layout>
      <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
        <IndianRupee className="h-7 w-7 text-primary" /> {t("market")}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {lang === "hi" ? "आज के मंडी भाव (₹ प्रति क्विंटल) और 14 दिन का रुझान।" : "Today's mandi rates (₹ per quintal) with a 14-day trend."}
      </p>

      <Card className="mt-5 border-border">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-lg font-bold">{selected.crop}</p>
              <p className="text-xs text-muted-foreground">{selected.mandi}, {selected.state} · {selected.date}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{inr(selected.modal)}</p>
              <p className={`flex items-center justify-end gap-1 text-xs font-semibold ${change >= 0 ? "text-primary" : "text-destructive"}`}>
                {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {pct}% ({lang === "hi" ? "14 दिन" : "14 days"})
              </p>
            </div>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ left: -10, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} interval={2} />
                <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Line type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
            {change >= 0
              ? lang === "hi" ? "भाव ऊपर जा रहे हैं — थोड़ा रुककर बेचने पर बेहतर दाम मिल सकता है।" : "Prices are rising — holding a little longer may fetch a better rate."
              : lang === "hi" ? "भाव गिर रहे हैं — जल्दी बेचना बेहतर रहेगा।" : "Prices are falling — selling sooner may be safer."}
          </p>
        </CardContent>
      </Card>

      <div className="relative mt-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === "hi" ? "फसल या मंडी खोजें..." : "Search crop or mandi..."} className="pl-9" />
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              <th className="p-3 text-left font-semibold">{lang === "hi" ? "फसल" : "Crop"}</th>
              <th className="p-3 text-left font-semibold">{lang === "hi" ? "मंडी" : "Mandi"}</th>
              <th className="p-3 text-right font-semibold">{lang === "hi" ? "न्यूनतम" : "Min"}</th>
              <th className="p-3 text-right font-semibold">{lang === "hi" ? "अधिकतम" : "Max"}</th>
              <th className="p-3 text-right font-semibold">{lang === "hi" ? "औसत" : "Modal"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.crop + r.mandi}
                onClick={() => setSelected(r)}
                className={`cursor-pointer border-t border-border transition hover:bg-secondary/50 ${selected.crop === r.crop && selected.mandi === r.mandi ? "bg-secondary/60" : ""}`}
              >
                <td className="p-3 font-medium">{r.crop}<span className="block text-[11px] text-muted-foreground">{r.category}</span></td>
                <td className="p-3 text-muted-foreground">{r.mandi}, {r.state}</td>
                <td className="p-3 text-right">{inr(r.min)}</td>
                <td className="p-3 text-right">{inr(r.max)}</td>
                <td className="p-3 text-right font-semibold text-primary">{inr(r.modal)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">{lang === "hi" ? "कोई नतीजा नहीं" : "No results"}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}