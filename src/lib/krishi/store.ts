export type Profile = {
  name: string;
  phone: string;
  village: string;
  state: string;
  landAcres: string;
  mainCrop: string;
};

export type SavedReco = {
  id: string;
  date: string;
  input: Record<string, string>;
  crops: { name: string; score: number; emoji: string }[];
};

export type ScanRecord = {
  id: string;
  date: string;
  disease: string;
  crop: string;
  confidence: number;
  image?: string;
};

const K = {
  profile: "ks_profile",
  recos: "ks_recos",
  scans: "ks_scans",
  chat: "ks_chat",
};

function get<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
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

export const ks = {
  getProfile: () => get<Profile | null>(K.profile, null),
  setProfile: (p: Profile) => set(K.profile, p),
  getRecos: () => get<SavedReco[]>(K.recos, []),
  setRecos: (v: SavedReco[]) => set(K.recos, v),
  getScans: () => get<ScanRecord[]>(K.scans, []),
  setScans: (v: ScanRecord[]) => set(K.scans, v),
  getChat: <T,>() => get<T[]>(K.chat, []),
  setChat: <T,>(v: T[]) => set(K.chat, v),
};

export const uid = () => Math.random().toString(36).slice(2, 9);

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });