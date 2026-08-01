import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Save } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { STATES } from "@/lib/krishi/data";
import { ks, type Profile, type SavedReco, type ScanRecord } from "@/lib/krishi/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Farm Profile — Krishi Sahayk" },
      { name: "description", content: "Save your village, land size and main crop so crop advice, weather and mandi tips match your farm. Stored on your device only." },
      { property: "og:title", content: "My Farm Profile — Krishi Sahayk" },
      { property: "og:description", content: "Your saved farm details, crop plans and leaf scans." },
    ],
  }),
  component: ProfilePage,
});

const EMPTY: Profile = { name: "", phone: "", village: "", state: "Punjab", landAcres: "", mainCrop: "" };

function ProfilePage() {
  const { t, lang } = useLang();
  const [p, setP] = useState<Profile>(EMPTY);
  const [recos, setRecos] = useState<SavedReco[]>([]);
  const [scans, setScans] = useState<ScanRecord[]>([]);

  useEffect(() => {
    setP(ks.getProfile() ?? EMPTY);
    setRecos(ks.getRecos());
    setScans(ks.getScans());
  }, []);

  const save = () => {
    ks.setProfile(p);
    toast.success(lang === "hi" ? "प्रोफाइल सेव हुई" : "Profile saved");
  };

  return (
    <Layout>
      <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
        <User className="h-7 w-7 text-primary" /> {t("profile")}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {lang === "hi" ? "आपकी जानकारी सिर्फ आपके फोन में सेव होती है।" : "Your details stay on this device only."}
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-[420px_1fr]">
        <Card className="h-fit border-border">
          <CardHeader><CardTitle className="text-base">{lang === "hi" ? "किसान जानकारी" : "Farmer details"}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs" htmlFor="name">{lang === "hi" ? "नाम" : "Name"}</Label>
              <Input id="name" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs" htmlFor="phone">{lang === "hi" ? "मोबाइल" : "Mobile"}</Label>
              <Input id="phone" inputMode="tel" value={p.phone} onChange={(e) => setP({ ...p, phone: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs" htmlFor="village">{lang === "hi" ? "गाँव / जिला" : "Village / District"}</Label>
              <Input id="village" value={p.village} onChange={(e) => setP({ ...p, village: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs" htmlFor="pstate">{lang === "hi" ? "राज्य" : "State"}</Label>
              <select id="pstate" value={p.state} onChange={(e) => setP({ ...p, state: e.target.value })} className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm">
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs" htmlFor="land">{lang === "hi" ? "जमीन (एकड़)" : "Land (acres)"}</Label>
                <Input id="land" inputMode="decimal" value={p.landAcres} onChange={(e) => setP({ ...p, landAcres: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs" htmlFor="crop">{lang === "hi" ? "मुख्य फसल" : "Main crop"}</Label>
                <Input id="crop" value={p.mainCrop} onChange={(e) => setP({ ...p, mainCrop: e.target.value })} />
              </div>
            </div>
            <Button className="w-full rounded-xl" onClick={save}><Save className="mr-1 h-4 w-4" /> {t("save")}</Button>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <section>
            <h2 className="text-lg font-bold">{lang === "hi" ? "सेव किए गए फसल सुझाव" : "Saved crop plans"}</h2>
            {recos.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">{lang === "hi" ? "अभी कुछ सेव नहीं है।" : "Nothing saved yet."}</p>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {recos.map((r) => (
                  <Card key={r.id} className="border-border">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString("en-IN")} · {r.input.season} · {r.input.soil}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {r.crops.map((c) => (
                          <span key={c.name} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{c.emoji} {c.name} · {c.score}%</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-bold">{lang === "hi" ? "रोग जांच इतिहास" : "Disease scan history"}</h2>
            {scans.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">{lang === "hi" ? "अभी कोई जांच नहीं।" : "No scans yet."}</p>
            ) : (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {scans.map((s) => (
                  <Card key={s.id} className="border-border">
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-semibold">{s.disease}</p>
                        <p className="text-xs text-muted-foreground">{s.crop} · {new Date(s.date).toLocaleDateString("en-IN")}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{s.confidence}%</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}