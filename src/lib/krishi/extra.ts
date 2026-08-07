export type Service = {
  name: string;
  type: "Seed Shop" | "Krishi Kendra" | "Mandi" | "Veterinary" | "Fertilizer" | "Soil Lab" | "Bank" | "Warehouse";
  distance: number;
  phone: string;
  open: string;
  x: number;
  y: number;
};

export const SERVICES: Service[] = [
  { name: "Kisan Seed Bhandar", type: "Seed Shop", distance: 1.2, phone: "+91 98110 22331", open: "8 AM – 8 PM", x: 28, y: 34 },
  { name: "Krishi Vigyan Kendra", type: "Krishi Kendra", distance: 3.4, phone: "+91 98110 44112", open: "9 AM – 5 PM", x: 62, y: 22 },
  { name: "Anaj Mandi", type: "Mandi", distance: 4.8, phone: "+91 98110 55220", open: "6 AM – 6 PM", x: 44, y: 62 },
  { name: "Pashu Chikitsalaya", type: "Veterinary", distance: 2.6, phone: "+91 98110 66443", open: "24 hours", x: 74, y: 55 },
  { name: "Bharat Khad Kendra", type: "Fertilizer", distance: 1.9, phone: "+91 98110 77554", open: "8 AM – 7 PM", x: 18, y: 68 },
  { name: "District Soil Testing Lab", type: "Soil Lab", distance: 6.1, phone: "+91 98110 88665", open: "10 AM – 4 PM", x: 82, y: 36 },
  { name: "Gramin Bank — Kisan Branch", type: "Bank", distance: 2.1, phone: "+91 98110 99776", open: "10 AM – 4 PM", x: 52, y: 42 },
  { name: "Cold Storage & Warehouse", type: "Warehouse", distance: 7.3, phone: "+91 98110 11887", open: "7 AM – 9 PM", x: 34, y: 82 },
];

export type Alert = {
  id: string;
  severity: "high" | "medium" | "low";
  en: string;
  hi: string;
  whenEn: string;
  whenHi: string;
  icon: string;
};

export const ALERTS: Alert[] = [
  { id: "a1", severity: "high", icon: "🌧", en: "Heavy rainfall likely (48–65 mm) in 2 days", hi: "2 दिन में तेज़ बारिश (48–65 मिमी) की संभावना", whenEn: "Avoid spraying and delay urea top dressing", whenHi: "छिड़काव न करें, यूरिया डालना टालें", },
  { id: "a2", severity: "medium", icon: "🐛", en: "Aphid outbreak risk rising in mustard belt", hi: "सरसों में माहू का खतरा बढ़ रहा है", whenEn: "Scout 10 plants per acre this week", whenHi: "इस हफ्ते प्रति एकड़ 10 पौधे जांचें" },
  { id: "a3", severity: "medium", icon: "📉", en: "Onion price may fall 8–12% in 10 days", hi: "प्याज भाव 10 दिन में 8–12% गिर सकता है", whenEn: "Consider selling stored stock early", whenHi: "रखा हुआ माल जल्दी बेचने पर विचार करें" },
  { id: "a4", severity: "low", icon: "🥶", en: "Night temperature dropping to 4°C next week", hi: "अगले हफ्ते रात का तापमान 4°C तक", whenEn: "Light evening irrigation protects from frost", whenHi: "शाम को हल्की सिंचाई पाले से बचाती है" },
  { id: "a5", severity: "high", icon: "🦗", en: "Locust movement reported 180 km west", hi: "180 किमी पश्चिम में टिड्डी दल की सूचना", whenEn: "Keep drums and sprayers ready", whenHi: "ड्रम और स्प्रेयर तैयार रखें" },
];

export type Lesson = {
  id: string;
  en: string;
  hi: string;
  mins: number;
  tag: string;
  emoji: string;
  body: string;
};

export const LESSONS: Lesson[] = [
  { id: "l1", en: "Drip irrigation in 10 minutes", hi: "10 मिनट में ड्रिप सिंचाई", mins: 10, tag: "Water", emoji: "💧", body: "Layout, lateral spacing, emitter choice, filter cleaning and 55% PMKSY subsidy paperwork." },
  { id: "l2", en: "Organic pest control at home", hi: "घर पर जैविक कीट नियंत्रण", mins: 8, tag: "Organic", emoji: "🌿", body: "Neem oil 5 ml/L, buttermilk spray, pheromone traps and yellow sticky traps per acre." },
  { id: "l3", en: "Reading your Soil Health Card", hi: "मृदा स्वास्थ्य कार्ड पढ़ना", mins: 12, tag: "Soil", emoji: "🧪", body: "What N, P, K, pH, EC and organic carbon values mean and how to convert them to bag quantities." },
  { id: "l4", en: "Selling smart on e-NAM", hi: "ई-नाम पर समझदारी से बेचें", mins: 9, tag: "Market", emoji: "💹", body: "Lot registration, assaying, bidding windows and payment timelines." },
  { id: "l5", en: "Zero-till wheat after paddy", hi: "धान के बाद जीरो-टिल गेहूं", mins: 14, tag: "Modern", emoji: "🚜", body: "Happy seeder use, residue management and saving one irrigation per acre." },
  { id: "l6", en: "Dairy cattle daily routine", hi: "दुधारू पशु की दिनचर्या", mins: 11, tag: "Livestock", emoji: "🐄", body: "Feed ratios, mineral mixture, mastitis prevention and vaccination calendar." },
];

export type Listing = {
  id: string;
  en: string;
  hi: string;
  kind: "sell" | "buy" | "rent";
  price: string;
  seller: string;
  place: string;
  emoji: string;
};

