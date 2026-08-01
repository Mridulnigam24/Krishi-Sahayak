export type CropInfo = {
  name: string;
  hi: string;
  emoji: string;
  seasons: string[];
  soils: string[];
  rainfall: ("low" | "medium" | "high")[];
  yieldEst: string;
  window: string;
  water: string;
  n: [number, number];
  p: [number, number];
  k: [number, number];
  why: string;
};

export const CROPS: CropInfo[] = [
  { name: "Wheat", hi: "गेहूं", emoji: "🌾", seasons: ["Rabi"], soils: ["loamy", "clay"], rainfall: ["low", "medium"], yieldEst: "18–22 quintal/acre", window: "Nov 1 – Nov 30", water: "4–6 irrigations", n: [100, 140], p: [50, 70], k: [40, 60], why: "Cool Rabi weather with moderate irrigation suits wheat best." },
  { name: "Paddy (Rice)", hi: "धान", emoji: "🌾", seasons: ["Kharif"], soils: ["clay", "loamy"], rainfall: ["high", "medium"], yieldEst: "22–28 quintal/acre", window: "Jun 15 – Jul 15", water: "Standing water needed", n: [110, 150], p: [40, 60], k: [40, 60], why: "High rainfall and water-holding soil make paddy a strong choice." },
  { name: "Cotton", hi: "कपास", emoji: "🌱", seasons: ["Kharif"], soils: ["black", "loamy"], rainfall: ["medium"], yieldEst: "8–12 quintal/acre", window: "May 15 – Jun 30", water: "5–7 irrigations", n: [80, 120], p: [40, 60], k: [40, 60], why: "Black cotton soil holds moisture well for a long cotton season." },
  { name: "Groundnut", hi: "मूंगफली", emoji: "🥜", seasons: ["Kharif", "Zaid"], soils: ["sandy", "red"], rainfall: ["low", "medium"], yieldEst: "9–12 quintal/acre", window: "Jun 1 – Jul 10", water: "3–4 irrigations", n: [20, 40], p: [40, 60], k: [40, 60], why: "Light sandy soil gives good pod development and easy harvest." },
  { name: "Maize", hi: "मक्का", emoji: "🌽", seasons: ["Kharif", "Rabi", "Zaid"], soils: ["loamy", "red", "sandy"], rainfall: ["medium"], yieldEst: "20–25 quintal/acre", window: "Jun 10 – Jul 10", water: "4–5 irrigations", n: [100, 130], p: [50, 60], k: [40, 50], why: "Maize is flexible across seasons and gives quick returns." },
  { name: "Soybean", hi: "सोयाबीन", emoji: "🫘", seasons: ["Kharif"], soils: ["black", "loamy"], rainfall: ["medium", "high"], yieldEst: "10–14 quintal/acre", window: "Jun 20 – Jul 10", water: "Mostly rainfed", n: [20, 40], p: [60, 80], k: [30, 40], why: "Soybean fixes nitrogen and thrives in black soil monsoon fields." },
  { name: "Mustard", hi: "सरसों", emoji: "🌼", seasons: ["Rabi"], soils: ["sandy", "loamy"], rainfall: ["low"], yieldEst: "7–9 quintal/acre", window: "Oct 10 – Nov 5", water: "2–3 irrigations", n: [60, 90], p: [30, 40], k: [20, 40], why: "Low water need makes mustard ideal for dry Rabi belts." },
  { name: "Sugarcane", hi: "गन्ना", emoji: "🎋", seasons: ["Zaid", "Kharif"], soils: ["loamy", "clay", "black"], rainfall: ["high", "medium"], yieldEst: "320–400 quintal/acre", window: "Feb 1 – Mar 31", water: "Heavy, 8+ irrigations", n: [140, 180], p: [60, 80], k: [60, 80], why: "Long duration crop with strong returns where water is assured." },
  { name: "Onion", hi: "प्याज", emoji: "🧅", seasons: ["Rabi", "Kharif"], soils: ["loamy", "red", "black"], rainfall: ["low", "medium"], yieldEst: "100–140 quintal/acre", window: "Oct 15 – Nov 30", water: "6–8 light irrigations", n: [80, 110], p: [50, 60], k: [60, 80], why: "Good mandi demand and works well in well-drained loam." },
  { name: "Chickpea (Gram)", hi: "चना", emoji: "🫛", seasons: ["Rabi"], soils: ["black", "loamy", "sandy"], rainfall: ["low"], yieldEst: "7–10 quintal/acre", window: "Oct 15 – Nov 15", water: "1–2 irrigations", n: [20, 30], p: [50, 60], k: [20, 30], why: "Very low water need and improves soil nitrogen for the next crop." },
];

