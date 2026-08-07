import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { ANIMAL_DISEASES } from "@/lib/krishi/extra";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/livestock")({
  head: () => ({
    meta: [
      { title: "Livestock Health Guide — Krishi Sahayak" },
      { name: "description", content: "Common cattle, buffalo, goat and poultry diseases with signs, treatment and vaccination advice." },
      { property: "og:title", content: "Livestock Health Guide" },
      { property: "og:description", content: "Animal disease signs and treatment for Indian smallholders." },
    ],
  }),
  component: LivestockPage,
});

function LivestockPage() {
  const { L } = useLang();
  return (
    <Layout>
      <div className="ks-rise">
        <h1 className="text-2xl font-bold md:text-3xl">{L("Livestock Health", "पशु स्वास्थ्य")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{L("Ask the Livestock Expert in the AI Assistant with a photo for a diagnosis.", "फोटो के साथ AI सहायक में पशु विशेषज्ञ से जांच कराएं।")}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {ANIMAL_DISEASES.map((d) => (
            <Card key={d.id} className="ks-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{L(d.en, d.hi)}</p>
                  <Badge variant="secondary">{d.animal}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground"><strong>{L("Signs", "लक्षण")}:</strong> {d.signs}</p>
                <p className="mt-1 text-sm text-muted-foreground"><strong>{L("Treatment", "इलाज")}:</strong> {d.treat}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}