export const LISTINGS: Listing[] = [
  { id: "m1", en: "Wheat — 40 quintal, grade A", hi: "गेहूं — 40 क्विंटल, ग्रेड A", kind: "sell", price: "₹2,480 / qtl", seller: "Ramesh Yadav", place: "Karnal, HR", emoji: "🌾" },
  { id: "m2", en: "Tractor rent — Mahindra 575", hi: "ट्रैक्टर किराया — महिंद्रा 575", kind: "rent", price: "₹750 / hour", seller: "Balbir Singh", place: "Ludhiana, PB", emoji: "🚜" },
  { id: "m3", en: "Certified mustard seed 5 kg", hi: "प्रमाणित सरसों बीज 5 किग्रा", kind: "buy", price: "₹640 / bag", seller: "Alwar Beej Bhandar", place: "Alwar, RJ", emoji: "🌼" },
  { id: "m4", en: "Vermicompost 500 kg", hi: "वर्मी कम्पोस्ट 500 किग्रा", kind: "sell", price: "₹8 / kg", seller: "Sita Devi SHG", place: "Ujjain, MP", emoji: "🪱" },
  { id: "m5", en: "Rotavator on rent", hi: "रोटावेटर किराए पर", kind: "rent", price: "₹500 / hour", seller: "Kisan Seva Kendra", place: "Agra, UP", emoji: "⚙️" },
  { id: "m6", en: "Onion — 120 quintal", hi: "प्याज — 120 क्विंटल", kind: "sell", price: "₹1,780 / qtl", seller: "Nashik FPO", place: "Lasalgaon, MH", emoji: "🧅" },
];

export type Post = {
  id: string;
  author: string;
  role: string;
  ago: string;
  en: string;
  hi: string;
  likes: number;
  comments: number;
  emoji: string;
};

export const POSTS: Post[] = [
  { id: "p1", author: "Dr. Anita Sharma", role: "Agronomist, KVK Karnal", ago: "2h", en: "Yellow rust is showing up early this year. Scout the lower leaves and spray only if you find pustules on 5% of plants.", hi: "इस साल पीला रतुआ जल्दी दिख रहा है। नीचे की पत्तियां जांचें और 5% पौधों पर धब्बे मिलें तभी छिड़काव करें।", likes: 214, comments: 38, emoji: "🌾" },
  { id: "p2", author: "Manjeet Kaur", role: "Farmer, Bathinda", ago: "5h", en: "Switched to drip on 2 acres of cotton. Water bill down by half and bolls are healthier.", hi: "2 एकड़ कपास में ड्रिप लगाई। पानी का खर्च आधा और फल बेहतर।", likes: 158, comments: 22, emoji: "💧" },
  { id: "p3", author: "Suresh Patil", role: "Farmer, Nashik", ago: "1d", en: "Onion rates in Lasalgaon moved up ₹120 today. Anyone holding stock?", hi: "लासलगांव में प्याज ₹120 चढ़ा। किसी के पास स्टॉक है?", likes: 96, comments: 51, emoji: "🧅" },
];

export type AnimalDisease = {
  id: string;
  animal: string;
  en: string;
  hi: string;
  signs: string;
  treat: string;
};

export const ANIMAL_DISEASES: AnimalDisease[] = [
  { id: "d1", animal: "Cow", en: "Foot and Mouth Disease", hi: "खुरपका-मुंहपका", signs: "Blisters on mouth and hooves, drooling, lameness, sharp drop in milk.", treat: "Isolate, wash mouth with 1% potassium permanganate, antibiotic cover for secondary infection, vaccinate herd every 6 months." },
  { id: "d2", animal: "Cow", en: "Mastitis", hi: "थनैला", signs: "Hot swollen udder, clots or blood in milk, fever.", treat: "Strip out affected quarter 4–5 times/day, intramammary antibiotic tubes from vet, keep bedding dry, teat dip after milking." },
  { id: "d3", animal: "Buffalo", en: "Haemorrhagic Septicaemia", hi: "गलघोंटू", signs: "High fever, swollen throat, noisy breathing, sudden death in monsoon.", treat: "Emergency vet call, sulphonamides/antibiotics early, annual HS vaccine before monsoon." },
  { id: "d4", animal: "Goat", en: "PPR (Goat Plague)", hi: "पीपीआर", signs: "Fever, nasal discharge, mouth ulcers, foul diarrhoea.", treat: "Supportive fluids, antibiotics for secondary infection, PPR vaccine gives 3-year protection." },
  { id: "d5", animal: "Poultry", en: "Newcastle Disease (Ranikhet)", hi: "रानीखेत", signs: "Gasping, twisted neck, greenish droppings, high flock mortality.", treat: "No cure — cull affected, disinfect shed, vaccinate with F1/Lasota and R2B on schedule." },
  { id: "d6", animal: "Poultry", en: "Coccidiosis", hi: "कॉक्सीडियोसिस",  signs: "Bloody droppings, ruffled feathers, poor growth.", treat: "Amprolium in drinking water 5–7 days, keep litter dry, avoid overcrowding." },
];

export const SATELLITE = {
  ndvi: 0.68,
  water: 32,
  flood: 12,
  drought: 24,
  vegetation: 74,
  grid: [
    [0.72, 0.68, 0.61, 0.55, 0.49, 0.58],
    [0.75, 0.71, 0.66, 0.6, 0.52, 0.61],
    [0.79, 0.74, 0.7, 0.64, 0.58, 0.66],
    [0.7, 0.66, 0.62, 0.57, 0.5, 0.6],
    [0.63, 0.6, 0.55, 0.48, 0.44, 0.53],
  ],
};