export const STATES = ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Maharashtra", "Rajasthan", "Gujarat", "Bihar", "Karnataka", "Tamil Nadu", "West Bengal", "Andhra Pradesh"];

export type Scheme = {
  id: string;
  name: string;
  hi: string;
  category: "subsidy" | "insurance" | "loan" | "training";
  benefit: string;
  eligibility: string;
  url: string;
};

export const SCHEMES: Scheme[] = [
  { id: "pmkisan", name: "PM-KISAN Samman Nidhi", hi: "पीएम-किसान सम्मान निधि", category: "subsidy", benefit: "₹6,000 per year in 3 equal instalments directly to the bank account.", eligibility: "All landholding farmer families with cultivable land records.", url: "https://pmkisan.gov.in" },
  { id: "pmfby", name: "PM Fasal Bima Yojana", hi: "प्रधानमंत्री फसल बीमा योजना", category: "insurance", benefit: "Crop insurance at 2% premium (Kharif) and 1.5% (Rabi) against calamity loss.", eligibility: "Farmers growing notified crops, including sharecroppers and tenants.", url: "https://pmfby.gov.in" },
  { id: "shc", name: "Soil Health Card Scheme", hi: "मृदा स्वास्थ्य कार्ड योजना", category: "training", benefit: "Free soil testing with nutrient status and fertiliser advice every 2 years.", eligibility: "All farmers with agricultural land.", url: "https://soilhealth.dac.gov.in" },
  { id: "kcc", name: "Kisan Credit Card (KCC)", hi: "किसान क्रेडिट कार्ड", category: "loan", benefit: "Crop loan up to ₹3 lakh at 4% effective interest with timely repayment.", eligibility: "Farmers, tenant farmers, oral lessees and SHG/JLG members.", url: "https://www.myscheme.gov.in/schemes/kcc" },
  { id: "pmksy", name: "PM Krishi Sinchayee Yojana", hi: "प्रधानमंत्री कृषि सिंचाई योजना", category: "subsidy", benefit: "Up to 55% subsidy on drip and sprinkler micro-irrigation systems.", eligibility: "Farmers with own or leased land and an assured water source.", url: "https://pmksy.gov.in" },
  { id: "enam", name: "e-NAM Online Mandi", hi: "ई-नाम ऑनलाइन मंडी", category: "training", benefit: "Sell produce online across India with transparent price discovery.", eligibility: "Any farmer registered at a linked APMC mandi.", url: "https://enam.gov.in" },
  { id: "aif", name: "Agriculture Infrastructure Fund", hi: "कृषि अवसंरचना कोष", category: "loan", benefit: "Loan up to ₹2 crore with 3% interest subvention for storage and processing.", eligibility: "Farmers, FPOs, PACS and agri-entrepreneurs.", url: "https://agriinfra.dac.gov.in" },
  { id: "kvk", name: "Krishi Vigyan Kendra Training", hi: "कृषि विज्ञान केंद्र प्रशिक्षण", category: "training", benefit: "Free field training on modern practices, seed treatment and organic farming.", eligibility: "Open to all farmers and farm women in the district.", url: "https://kvk.icar.gov.in" },
];

export type MandiRow = { crop: string; mandi: string; state: string; min: number; max: number; modal: number; date: string; category: string };

const MANDI_BASE: Omit<MandiRow, "date">[] = [
  { crop: "Wheat", mandi: "Karnal", state: "Haryana", min: 2280, max: 2520, modal: 2410, category: "Cereal" },
  { crop: "Wheat", mandi: "Indore", state: "Madhya Pradesh", min: 2350, max: 2680, modal: 2500, category: "Cereal" },
  { crop: "Paddy (Rice)", mandi: "Ludhiana", state: "Punjab", min: 2050, max: 2320, modal: 2180, category: "Cereal" },
  { crop: "Onion", mandi: "Lasalgaon", state: "Maharashtra", min: 1100, max: 2400, modal: 1750, category: "Vegetable" },
  { crop: "Onion", mandi: "Bengaluru", state: "Karnataka", min: 1250, max: 2600, modal: 1900, category: "Vegetable" },
  { crop: "Tomato", mandi: "Kolar", state: "Karnataka", min: 800, max: 2200, modal: 1450, category: "Vegetable" },
  { crop: "Potato", mandi: "Agra", state: "Uttar Pradesh", min: 700, max: 1400, modal: 1050, category: "Vegetable" },
  { crop: "Cotton", mandi: "Rajkot", state: "Gujarat", min: 6800, max: 7600, modal: 7250, category: "Cash Crop" },
  { crop: "Soybean", mandi: "Ujjain", state: "Madhya Pradesh", min: 4100, max: 4750, modal: 4480, category: "Oilseed" },
  { crop: "Mustard", mandi: "Alwar", state: "Rajasthan", min: 5200, max: 5850, modal: 5550, category: "Oilseed" },
  { crop: "Groundnut", mandi: "Junagadh", state: "Gujarat", min: 5600, max: 6400, modal: 6050, category: "Oilseed" },
  { crop: "Maize", mandi: "Davangere", state: "Karnataka", min: 1900, max: 2250, modal: 2080, category: "Cereal" },
  { crop: "Chickpea (Gram)", mandi: "Bikaner", state: "Rajasthan", min: 5100, max: 5900, modal: 5500, category: "Pulse" },
  { crop: "Sugarcane", mandi: "Muzaffarnagar", state: "Uttar Pradesh", min: 340, max: 380, modal: 360, category: "Cash Crop" },
];

