import { CROPS, type CropInfo } from "./data";

export type RecoInput = {
  soil: string;
  season: string;
  rainfall: "low" | "medium" | "high";
  ph: number;
  n: number;
  p: number;
  k: number;
  state: string;
};

export type Reco = {
  crop: CropInfo;
  score: number;
  reasons: string[];
};

function inRange(v: number, r: [number, number]) {
  if (v >= r[0] && v <= r[1]) return 1;
  const d = v < r[0] ? r[0] - v : v - r[1];
  return Math.max(0, 1 - d / (r[1] || 1));
}

export function recommend(input: RecoInput): Reco[] {
  return CROPS.map((crop) => {
    const reasons: string[] = [];
    let score = 0;

    if (crop.soils.includes(input.soil)) {
      score += 30;
      reasons.push(`${input.soil.charAt(0).toUpperCase() + input.soil.slice(1)} soil suits this crop well`);
    } else {
      score += 8;
    }

    if (crop.seasons.includes(input.season)) {
      score += 28;
      reasons.push(`Ideal for the ${input.season} season`);
    }

    if (crop.rainfall.includes(input.rainfall)) {
      score += 16;
      reasons.push(`Matches ${input.rainfall} rainfall conditions`);
    }

    const nutrient = (inRange(input.n, crop.n) + inRange(input.p, crop.p) + inRange(input.k, crop.k)) / 3;
    score += nutrient * 18;
    if (nutrient > 0.8) reasons.push("Your NPK levels are close to the ideal range");
    else if (nutrient < 0.5) reasons.push("Will need extra fertiliser correction");

    const phFit = input.ph >= 6 && input.ph <= 7.8 ? 1 : Math.max(0, 1 - Math.abs(6.9 - input.ph) / 3);
    score += phFit * 8;
    if (phFit > 0.85) reasons.push(`Soil pH ${input.ph} is in the healthy band`);

    return { crop, score: Math.round(Math.min(99, score)), reasons: reasons.slice(0, 4) };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

export function fertiliserPlan(crop: CropInfo, input: RecoInput) {
  const need = (have: number, target: [number, number]) => Math.max(0, Math.round(target[0] - have));
  return [
    { nutrient: "Nitrogen (N)", gap: need(input.n, crop.n), source: "Urea (46% N)", dose: `${Math.round(need(input.n, crop.n) / 0.46) || 20} kg/acre` },
    { nutrient: "Phosphorus (P)", gap: need(input.p, crop.p), source: "DAP (46% P)", dose: `${Math.round(need(input.p, crop.p) / 0.46) || 15} kg/acre` },
    { nutrient: "Potassium (K)", gap: need(input.k, crop.k), source: "MOP (60% K)", dose: `${Math.round(need(input.k, crop.k) / 0.6) || 10} kg/acre` },
  ];
}