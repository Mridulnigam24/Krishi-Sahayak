import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sprout, Droplets, CalendarDays, TrendingUp, Save } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { STATES } from "@/lib/krishi/data";
import { recommend, fertiliserPlan, type RecoInput, type Reco } from "@/lib/krishi/recommend";
import { ks, uid } from "@/lib/krishi/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/crops")({
  head: () => ({
    meta: [
      { title: "Crop Recommendation — Krishi Sahayk" },
      { name: "description", content: "Enter your soil type, season, rainfall and NPK values to get the best crop choices with sowing window, yield estimate and fertiliser plan." },
      { property: "og:title", content: "Crop Recommendation — Krishi Sahayk" },
      { property: "og:description", content: "Personalised crop suggestions for Indian farms." },
    ],
  }),
  component: CropsPage,
});

const SOILS = [
  { v: "loamy", en: "Loamy", hi: "दोमट" },
  { v: "clay", en: "Clay", hi: "चिकनी" },
  { v: "sandy", en: "Sandy", hi: "बलुई" },
  { v: "black", en: "Black", hi: "काली" },
  { v: "red", en: "Red", hi: "लाल" },
];
const SEASONS = [
  { v: "Kharif", hi: "खरीफ" },
  { v: "Rabi", hi: "रबी" },
  { v: "Zaid", hi: "जायद" },
];
const RAINS = [
  { v: "low", en: "Low", hi: "कम" },
  { v: "medium", en: "Medium", hi: "मध्यम" },
  { v: "high", en: "High", hi: "ज्यादा" },
] as const;

