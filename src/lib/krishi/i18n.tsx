import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

type Dict = Record<string, { en: string; hi: string }>;

export const dict: Dict = {
  appName: { en: "Krishi Sahayk", hi: "कृषि सहायक" },
  tagline: { en: "Your Smart Farming Companion", hi: "आपका स्मार्ट खेती साथी" },
  heroSub: {
    en: "AI-powered crop advice, disease detection, mandi prices and government schemes — all in one simple app.",
    hi: "AI से फसल सलाह, रोग पहचान, मंडी भाव और सरकारी योजनाएं — सब एक आसान ऐप में।",
  },
  getStarted: { en: "Get Started", hi: "शुरू करें" },
  askAI: { en: "Ask AI", hi: "AI से पूछें" },
  home: { en: "Home", hi: "होम" },
  crops: { en: "Crops", hi: "फसल" },
  disease: { en: "Disease", hi: "रोग" },
  chat: { en: "Chat", hi: "चैट" },
  profile: { en: "Profile", hi: "प्रोफाइल" },
  weather: { en: "Weather", hi: "मौसम" },
  market: { en: "Market Prices", hi: "मंडी भाव" },
  schemes: { en: "Govt Schemes", hi: "सरकारी योजनाएं" },
  community: { en: "Community", hi: "समुदाय" },
  cropReco: { en: "Crop Recommendation", hi: "फसल सुझाव" },
  diseaseDetect: { en: "Disease Detection", hi: "रोग पहचान" },
  chatbot: { en: "AI Chatbot", hi: "AI सहायक" },
  howItWorks: { en: "How it works", hi: "कैसे काम करता है" },
  step1: { en: "Enter your details", hi: "अपनी जानकारी भरें" },
  step1d: { en: "Soil, season, region — simple questions only.", hi: "मिट्टी, मौसम, क्षेत्र — बस आसान सवाल।" },
  step2: { en: "Get AI analysis", hi: "AI विश्लेषण पाएं" },
  step2d: { en: "Our assistant studies your farm data instantly.", hi: "हमारा सहायक तुरंत आपकी जानकारी समझता है।" },
  step3: { en: "Take action", hi: "कदम उठाएं" },
  step3d: { en: "Clear steps you can follow in your field today.", hi: "साफ कदम जो आप आज खेत में कर सकते हैं।" },
  trusted: { en: "Trusted by 1,20,000+ farmers", hi: "1,20,000+ किसानों का भरोसा" },
  save: { en: "Save", hi: "सेव करें" },
  download: { en: "Download", hi: "डाउनलोड" },
  analyze: { en: "Analyze", hi: "जांचें" },
  contact: { en: "Contact", hi: "संपर्क" },
  about: { en: "About", hi: "हमारे बारे में" },
  language: { en: "Language", hi: "भाषा" },
  assistant: { en: "AI Assistant", hi: "AI सहायक" },
  soil: { en: "Soil & Fertiliser", hi: "मिट्टी व खाद" },
  planner: { en: "Crop Planner", hi: "फसल योजना" },
  farm: { en: "My Farm", hi: "मेरा खेत" },
  alerts: { en: "Alerts", hi: "चेतावनी" },
  services: { en: "Nearby", hi: "आस-पास" },
  livestock: { en: "Livestock", hi: "पशुधन" },
  hub: { en: "Community", hi: "समुदाय" },
  admin: { en: "Admin", hi: "एडमिन" },
  more: { en: "More", hi: "और" },
  calendar: { en: "Calendar", hi: "कैलेंडर" },
  diary: { en: "Farm Diary", hi: "खेत डायरी" },
  expenses: { en: "Expenses", hi: "खर्च" },
  analytics: { en: "Analytics", hi: "विश्लेषण" },
  marketplace: { en: "Marketplace", hi: "बाज़ार" },
  learn: { en: "Learning Hub", hi: "सीखें" },
  satellite: { en: "Satellite", hi: "सैटेलाइट" },
  yieldp: { en: "Yield Prediction", hi: "उपज अनुमान" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; L: (en: string, hi: string) => string };
const LangCtx = createContext<Ctx>({ lang: "hi", setLang: () => {}, t: (k) => k, L: (_en, hi) => hi });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("hi");
  useEffect(() => {
    const s = localStorage.getItem("ks_lang");
    if (s === "hi" || s === "en") setLangState(s);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("ks_lang", l);
  };
  const t = (k: string) => dict[k]?.[lang] ?? k;
  const L = (en: string, hi: string) => (lang === "hi" ? hi : en);
  return <LangCtx.Provider value={{ lang, setLang, t, L }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}