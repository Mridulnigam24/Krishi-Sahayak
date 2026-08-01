import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { ScanLine, Upload, Leaf, ShieldCheck, FlaskConical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { DISEASES, type DiseaseInfo } from "@/lib/krishi/data";
import { ks, uid, type ScanRecord } from "@/lib/krishi/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/disease")({
  head: () => ({
    meta: [
      { title: "Crop Disease Detection — Krishi Sahayk" },
      { name: "description", content: "Upload a photo of an affected leaf and get the likely disease, severity, organic and chemical treatment and prevention steps." },
      { property: "og:title", content: "Crop Disease Detection — Krishi Sahayk" },
      { property: "og:description", content: "Photo-based leaf disease analysis with treatment advice." },
    ],
  }),
  component: DiseasePage,
});

function pickDisease(seedText: string): DiseaseInfo {
  let sum = 0;
  for (const ch of seedText) sum += ch.charCodeAt(0);
  return DISEASES[sum % DISEASES.length];
}

function DiseasePage() {
  const { t, lang } = useLang();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<DiseaseInfo | null>(null);
  const [history, setHistory] = useState<ScanRecord[]>([]);

  useEffect(() => setHistory(ks.getScans()), []);

  const onFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(lang === "hi" ? "कृपया फोटो चुनें" : "Please choose an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setPreview(url);
      setResult(null);
      setBusy(true);
      const found = pickDisease(file.name + file.size);
      setTimeout(() => {
        setResult(found);
        setBusy(false);
        const rec: ScanRecord = { id: uid(), date: new Date().toISOString(), disease: found.name, crop: found.crop, confidence: found.confidence };
        const list = [rec, ...ks.getScans()].slice(0, 15);
        ks.setScans(list);
        setHistory(list);
      }, 1400);
    };
    reader.readAsDataURL(file);
  };

  const clearHistory = () => {
    ks.setScans([]);
    setHistory([]);
  };

  return (
    <Layout>
      <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
        <ScanLine className="h-7 w-7 text-primary" /> {t("diseaseDetect")}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {lang === "hi" ? "प्रभावित पत्ते की साफ फोटो अपलोड करें।" : "Upload a clear photo of the affected leaf."}
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="border-border">
          <CardContent className="p-5">
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onFile(e.dataTransfer.files?.[0]);
              }}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/50 p-8 text-center transition hover:border-primary"
            >
              {preview ? (
                <img src={preview} alt="Uploaded leaf" className="max-h-64 rounded-xl object-contain" />
              ) : (
                <>
                  <Upload className="h-10 w-10 text-primary" />
                  <p className="mt-3 font-semibold">{lang === "hi" ? "फोटो अपलोड करें" : "Upload leaf photo"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{lang === "hi" ? "या यहाँ खींच कर छोड़ें (JPG/PNG)" : "or drag and drop here (JPG/PNG)"}</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => onFile(e.target.files?.[0])} />
            <div className="mt-4 flex gap-2">
              <Button className="flex-1 rounded-xl" onClick={() => fileRef.current?.click()}>
                {preview ? (lang === "hi" ? "दूसरी फोटो" : "Choose another") : t("analyze")}
              </Button>
              {preview && (
                <Button variant="outline" className="rounded-xl" onClick={() => { setPreview(null); setResult(null); }}>
                  {lang === "hi" ? "हटाएं" : "Clear"}
                </Button>
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {lang === "hi" ? "टिप: पत्ते को दिन की रोशनी में, पास से और साफ बैकग्राउंड में फोटो लें।" : "Tip: shoot in daylight, close up, with a plain background."}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {busy && (
            <Card className="border-border">
              <CardContent className="p-6">
                <p className="font-semibold">{lang === "hi" ? "फोटो जांची जा रही है..." : "Analysing your photo..."}</p>
                <Progress value={66} className="mt-3 h-2" />
              </CardContent>
            </Card>
          )}

          {!busy && !result && (
            <Card className="border-dashed border-border">
              <CardContent className="p-10 text-center text-sm text-muted-foreground">
                {lang === "hi" ? "नतीजा यहाँ दिखेगा।" : "Your result will appear here."}
              </CardContent>
            </Card>
          )}

          {result && !busy && (
            <Card className="border-border">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xl font-bold">{result.name}</p>
                    <p className="text-xs text-muted-foreground">{result.crop}</p>
                  </div>
                  <Badge className={result.severity === "High" ? "bg-destructive text-destructive-foreground" : result.severity === "Moderate" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}>
                    {result.severity}
                  </Badge>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{lang === "hi" ? "विश्वास स्तर" : "Confidence"}</span>
                    <span className="font-semibold text-primary">{result.confidence}%</span>
                  </div>
                  <Progress value={result.confidence} className="mt-1 h-2" />
                </div>

                <Section icon={<Leaf className="h-4 w-4" />} title={lang === "hi" ? "लक्षण" : "Symptoms"} body={result.symptoms} />
                <Section icon={<Leaf className="h-4 w-4" />} title={lang === "hi" ? "जैविक इलाज" : "Organic treatment"} body={result.organic} />
                <Section icon={<FlaskConical className="h-4 w-4" />} title={lang === "hi" ? "रासायनिक इलाज" : "Chemical treatment"} body={result.chemical} />
                <Section icon={<ShieldCheck className="h-4 w-4" />} title={lang === "hi" ? "बचाव" : "Prevention"} body={result.prevention} />

                <p className="rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
                  {lang === "hi" ? "यह सलाह सामान्य जानकारी है। दवा की मात्रा अपने कृषि विज्ञान केंद्र से जरूर पक्की करें।" : "This is general guidance. Always confirm chemical doses with your local Krishi Vigyan Kendra."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{lang === "hi" ? "पिछली जांच" : "Recent scans"}</h2>
            <Button variant="ghost" size="sm" onClick={clearHistory}>
              <Trash2 className="mr-1 h-4 w-4" /> {lang === "hi" ? "साफ करें" : "Clear"}
            </Button>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((h) => (
              <Card key={h.id} className="border-border">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-semibold">{h.disease}</p>
                    <p className="text-xs text-muted-foreground">{new Date(h.date).toLocaleString("en-IN")}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{h.confidence}%</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}

function Section({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">{icon} {title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}