function CropsPage() {
  const { t, lang } = useLang();
  const [form, setForm] = useState<RecoInput>({ soil: "loamy", season: "Rabi", rainfall: "medium", ph: 6.8, n: 80, p: 45, k: 40, state: "Punjab" });
  const [result, setResult] = useState<Reco[] | null>(null);

  const run = () => {
    const r = recommend(form);
    setResult(r);
    toast.success(lang === "hi" ? "सुझाव तैयार हैं" : "Recommendations ready");
  };

  const save = () => {
    if (!result) return;
    const list = ks.getRecos();
    list.unshift({
      id: uid(),
      date: new Date().toISOString(),
      input: { soil: form.soil, season: form.season, rainfall: form.rainfall, state: form.state },
      crops: result.map((r) => ({ name: r.crop.name, score: r.score, emoji: r.crop.emoji })),
    });
    ks.setRecos(list.slice(0, 20));
    toast.success(lang === "hi" ? "प्रोफाइल में सेव हुआ" : "Saved to your profile");
  };

  return (
    <Layout>
      <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
        <Sprout className="h-7 w-7 text-primary" /> {t("cropReco")}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {lang === "hi" ? "अपने खेत की जानकारी भरें और सबसे अच्छी फसलें देखें।" : "Fill in your field details to see the best crops for this season."}
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card className="h-fit border-border">
          <CardHeader>
            <CardTitle className="text-base">{lang === "hi" ? "खेत की जानकारी" : "Field details"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">{lang === "hi" ? "मिट्टी" : "Soil type"}</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {SOILS.map((s) => (
                  <button
                    key={s.v}
                    onClick={() => setForm({ ...form, soil: s.v })}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${form.soil === s.v ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                  >
                    {lang === "hi" ? s.hi : s.en}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs">{lang === "hi" ? "मौसम" : "Season"}</Label>
              <div className="mt-2 flex gap-2">
                {SEASONS.map((s) => (
                  <button
                    key={s.v}
                    onClick={() => setForm({ ...form, season: s.v })}
                    className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${form.season === s.v ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                  >
                    {lang === "hi" ? s.hi : s.v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs">{lang === "hi" ? "बारिश" : "Rainfall"}</Label>
              <div className="mt-2 flex gap-2">
                {RAINS.map((r) => (
                  <button
                    key={r.v}
                    onClick={() => setForm({ ...form, rainfall: r.v })}
                    className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${form.rainfall === r.v ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                  >
                    {lang === "hi" ? r.hi : r.en}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs" htmlFor="state">{lang === "hi" ? "राज्य" : "State"}</Label>
              <select
                id="state"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs" htmlFor="ph">{lang === "hi" ? "मिट्टी pH" : "Soil pH"}</Label>
                <Input id="ph" type="number" step="0.1" value={form.ph} onChange={(e) => setForm({ ...form, ph: Number(e.target.value) })} />
              </div>
              <div>
                <Label className="text-xs" htmlFor="n">Nitrogen (kg/acre)</Label>
                <Input id="n" type="number" value={form.n} onChange={(e) => setForm({ ...form, n: Number(e.target.value) })} />
              </div>
              <div>
                <Label className="text-xs" htmlFor="p">Phosphorus</Label>
                <Input id="p" type="number" value={form.p} onChange={(e) => setForm({ ...form, p: Number(e.target.value) })} />
              </div>
              <div>
                <Label className="text-xs" htmlFor="k">Potassium</Label>
                <Input id="k" type="number" value={form.k} onChange={(e) => setForm({ ...form, k: Number(e.target.value) })} />
              </div>
            </div>

            <Button className="w-full rounded-xl" onClick={run}>{lang === "hi" ? "फसल सुझाव पाएं" : "Get recommendations"}</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {!result && (
            <Card className="border-dashed border-border">
              <CardContent className="p-10 text-center text-sm text-muted-foreground">
                {lang === "hi" ? "जानकारी भरकर सुझाव देखें।" : "Fill the form to see your crop matches."}
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">{lang === "hi" ? "सबसे अच्छी फसलें" : "Best matches"}</h2>
                <Button variant="outline" size="sm" className="rounded-full" onClick={save}>
                  <Save className="mr-1 h-4 w-4" /> {t("save")}
                </Button>
              </div>

              {result.map((r, i) => (
                <Card key={r.crop.name} className="border-border">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{r.crop.emoji}</span>
                        <div>
                          <p className="text-lg font-bold">{lang === "hi" ? r.crop.hi : r.crop.name}</p>
                          <p className="text-xs text-muted-foreground">{lang === "hi" ? r.crop.name : r.crop.hi}</p>
                        </div>
                      </div>
                      {i === 0 && <Badge className="bg-accent text-accent-foreground">{lang === "hi" ? "टॉप सुझाव" : "Top pick"}</Badge>}
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{lang === "hi" ? "मिलान" : "Match"}</span>
                        <span className="font-semibold text-primary">{r.score}%</span>
                      </div>
                      <Progress value={r.score} className="mt-1 h-2" />
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-secondary p-3">
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><CalendarDays className="h-3 w-3" /> {lang === "hi" ? "बुवाई समय" : "Sowing window"}</p>
                        <p className="text-sm font-semibold">{r.crop.window}</p>
                      </div>
                      <div className="rounded-xl bg-secondary p-3">
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><TrendingUp className="h-3 w-3" /> {lang === "hi" ? "अनुमानित उपज" : "Expected yield"}</p>
                        <p className="text-sm font-semibold">{r.crop.yieldEst}</p>
                      </div>
                      <div className="rounded-xl bg-secondary p-3">
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><Droplets className="h-3 w-3" /> {lang === "hi" ? "पानी" : "Water need"}</p>
                        <p className="text-sm font-semibold">{r.crop.water}</p>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                      {r.reasons.map((why) => (
                        <li key={why}>• {why}</li>
                      ))}
                      <li>• {r.crop.why}</li>
                    </ul>

                    {i === 0 && (
                      <div className="mt-4 rounded-xl border border-border p-3">
                        <p className="text-sm font-semibold">{lang === "hi" ? "खाद योजना" : "Fertiliser plan"}</p>
                        <div className="mt-2 space-y-1 text-sm">
                          {fertiliserPlan(r.crop, form).map((f) => (
                            <div key={f.nutrient} className="flex justify-between gap-2">
                              <span className="text-muted-foreground">{f.nutrient} · {f.source}</span>
                              <span className="font-medium">{f.dose}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}