export function mandiRows(): MandiRow[] {
  const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return MANDI_BASE.map((r) => ({ ...r, date }));
}

export function priceTrend(modal: number) {
  const out: { day: string; price: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const wave = Math.sin(i / 2.4) * modal * 0.05;
    const drift = (13 - i) * modal * 0.004;
    out.push({
      day: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      price: Math.round(modal + wave + drift - modal * 0.02),
    });
  }
  return out;
}

export type DayForecast = {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainChance: number;
  wind: number;
  condition: "sunny" | "cloudy" | "rain" | "storm";
};

const CONDITIONS: DayForecast["condition"][] = ["sunny", "cloudy", "rain", "sunny", "cloudy", "rain", "storm"];

export function forecast(seed = 0): DayForecast[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const k = (i + seed) % 7;
    return {
      day: i === 0 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" }),
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      tempMax: 29 + ((k * 3) % 8),
      tempMin: 18 + ((k * 2) % 6),
      humidity: 48 + ((k * 7) % 40),
      rainChance: [5, 20, 70, 10, 35, 80, 90][k],
      wind: 6 + ((k * 4) % 14),
      condition: CONDITIONS[k],
    };
  });
}

export type DiseaseInfo = {
  name: string;
  crop: string;
  confidence: number;
  severity: "Low" | "Moderate" | "High";
  symptoms: string;
  organic: string;
  chemical: string;
  prevention: string;
};

export const DISEASES: DiseaseInfo[] = [
  { name: "Leaf Blight", crop: "Wheat / Maize", confidence: 92, severity: "High", symptoms: "Long greyish-brown lesions that dry the leaf from the tip downward, spreading fast in humid weather.", organic: "Spray neem oil 3% or Trichoderma viride 5g/litre every 7 days; remove infected leaves.", chemical: "Mancozeb 75% WP @ 2g/litre or Propiconazole 25% EC @ 1ml/litre, two sprays 12 days apart.", prevention: "Use certified resistant seed, rotate crops, avoid evening irrigation, keep the field weed-free." },
  { name: "Powdery Mildew", crop: "Vegetables / Pulses", confidence: 88, severity: "Moderate", symptoms: "White powdery patches on the upper leaf surface; leaves curl, yellow and growth slows.", organic: "Spray milk solution (1:9 with water) or wettable sulphur 2g/litre in the morning.", chemical: "Hexaconazole 5% EC @ 1ml/litre or Dinocap @ 1ml/litre.", prevention: "Keep plant spacing for airflow, avoid excess nitrogen, irrigate at soil level." },
  { name: "Bacterial Leaf Spot", crop: "Chilli / Tomato", confidence: 85, severity: "Moderate", symptoms: "Small water-soaked dark spots with a yellow halo; spots merge and leaves drop early.", organic: "Spray Pseudomonas fluorescens 10g/litre; drench soil with cow-dung slurry extract.", chemical: "Copper oxychloride 50% WP @ 3g/litre with Streptocycline 0.5g per 10 litre.", prevention: "Use disease-free seed, hot-water seed treatment, avoid working in wet fields." },
  { name: "Yellow Rust", crop: "Wheat", confidence: 90, severity: "High", symptoms: "Yellow-orange powdery stripes along leaf veins, mostly in cool humid mornings.", organic: "Remove and burn affected tillers; spray neem and garlic extract as early support.", chemical: "Propiconazole 25% EC @ 1ml/litre at first sighting; repeat after 15 days.", prevention: "Sow resistant varieties on time and scout fields weekly from January." },
  { name: "Healthy Leaf", crop: "General", confidence: 96, severity: "Low", symptoms: "No disease signs found. Leaf colour and texture look normal.", organic: "Continue a preventive neem spray every 15 days.", chemical: "No chemical treatment needed right now.", prevention: "Keep monitoring weekly, maintain balanced NPK and good drainage." },
];