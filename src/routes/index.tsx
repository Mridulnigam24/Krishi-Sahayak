import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout, ScanLine, MessageCircle, CloudSun, IndianRupee, Landmark, ArrowRight, Users, Droplets, Wind } from "lucide-react";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { forecast, mandiRows } from "@/lib/krishi/data";
import { inr } from "@/lib/krishi/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import hero from "@/assets/krishi-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Krishi Sahayk — AI Farming Assistant for Indian Farmers" },
      { name: "description", content: "Get AI crop recommendations, leaf disease detection, 7-day weather, live mandi prices and government scheme guidance in Hindi or English." },
      { property: "og:title", content: "Krishi Sahayk — AI Farming Assistant" },
      { property: "og:description", content: "Crop advice, disease detection, weather, mandi prices and schemes for Indian farmers." },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { to: "/crops", key: "cropReco", icon: Sprout, en: "Best crop for your soil, season and rainfall.", hi: "आपकी मिट्टी, मौसम और बारिश के लिए सही फसल।" },
  { to: "/disease", key: "diseaseDetect", icon: ScanLine, en: "Upload a leaf photo and get a treatment plan.", hi: "पत्ते की फोटो डालें और इलाज पाएं।" },
  { to: "/chat", key: "chatbot", icon: MessageCircle, en: "Ask any farming question, any time.", hi: "खेती का कोई भी सवाल, कभी भी पूछें।" },
  { to: "/weather", key: "weather", icon: CloudSun, en: "7-day forecast with spray and irrigation advice.", hi: "7 दिन का मौसम, छिड़काव और सिंचाई सलाह।" },
  { to: "/market", key: "market", icon: IndianRupee, en: "Live mandi rates and 14-day price trends.", hi: "मंडी भाव और 14 दिन का रुझान।" },
  { to: "/schemes", key: "schemes", icon: Landmark, en: "Subsidies, insurance and loans you can claim.", hi: "सब्सिडी, बीमा और लोन जो आप ले सकते हैं।" },
] as const;

function Index() {
  const { t, lang } = useLang();
  const today = forecast()[0];
  const top = mandiRows().slice(0, 4);

  return (
    <Layout>
      <section className="relative overflow-hidden rounded-3xl">
        <img src={hero} alt="Indian farmland at golden hour" width={1920} height={1088} className="h-[320px] w-full object-cover md:h-[420px]" />
        <div className="ks-hero-overlay absolute inset-0" />
        <div className="absolute inset-0 flex flex-col justify-center gap-4 p-6 md:p-12">
          <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{t("trusted")}</span>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-primary-foreground md:text-5xl">
            {lang === "hi" ? "खेती का हर फैसला, अब आसान" : "Every farming decision, made simple"}
          </h1>
          <p className="max-w-xl text-sm text-primary-foreground/90 md:text-base">{t("heroSub")}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/crops">{t("getStarted")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link to="/chat">{t("askAI")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        <Card className="border-border">
          <CardContent className="flex items-center gap-3 p-4">
            <CloudSun className="h-9 w-9 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">{t("weather")}</p>
              <p className="text-lg font-semibold">{today.tempMax}°C / {today.tempMin}°C</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-3 p-4">
            <Droplets className="h-9 w-9 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">{lang === "hi" ? "बारिश की संभावना" : "Rain chance"}</p>
              <p className="text-lg font-semibold">{today.rainChance}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-3 p-4">
            <Wind className="h-9 w-9 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">{lang === "hi" ? "हवा" : "Wind"}</p>
              <p className="text-lg font-semibold">{today.wind} km/h</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold md:text-2xl">{lang === "hi" ? "आपके लिए सुविधाएं" : "What you can do"}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.to} to={f.to} className="group">
              <Card className="h-full border-border transition group-hover:-translate-y-0.5 group-hover:border-primary/50 group-hover:shadow-md">
                <CardContent className="p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 font-semibold text-foreground">{t(f.key)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{lang === "hi" ? f.hi : f.en}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold md:text-2xl">{t("market")}</h2>
          <Link to="/market" className="text-sm font-semibold text-primary">{lang === "hi" ? "सभी देखें" : "View all"}</Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {top.map((r) => (
            <Card key={r.crop + r.mandi} className="border-border">
              <CardContent className="p-4">
                <p className="font-semibold">{r.crop}</p>
                <p className="text-xs text-muted-foreground">{r.mandi}, {r.state}</p>
                <p className="mt-2 text-xl font-bold text-primary">{inr(r.modal)}<span className="text-xs font-medium text-muted-foreground">/qtl</span></p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-secondary p-6 md:p-8">
        <h2 className="text-xl font-bold md:text-2xl">{t("howItWorks")}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-card p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{i}</span>
              <p className="mt-3 font-semibold">{t(`step${i}`)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t(`step${i}d`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-center gap-3">
          <Users className="h-10 w-10 text-primary" />
          <div>
            <p className="font-semibold">{lang === "hi" ? "अपनी प्रोफाइल बनाएं" : "Set up your farm profile"}</p>
            <p className="text-sm text-muted-foreground">{lang === "hi" ? "सलाह आपके खेत के हिसाब से मिलेगी।" : "Get advice tuned to your land and crops."}</p>
          </div>
        </div>
        <Button asChild className="rounded-full">
          <Link to="/profile">{t("profile")}</Link>
        </Button>
      </section>
    </Layout>
  );
}
