import { Link } from "@tanstack/react-router";
import { Home, Sprout, ScanLine, MessageCircle, CloudSun, IndianRupee, Landmark, User, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useLang } from "@/lib/krishi/i18n";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", key: "home", icon: Home },
  { to: "/crops", key: "cropReco", icon: Sprout },
  { to: "/disease", key: "diseaseDetect", icon: ScanLine },
  { to: "/weather", key: "weather", icon: CloudSun },
  { to: "/market", key: "market", icon: IndianRupee },
  { to: "/schemes", key: "schemes", icon: Landmark },
  { to: "/chat", key: "chatbot", icon: MessageCircle },
] as const;

const MOBILE_NAV = [
  { to: "/", key: "home", icon: Home },
  { to: "/crops", key: "crops", icon: Sprout },
  { to: "/disease", key: "disease", icon: ScanLine },
  { to: "/chat", key: "chat", icon: MessageCircle },
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

export default function Layout({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-lg text-primary-foreground">🌾</span>
            <span className="leading-tight">
              <span className="block font-bold text-foreground">{t("appName")}</span>
              <span className="block text-[11px] text-muted-foreground">{t("tagline")}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.slice(1).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "rounded-full px-3 py-2 text-sm font-semibold bg-secondary text-secondary-foreground" }}
              >
                {t(n.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LangToggle />
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {open && (
          <div className="border-t border-border bg-card lg:hidden">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 py-3">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  <n.icon className="h-4 w-4 text-primary" /> {t(n.key)}
                </Link>
              ))}
              <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary">
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
          <p className="text-xs">Advisory only. Confirm chemical doses with your local Krishi Vigyan Kendra.</p>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card md:hidden">
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