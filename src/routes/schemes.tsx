import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Landmark, ExternalLink, Search } from "lucide-react";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { SCHEMES } from "@/lib/krishi/data";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/schemes")({
  head: () => ({
    meta: [
      { title: "Government Schemes for Farmers — Krishi Sahayk" },
      { name: "description", content: "PM-KISAN, Fasal Bima, Kisan Credit Card, irrigation subsidy and more — benefits, eligibility and official apply links in one place." },
      { property: "og:title", content: "Government Schemes for Farmers — Krishi Sahayk" },
      { property: "og:description", content: "Find and apply for Indian farm subsidies, insurance and loans." },
    ],
  }),
  component: SchemesPage,
});

const CATS = [
  { v: "all", en: "All", hi: "सभी" },
  { v: "subsidy", en: "Subsidy", hi: "सब्सिडी" },
  { v: "insurance", en: "Insurance", hi: "बीमा" },
  { v: "loan", en: "Loan", hi: "लोन" },
  { v: "training", en: "Training", hi: "प्रशिक्षण" },
];

function SchemesPage() {
  const { t, lang } = useLang();
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const list = SCHEMES.filter(
    (s) => (cat === "all" || s.category === cat) && (s.name + s.hi + s.benefit).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Layout>
      <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
        <Landmark className="h-7 w-7 text-primary" /> {t("schemes")}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {lang === "hi" ? "फायदा, पात्रता और आवेदन लिंक — सब एक जगह।" : "Benefits, eligibility and official apply links in one place."}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {CATS.map((c) => (
          <button
            key={c.v}
            onClick={() => setCat(c.v)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${cat === c.v ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            {lang === "hi" ? c.hi : c.en}
          </button>
        ))}
      </div>

      <div className="relative mt-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === "hi" ? "योजना खोजें..." : "Search schemes..."} className="pl-9" />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {list.map((s) => (
          <Card key={s.id} className="border-border">
            <CardContent className="flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{lang === "hi" ? s.hi : s.name}</p>
                  <p className="text-xs text-muted-foreground">{lang === "hi" ? s.name : s.hi}</p>
                </div>
                <Badge variant="secondary" className="capitalize">{s.category}</Badge>
              </div>
              <p className="mt-3 text-sm text-foreground">{s.benefit}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{lang === "hi" ? "पात्रता: " : "Eligibility: "}</span>
                {s.eligibility}
              </p>
              <Button asChild variant="outline" className="mt-4 w-fit rounded-full">
                <a href={s.url} target="_blank" rel="noreferrer noopener">
                  {lang === "hi" ? "आवेदन करें" : "Apply now"} <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
        {list.length === 0 && <p className="p-6 text-sm text-muted-foreground">{lang === "hi" ? "कोई योजना नहीं मिली" : "No schemes found"}</p>}
      </div>
    </Layout>
  );
}