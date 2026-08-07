import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { ALERTS } from "@/lib/krishi/extra";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Predictive Farm Alerts — Krishi Sahayak" },
      { name: "description", content: "Early warnings for rain, heat, frost, pest outbreaks, locusts and falling mandi prices." },
      { property: "og:title", content: "Predictive Farm Alerts" },
      { property: "og:description", content: "Know about weather, pest and price risks before they hit your field." },
    ],
  }),
  component: AlertsPage,
});

function AlertsPage() {
  const { L } = useLang();
  return (
    <Layout>
      <div className="ks-rise">
        <h1 className="text-2xl font-bold md:text-3xl">{L("Predictive Alerts", "पूर्वानुमान चेतावनी")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{L("Risks we expect near your farm in the coming days.", "आने वाले दिनों में आपके खेत के पास संभावित खतरे।")}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {ALERTS.map((a) => (
            <Card key={a.id} className="ks-card">
              <CardContent className="flex gap-3 p-5">
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{L(a.en, a.hi)}</p>
                    <Badge variant={a.severity === "high" ? "destructive" : "secondary"}>{a.severity}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{L(a.whenEn, a.whenHi)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}