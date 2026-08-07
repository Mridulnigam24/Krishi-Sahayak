import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FlaskConical, Loader2, Upload, Leaf } from "lucide-react";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { askKrishiAI } from "@/lib/krishi/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/soil")({
  head: () => ({
    meta: [
      { title: "Soil Health & Fertiliser Advice — Krishi Sahayak" },
      { name: "description", content: "Enter NPK values or upload a soil report to get soil health, fertiliser quantity, cost and crop rotation advice." },
      { property: "og:title", content: "Soil Health & Fertiliser Advice" },
      { property: "og:description", content: "AI soil analysis and fertiliser dose planning for Indian farms." },
    ],
  }),
  component: SoilPage,
});

function score(n: number, p: number, k: number, ph: number, oc: number) {
  const norm = (v: number, lo: number, hi: number) => Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100));
  const phScore = 100 - Math.min(100, Math.abs(ph - 6.8) * 30);
  return Math.round((norm(n, 100, 400) + norm(p, 5, 40) + norm(k, 80, 320) + phScore + norm(oc, 0.2, 0.9)) / 5);
}

function SoilPage() {
  const { lang, L } = useLang();
  const [n, setN] = useState("220");
  const [p, setP] = useState("18");
  const [k, setK] = useState("180");
  const [ph, setPh] = useState("7.2");
  const [oc, setOc] = useState("0.45");
  const [crop, setCrop] = useState("Wheat");
  const [acres, setAcres] = useState("2");
  const [symptoms, setSymptoms] = useState("");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [reportName, setReportName] = useState("");

  const health = score(+n || 0, +p || 0, +k || 0, +ph || 7, +oc || 0);
  const band = health >= 70 ? L("Good", "अच्छी") : health >= 45 ? L("Moderate", "मध्यम") : L("Poor", "कमज़ोर");

  async function run(kind: "soil" | "fert") {
    setBusy(true);
    setOut("");
    const prompt =
      kind === "soil"
        ? `Soil test: N ${n} kg/ha, P ${p} kg/ha, K ${k} kg/ha, pH ${ph}, organic carbon ${oc}%. Land ${acres} acre. ${reportName ? `Soil report file: ${reportName}.` : ""} Give soil health verdict, suitable crops, fertiliser plan with bag quantities and cost, water requirement and a 2-year crop rotation plan.`
        : `Crop: ${crop}, area ${acres} acre. Soil N ${n}, P ${p}, K ${k}, pH ${ph}. Symptoms seen: ${symptoms || "none reported"}. Recommend exact urea, DAP, MOP and micronutrient quantities, organic alternatives, total estimated cost in rupees, and the best application timing/split doses.`;
    const res = await askKrishiAI({ data: { messages: [{ role: "user", content: prompt }], lang, agent: "soil" } });
    setBusy(false);
    if (res.ok) setOut(res.reply);
    else toast.error(res.error);
  }

  const fields: [string, string, string, (v: string) => void][] = [
    ["N (kg/ha)", n, "n", setN],
    ["P (kg/ha)", p, "p", setP],
    ["K (kg/ha)", k, "k", setK],
    ["pH", ph, "ph", setPh],
    ["OC (%)", oc, "oc", setOc],
  ];

  return (
    <Layout>
      <div className="ks-rise">
        <h1 className="text-2xl font-bold md:text-3xl">{L("Soil Health & Fertiliser", "मिट्टी सेहत व खाद")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{L("Enter your soil card values or upload the report.", "अपने मृदा कार्ड के मान भरें या रिपोर्ट अपलोड करें।")}</p>

        <Tabs defaultValue="soil" className="mt-5">
          <TabsList className="rounded-full">
            <TabsTrigger value="soil" className="rounded-full"><FlaskConical className="mr-1 h-4 w-4" />{L("Soil Health", "मिट्टी सेहत")}</TabsTrigger>
            <TabsTrigger value="fert" className="rounded-full"><Leaf className="mr-1 h-4 w-4" />{L("Fertiliser", "खाद")}</TabsTrigger>
          </TabsList>

          <TabsContent value="soil" className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <Card className="ks-card">
              <CardContent className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {fields.map(([label, val, id, setter]) => (
                    <div key={id}>
                      <Label htmlFor={id} className="text-xs">{label}</Label>
                      <Input id={id} value={val} onChange={(e) => setter(e.target.value)} inputMode="decimal" className="mt-1 rounded-xl" />
                    </div>
                  ))}
                  <div>
                    <Label htmlFor="ac" className="text-xs">{L("Acres", "एकड़")}</Label>
                    <Input id="ac" value={acres} onChange={(e) => setAcres(e.target.value)} inputMode="decimal" className="mt-1 rounded-xl" />
                  </div>
                </div>

                <div className="rounded-2xl bg-secondary/50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{L("Soil health score", "मिट्टी स्कोर")}</span>
                    <span className="font-bold text-primary">{health}/100 · {band}</span>
                  </div>
                  <Progress value={health} className="mt-2" />
                </div>

                <div>
                  <Button variant="secondary" className="w-full rounded-xl" onClick={() => fileRef.current?.click()}>
                    <Upload className="mr-1 h-4 w-4" /> {reportName || L("Upload soil report (PDF/photo)", "मृदा रिपोर्ट अपलोड करें")}
                  </Button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/pdf,image/*"
                    hidden
                    onChange={(e) => setReportName(e.target.files?.[0]?.name ?? "")}
                  />
                </div>

                <Button className="w-full rounded-xl" disabled={busy} onClick={() => void run("soil")}>
                  {busy ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
                  {L("Analyse soil", "मिट्टी जांचें")}
                </Button>
              </CardContent>
            </Card>

            <ResultCard busy={busy} out={out} empty={L("Your soil report will appear here.", "आपकी मिट्टी रिपोर्ट यहां दिखेगी।")} />
          </TabsContent>

          <TabsContent value="fert" className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <Card className="ks-card">
              <CardContent className="space-y-4 p-5">
                <div>
                  <Label htmlFor="crop" className="text-xs">{L("Crop", "फसल")}</Label>
                  <Input id="crop" value={crop} onChange={(e) => setCrop(e.target.value)} className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="sym" className="text-xs">{L("Symptoms you see", "जो लक्षण दिख रहे हैं")}</Label>
                  <Textarea
                    id="sym"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={4}
                    placeholder={L("e.g. lower leaves yellow, stunted growth", "जैसे नीचे की पत्तियां पीली, बढ़त कम")}
                    className="mt-1 rounded-xl"
                  />
                </div>
                <Button className="w-full rounded-xl" disabled={busy} onClick={() => void run("fert")}>
                  {busy ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
                  {L("Recommend fertiliser", "खाद सुझाएं")}
                </Button>
              </CardContent>
            </Card>
            <ResultCard busy={busy} out={out} empty={L("Your fertiliser plan will appear here.", "आपकी खाद योजना यहां दिखेगी।")} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export function ResultCard({ busy, out, empty }: { busy: boolean; out: string; empty: string }) {
  return (
    <Card className="ks-card">
      <CardContent className="p-5">
        {busy && (
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="ks-skeleton h-4 rounded" style={{ width: `${90 - i * 9}%` }} />
            ))}
          </div>
        )}
        {!busy && !out && <p className="text-sm text-muted-foreground">{empty}</p>}
        {!busy && out && (
          <div className="ks-md text-sm leading-relaxed">
            <ReactMarkdown>{out}</ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}