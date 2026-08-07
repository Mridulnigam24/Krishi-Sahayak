import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Layout from "@/components/krishi/Layout";
import { ResultCard } from "@/routes/soil";
import { useLang } from "@/lib/krishi/i18n";
import { askKrishiAI } from "@/lib/krishi/ai.functions";
import { STATES } from "@/lib/krishi/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Smart Crop Planner & Yield Prediction — Krishi Sahayak" },
      { name: "description", content: "Plan the best crop for your land, budget and water, and predict yield, income and profit before you sow." },
      { property: "og:title", content: "Smart Crop Planner & Yield Prediction" },
      { property: "og:description", content: "AI crop planning with expected yield, income, investment and risk." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const { lang, L } = useLang();
  const [state, setState] = useState(STATES[0]!);
  const [season, setSeason] = useState("Rabi");
  const [budget, setBudget] = useState("40000");
  const [water, setWater] = useState("Canal + tubewell");
  const [land, setLand] = useState("2");
  const [crop, setCrop] = useState("Wheat");
  const [sowDate, setSowDate] = useState(new Date().toISOString().slice(0, 10));
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  async function ask(kind: "plan" | "yield") {
    setBusy(true);
    setOut("");
    const prompt =
      kind === "plan"
        ? `Location ${state}, season ${season}, budget ₹${budget}, water availability ${water}, land ${land} acre. Recommend the 3 best crops. For each give expected yield per acre, expected income, estimated investment, net profit and risk level (low/medium/high) in a compact list.`
        : `Predict outcome for ${crop} on ${land} acre in ${state}, sown around ${sowDate}, water ${water}. Give expected harvest quantity, likely harvest date, expected income, total cost, profit, worst-case loss and the top 3 risks.`;
    const res = await askKrishiAI({ data: { messages: [{ role: "user", content: prompt }], lang, agent: "business" } });
    setBusy(false);
    if (res.ok) setOut(res.reply);
    else toast.error(res.error);
  }

  return (
    <Layout>
      <div className="ks-rise">
        <h1 className="text-2xl font-bold md:text-3xl">{L("Smart Crop Planner", "स्मार्ट फसल योजना")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{L("Plan before you sow — crop, income and risk.", "बोने से पहले योजना — फसल, आय और जोखिम।")}</p>

        <Tabs defaultValue="plan" className="mt-5">
          <TabsList className="rounded-full">
            <TabsTrigger value="plan" className="rounded-full">{L("Crop Planner", "फसल योजना")}</TabsTrigger>
            <TabsTrigger value="yield" className="rounded-full">{L("Yield Prediction", "उपज अनुमान")}</TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <Card className="ks-card">
              <CardContent className="grid gap-3 p-5 sm:grid-cols-2">
                <Field label={L("State", "राज्य")}>
                  <select value={state} onChange={(e) => setState(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label={L("Season", "मौसम")}>
                  <select value={season} onChange={(e) => setSeason(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                    {["Kharif", "Rabi", "Zaid"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label={L("Budget (₹)", "बजट (₹)")}><Input value={budget} onChange={(e) => setBudget(e.target.value)} inputMode="numeric" className="mt-1 rounded-xl" /></Field>
                <Field label={L("Land (acre)", "जमीन (एकड़)")}><Input value={land} onChange={(e) => setLand(e.target.value)} inputMode="decimal" className="mt-1 rounded-xl" /></Field>
                <Field label={L("Water source", "पानी का साधन")}><Input value={water} onChange={(e) => setWater(e.target.value)} className="mt-1 rounded-xl" /></Field>
                <div className="sm:col-span-2">
                  <Button className="w-full rounded-xl" disabled={busy} onClick={() => void ask("plan")}>
                    {busy ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}{L("Build my plan", "मेरी योजना बनाएं")}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <ResultCard busy={busy} out={out} empty={L("Your crop plan will appear here.", "आपकी फसल योजना यहां दिखेगी।")} />
          </TabsContent>

          <TabsContent value="yield" className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <Card className="ks-card">
              <CardContent className="grid gap-3 p-5 sm:grid-cols-2">
                <Field label={L("Crop", "फसल")}><Input value={crop} onChange={(e) => setCrop(e.target.value)} className="mt-1 rounded-xl" /></Field>
                <Field label={L("Sowing date", "बुवाई तिथि")}><Input type="date" value={sowDate} onChange={(e) => setSowDate(e.target.value)} className="mt-1 rounded-xl" /></Field>
                <Field label={L("Land (acre)", "जमीन (एकड़)")}><Input value={land} onChange={(e) => setLand(e.target.value)} inputMode="decimal" className="mt-1 rounded-xl" /></Field>
                <Field label={L("State", "राज्य")}>
                  <select value={state} onChange={(e) => setState(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Button className="w-full rounded-xl" disabled={busy} onClick={() => void ask("yield")}>
                    {busy ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}{L("Predict yield", "उपज अनुमान लगाएं")}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <ResultCard busy={busy} out={out} empty={L("Your yield forecast will appear here.", "आपका उपज अनुमान यहां दिखेगा।")} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}