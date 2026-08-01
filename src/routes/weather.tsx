import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CloudSun, Sun, CloudRain, CloudLightning, Cloud, Droplets, Wind, Sprout } from "lucide-react";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { forecast, STATES, type DayForecast } from "@/lib/krishi/data";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "7-Day Farm Weather — Krishi Sahayk" },
      { name: "description", content: "Seven-day weather outlook with rain chance, humidity and wind, plus spraying and irrigation advice for your field." },
      { property: "og:title", content: "7-Day Farm Weather — Krishi Sahayk" },
      { property: "og:description", content: "Weather-based farm activity advice for Indian farmers." },
    ],
  }),
  component: WeatherPage,
});

function Icon({ c, className = "h-8 w-8" }: { c: DayForecast["condition"]; className?: string }) {
  if (c === "sunny") return <Sun className={`${className} text-accent`} />;
  if (c === "cloudy") return <Cloud className={`${className} text-muted-foreground`} />;
  if (c === "rain") return <CloudRain className={`${className} text-primary`} />;
  return <CloudLightning className={`${className} text-destructive`} />;
}

function WeatherPage() {
  const { t, lang } = useLang();
  const [state, setState] = useState("Punjab");
  const days = forecast(STATES.indexOf(state));
  const today = days[0];

  const advice: string[] =
    lang === "hi"
      ? [
          today.rainChance > 60 ? "आज छिड़काव न करें — बारिश दवा बहा देगी।" : "छिड़काव के लिए सुबह का समय सबसे अच्छा है।",
          today.rainChance > 60 ? "सिंचाई टाल दें, खेत में पानी जमा न होने दें।" : "हल्की सिंचाई करें, दोपहर की गर्मी से बचें।",
          today.humidity > 75 ? "ज्यादा नमी है — फफूंद रोग पर नजर रखें।" : "नमी सामान्य है, फसल की सामान्य निगरानी करें।",
          today.wind > 15 ? "तेज हवा है — स्प्रे और खाद डालना टालें।" : "हवा शांत है, खाद डालने के लिए सही दिन।",
        ]
      : [
          today.rainChance > 60 ? "Avoid spraying today — rain will wash the chemical off." : "Early morning is the best window for spraying.",
          today.rainChance > 60 ? "Skip irrigation and make sure the field drains well." : "Give a light irrigation; avoid the afternoon heat.",
          today.humidity > 75 ? "High humidity — watch closely for fungal disease." : "Humidity is normal; continue routine crop scouting.",
          today.wind > 15 ? "Windy conditions — postpone spraying and fertiliser broadcast." : "Calm winds make this a good day to apply fertiliser.",
        ];

  return (
    <Layout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
          <CloudSun className="h-7 w-7 text-primary" /> {t("weather")}
        </h1>
        <select value={state} onChange={(e) => setState(e.target.value)} className="h-10 rounded-xl border border-input bg-background px-3 text-sm">
          {STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <Card className="mt-4 overflow-hidden border-border">
        <CardContent className="flex flex-wrap items-center justify-between gap-6 bg-primary p-6 text-primary-foreground">
          <div className="flex items-center gap-4">
            <Icon c={today.condition} className="h-16 w-16" />
            <div>
              <p className="text-4xl font-bold">{today.tempMax}°C</p>
              <p className="text-sm opacity-90">{state} · {lang === "hi" ? "आज" : "Today"} · {today.date}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div><p className="flex items-center gap-1 opacity-80"><Droplets className="h-4 w-4" /> {lang === "hi" ? "बारिश" : "Rain"}</p><p className="text-lg font-semibold">{today.rainChance}%</p></div>
            <div><p className="flex items-center gap-1 opacity-80"><CloudSun className="h-4 w-4" /> {lang === "hi" ? "नमी" : "Humidity"}</p><p className="text-lg font-semibold">{today.humidity}%</p></div>
            <div><p className="flex items-center gap-1 opacity-80"><Wind className="h-4 w-4" /> {lang === "hi" ? "हवा" : "Wind"}</p><p className="text-lg font-semibold">{today.wind} km/h</p></div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((d) => (
          <Card key={d.date} className="border-border">
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <p className="text-sm font-semibold">{d.day}</p>
              <p className="text-[11px] text-muted-foreground">{d.date}</p>
              <Icon c={d.condition} />
              <p className="text-sm font-bold">{d.tempMax}° <span className="text-muted-foreground">/ {d.tempMin}°</span></p>
              <p className="text-[11px] text-primary">{d.rainChance}% {lang === "hi" ? "बारिश" : "rain"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-6">
        <h2 className="flex items-center gap-2 text-lg font-bold"><Sprout className="h-5 w-5 text-primary" /> {lang === "hi" ? "आज की खेती सलाह" : "Today's farm advice"}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {advice.map((a) => (
            <Card key={a} className="border-border">
              <CardContent className="p-4 text-sm">{a}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Layout>
  );
}