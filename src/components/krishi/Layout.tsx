import { Link } from "@tanstack/react-router";
import {
  Home, Sprout, ScanLine, CloudSun, IndianRupee, Landmark, User, Menu, Moon, Sun,
  FlaskConical, CalendarDays, Bell, MapPin, Beef, Users, Shield, Sparkles, LineChart, X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useLang } from "@/lib/krishi/i18n";
import { useTheme } from "@/lib/krishi/theme";
import { Button } from "@/components/ui/button";

export const NAV = [
  { to: "/", key: "home", icon: Home },
  { to: "/crops", key: "cropReco", icon: Sprout },
  { to: "/disease", key: "diseaseDetect", icon: ScanLine },
  { to: "/weather", key: "weather", icon: CloudSun },
  { to: "/market", key: "market", icon: IndianRupee },
  { to: "/soil", key: "soil", icon: FlaskConical },
  { to: "/planner", key: "planner", icon: LineChart },
  { to: "/farm", key: "farm", icon: CalendarDays },
  { to: "/alerts", key: "alerts", icon: Bell },
  { to: "/schemes", key: "schemes", icon: Landmark },
  { to: "/services", key: "services", icon: MapPin },
  { to: "/livestock", key: "livestock", icon: Beef },
  { to: "/community", key: "hub", icon: Users },
  { to: "/admin", key: "admin", icon: Shield },
] as const;

const PRIMARY = ["/crops", "/disease", "/weather", "/market", "/farm"];

const MOBILE_NAV = [
  { to: "/", key: "home", icon: Home },
  { to: "/crops", key: "crops", icon: Sprout },
  { to: "/farm", key: "farm", icon: CalendarDays },
  { to: "/market", key: "market", icon: IndianRupee },
  { to: "/profile", key: "profile", icon: User },
] as const;

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-semibold">
      {(["en", "hi"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-3 py-1 transition ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          {l === "en" ? "EN" : "हिं"}
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle() {
  const { mode, toggle } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="rounded-full">
      {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const { t, L } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 ks-glass border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="ks-grad-primary flex h-10 w-10 items-center justify-center rounded-2xl text-lg text-primary-foreground shadow-lg">🌾</span>
            <span className="leading-tight">
              <span className="block font-bold text-foreground">{t("appName")}</span>
              <span className="block text-[11px] text-muted-foreground">{t("tagline")}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.filter((n) => PRIMARY.includes(n.to)).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "rounded-full px-3 py-2 text-sm font-semibold bg-secondary text-secondary-foreground" }}
              >
                {t(n.key)}
              </Link>
            ))}
            <button
              onClick={() => setOpen((o) => !o)}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              {t("more")}
            </button>
          </nav>

          <div className="flex items-center gap-1.5">
            <Button asChild size="sm" className="hidden rounded-full sm:inline-flex">
              <Link to="/assistant"><Sparkles className="mr-1 h-4 w-4" /> {t("askAI")}</Link>
            </Button>
            <LangToggle />
            <ThemeToggle />
            <Button asChild variant="ghost" size="icon" className="hidden rounded-full lg:inline-flex" aria-label={t("profile")}>
              <Link to="/profile"><User className="h-5 w-5" /></Link>
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {open && (
          <div className="border-t border-border bg-card">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 py-3 sm:grid-cols-3 lg:grid-cols-5">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
                >
                  <n.icon className="h-4 w-4 text-primary" /> {t(n.key)}
                </Link>
              ))}
              <Link to="/assistant" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary">
                <Sparkles className="h-4 w-4 text-primary" /> {t("assistant")}
              </Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary">
                <User className="h-4 w-4 text-primary" /> {t("profile")}
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-5 md:pb-12">{children}</main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {t("appName")} — {t("tagline")}</p>
          <p className="text-xs">{L("Advisory only. Confirm chemical doses with your local Krishi Vigyan Kendra.", "केवल सलाह। रासायनिक मात्रा अपने कृषि विज्ञान केंद्र से पुष्ट करें।")}</p>
        </div>
      </footer>

      <Link
        to="/assistant"
        aria-label={t("assistant")}
        className="ks-grad-primary fixed bottom-16 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-xl transition active:scale-95 md:bottom-6"
      >
        <Sparkles className="h-6 w-6" />
      </Link>

      <nav className="ks-glass fixed inset-x-0 bottom-0 z-40 border-t border-border md:hidden">
        <div className="grid grid-cols-5">
          {MOBILE_NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium text-muted-foreground"
              activeProps={{ className: "flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              <n.icon className="h-5 w-5" />
              {t(n.key)}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}