import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, NotebookPen, Wallet, BarChart3, Plus, Check } from "lucide-react";
import Layout from "@/components/krishi/Layout";
import { useLang } from "@/lib/krishi/i18n";
import { farm, rid, type Expense, type Task, type DiaryEntry } from "@/lib/krishi/farm";
import { inr } from "@/lib/krishi/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/farm")({
  head: () => ({
    meta: [
      { title: "My Farm — Calendar, Diary, Expenses & Analytics" },
      { name: "description", content: "Track sowing, irrigation and spray tasks, keep a farm diary, log expenses and see profit analytics." },
      { property: "og:title", content: "My Farm — Krishi Sahayak" },
      { property: "og:description", content: "Farm calendar, diary, expense tracker and analytics in one place." },
    ],
  }),
  component: FarmPage,
});

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function FarmPage() {
  const { L } = useLang();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [exp, setExp] = useState<Expense[]>([]);
  const [note, setNote] = useState("");
  const [amt, setAmt] = useState("");
  const [cat, setCat] = useState<Expense["category"]>("seeds");

  useEffect(() => {
    farm.bootstrap();
    setTasks(farm.tasks());
    setDiary(farm.diary());
    setExp(farm.expenses());
  }, []);

  const toggle = (id: string) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTasks(next);
    farm.setTasks(next);
  };

  const addExpense = () => {
    if (!amt) return;
    const next = [{ id: rid(), date: new Date().toISOString().slice(0, 10), category: cat, amount: Number(amt), note }, ...exp];
    setExp(next);
    farm.setExpenses(next);
    setAmt("");
    setNote("");
  };

  const income = exp.filter((e) => e.category === "income").reduce((s, e) => s + e.amount, 0);
  const spend = exp.filter((e) => e.category !== "income").reduce((s, e) => s + e.amount, 0);
  const byCat = Object.entries(
    exp.filter((e) => e.category !== "income").reduce<Record<string, number>>((a, e) => ({ ...a, [e.category]: (a[e.category] ?? 0) + e.amount }), {}),
  ).map(([name, value]) => ({ name, value }));

  return (
    <Layout>
      <div className="ks-rise">
        <h1 className="text-2xl font-bold md:text-3xl">{L("My Farm", "मेरा खेत")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{L("Calendar, diary, expenses and analytics.", "कैलेंडर, डायरी, खर्च और विश्लेषण।")}</p>

        <Tabs defaultValue="cal" className="mt-5">
          <TabsList className="ks-noscroll flex w-full justify-start overflow-x-auto rounded-full">
            <TabsTrigger value="cal" className="rounded-full"><CalendarDays className="mr-1 h-4 w-4" />{L("Calendar", "कैलेंडर")}</TabsTrigger>
            <TabsTrigger value="diary" className="rounded-full"><NotebookPen className="mr-1 h-4 w-4" />{L("Diary", "डायरी")}</TabsTrigger>
            <TabsTrigger value="exp" className="rounded-full"><Wallet className="mr-1 h-4 w-4" />{L("Expenses", "खर्च")}</TabsTrigger>
            <TabsTrigger value="an" className="rounded-full"><BarChart3 className="mr-1 h-4 w-4" />{L("Analytics", "विश्लेषण")}</TabsTrigger>
          </TabsList>

          <TabsContent value="cal" className="mt-4 space-y-3">
            {tasks.map((t) => (
              <Card key={t.id} className="ks-card">
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold">{t.crop} — {t.kind}</p>
                    <p className="text-sm text-muted-foreground">{t.note}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t.date}</p>
                  </div>
                  <Button variant={t.done ? "secondary" : "default"} size="sm" className="rounded-full" onClick={() => toggle(t.id)}>
                    <Check className="mr-1 h-4 w-4" />{t.done ? L("Done", "हो गया") : L("Mark done", "पूरा करें")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="diary" className="mt-4 space-y-3">
            {diary.map((d) => (
              <Card key={d.id} className="ks-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{d.title}</p>
                    <Badge variant="secondary">{d.type}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{d.detail}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{d.date}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="exp" className="mt-4 space-y-4">
            <Card className="ks-card">
              <CardContent className="flex flex-wrap items-end gap-2 p-4">
                <select value={cat} onChange={(e) => setCat(e.target.value as Expense["category"])} className="rounded-xl border border-input bg-background px-3 py-2 text-sm">
                  {["seeds", "labour", "fuel", "fertilizer", "machinery", "pesticide", "other", "income"].map((c) => <option key={c}>{c}</option>)}
                </select>
                <Input value={amt} onChange={(e) => setAmt(e.target.value)} inputMode="numeric" placeholder="₹" className="w-28 rounded-xl" />
                <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder={L("Note", "विवरण")} className="w-40 flex-1 rounded-xl" />
                <Button className="rounded-xl" onClick={addExpense}><Plus className="mr-1 h-4 w-4" />{L("Add", "जोड़ें")}</Button>
              </CardContent>
            </Card>
            {exp.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5">
                <div>
                  <p className="text-sm font-medium">{e.note || e.category}</p>
                  <p className="text-xs text-muted-foreground">{e.date} · {e.category}</p>
                </div>
                <span className={e.category === "income" ? "font-semibold text-primary" : "font-semibold"}>{inr(e.amount)}</span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="an" className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              [L("Income", "आय"), inr(income)],
              [L("Expenses", "खर्च"), inr(spend)],
              [L("Profit", "मुनाफा"), inr(income - spend)],
            ].map(([k, v]) => (
              <Card key={k} className="ks-card"><CardContent className="p-5"><p className="text-xs text-muted-foreground">{k}</p><p className="mt-1 text-2xl font-bold text-primary">{v}</p></CardContent></Card>
            ))}
            <Card className="ks-card md:col-span-2">
              <CardContent className="h-64 p-5">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byCat}>
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="value" fill="var(--color-chart-1)" radius={6} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="ks-card">
              <CardContent className="h-64 p-5">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={byCat} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                      {byCat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}