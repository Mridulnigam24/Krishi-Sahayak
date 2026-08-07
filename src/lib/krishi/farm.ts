export type TaskKind = "sowing" | "irrigation" | "fertilizer" | "pesticide" | "harvest" | "pruning";
export type Task = {
  id: string;
  date: string;
  kind: TaskKind;
  crop: string;
  note: string;
  done: boolean;
};

export type DiaryEntry = {
  id: string;
  date: string;
  type: "scan" | "treatment" | "expense" | "harvest" | "note" | "weather";
  title: string;
  detail: string;
  image?: string;
};

export type Expense = {
  id: string;
  date: string;
  category: "seeds" | "labour" | "fuel" | "fertilizer" | "machinery" | "pesticide" | "other" | "income";
  amount: number;
  note: string;
};

const K = { tasks: "ks_tasks", diary: "ks_diary", exp: "ks_expenses" };

function get<T>(key: string, fb: T): T {
  if (typeof window === "undefined") return fb;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fb;
  } catch {
    return fb;
  }
}
function set<T>(key: string, v: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* quota */
  }
}

const iso = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export const rid = () => Math.random().toString(36).slice(2, 10);

export function seedTasks(): Task[] {
  return [
    { id: rid(), date: iso(0), kind: "irrigation", crop: "Wheat", note: "Light irrigation 6–8 AM", done: false },
    { id: rid(), date: iso(1), kind: "fertilizer", crop: "Wheat", note: "Urea top dressing 25 kg/acre", done: false },
    { id: rid(), date: iso(3), kind: "pesticide", crop: "Mustard", note: "Aphid spray — check wind speed", done: false },
    { id: rid(), date: iso(7), kind: "harvest", crop: "Mustard", note: "Harvest window opens", done: false },
  ];
}

export function seedExpenses(): Expense[] {
  return [
    { id: rid(), date: iso(-40), category: "seeds", amount: 4200, note: "Wheat seed 40 kg" },
    { id: rid(), date: iso(-35), category: "labour", amount: 3600, note: "Sowing labour" },
    { id: rid(), date: iso(-28), category: "fertilizer", amount: 5100, note: "DAP + Urea" },
    { id: rid(), date: iso(-20), category: "fuel", amount: 2400, note: "Diesel for pump" },
    { id: rid(), date: iso(-12), category: "pesticide", amount: 1800, note: "Weedicide" },
    { id: rid(), date: iso(-6), category: "machinery", amount: 3000, note: "Tractor rent" },
    { id: rid(), date: iso(-2), category: "income", amount: 48000, note: "Mustard sale — Alwar mandi" },
  ];
}

export function seedDiary(): DiaryEntry[] {
  return [
    { id: rid(), date: iso(-14), type: "scan", title: "Leaf scan — Wheat", detail: "Yellow rust suspected, 78% confidence." },
    { id: rid(), date: iso(-13), type: "treatment", title: "Propiconazole spray", detail: "200 ml/acre in 200 L water." },
    { id: rid(), date: iso(-5), type: "weather", title: "Rain 18 mm", detail: "Irrigation skipped for 3 days." },
    { id: rid(), date: iso(-2), type: "harvest", title: "Mustard harvested", detail: "8.4 quintal/acre." },
  ];
}

export const farm = {
  tasks: () => get<Task[]>(K.tasks, []),
  setTasks: (v: Task[]) => set(K.tasks, v),
  diary: () => get<DiaryEntry[]>(K.diary, []),
  setDiary: (v: DiaryEntry[]) => set(K.diary, v),
  expenses: () => get<Expense[]>(K.exp, []),
  setExpenses: (v: Expense[]) => set(K.exp, v),
  bootstrap() {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(K.tasks)) set(K.tasks, seedTasks());
    if (!localStorage.getItem(K.exp)) set(K.exp, seedExpenses());
    if (!localStorage.getItem(K.diary)) set(K.diary, seedDiary());
  },
};