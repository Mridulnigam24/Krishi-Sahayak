import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { SERVICES, SATELLITE } from "@/lib/krishi/extra";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Nearby Services & Satellite Farm Health" },
      { name: "description", content: "Find nearby seed shops, mandis, soil labs, vets and banks, and view satellite crop health for your field." },
      { property: "og:title", content: "Nearby Services & Satellite Monitoring" },
      { property: "og:description", content: "Agri services around you plus NDVI, water stress and drought risk." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { L } = useLang();
  return (
    <Layout>
      <div className="ks-rise">
        <h1 className="text-2xl font-bold md:text-3xl">{L("Nearby & Satellite", "आस-पास व सैटेलाइट")}</h1>
        <Tabs defaultValue="near" className="mt-5">
          <TabsList className="rounded-full">
            <TabsTrigger value="near" className="rounded-full">{L("Nearby services", "आस-पास सेवाएं")}</TabsTrigger>
            <TabsTrigger value="sat" className="rounded-full">{L("Satellite", "सैटेलाइट")}</TabsTrigger>
          </TabsList>

          <TabsContent value="near" className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
            <Card className="ks-card">
              <CardContent className="relative h-72 overflow-hidden rounded-2xl bg-secondary p-0">
                <div className="ks-mesh absolute inset-0" />
                {SERVICES.map((s) => (
                  <span key={s.name} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground shadow" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
                    {s.type}
                  </span>
                ))}
              </CardContent>
            </Card>
            <div className="space-y-2">
              {SERVICES.map((s) => (
                <div key={s.name} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.type} · {s.open} · {s.phone}</p>
                  </div>
                  <Badge variant="secondary">{s.distance} km</Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sat" className="mt-4 grid gap-4 md:grid-cols-2">
            <Card className="ks-card">
              <CardContent className="p-5">
                <p className="font-semibold">{L("Crop health heatmap (NDVI)", "फसल सेहत हीटमैप (NDVI)")}</p>
                <div className="mt-3 grid grid-cols-6 gap-1">
                  {SATELLITE.grid.flat().map((v, i) => (
                    <div key={i} className="aspect-square rounded" style={{ background: `color-mix(in oklab, var(--color-chart-1) ${Math.round(v * 100)}%, var(--color-muted))` }} />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="ks-card">
              <CardContent className="space-y-3 p-5">
                {[
                  [L("NDVI index", "एनडीवीआई"), SATELLITE.ndvi],
                  [L("Water stress", "जल तनाव %"), SATELLITE.water],
                  [L("Flood risk", "बाढ़ जोखिम %"), SATELLITE.flood],
                  [L("Drought risk", "सूखा जोखिम %"), SATELLITE.drought],
                  [L("Vegetation cover", "हरियाली %"), SATELLITE.vegetation],
                ].map(([k, v]) => (
                  <div key={String(k)} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-semibold text-primary">{v}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}