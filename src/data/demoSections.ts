import type { LightingSection, Locality } from "../types";

const now = new Date().toISOString();
const points: Record<Locality, [number, number]> = {
  "Wielopole Skrzyńskie": [49.9451, 21.6147],
  "Brzeziny": [49.9705, 21.663],
  "Glinik": [49.918, 21.596],
  "Broniszów": [49.9805, 21.604],
  "Nawsie": [49.936, 21.647]
};

const existing = [
  ["Wielopole Skrzyńskie – centrum", "Wielopole Skrzyńskie", 900, 24, 40],
  ["Brzeziny – droga gminna A", "Brzeziny", 850, 20, 40],
  ["Glinik – odcinek szkolny", "Glinik", 600, 15, 40],
  ["Broniszów – centrum", "Broniszów", 700, 18, 50],
  ["Nawsie – odcinek B", "Nawsie", 500, 12, 40]
] as const;

const planned = [
  ["Brzeziny – nowy odcinek A", "Brzeziny", 850, 20, 40, 180000],
  ["Glinik – nowy odcinek B", "Glinik", 620, 15, 40, 135000],
  ["Nawsie – nowy odcinek C", "Nawsie", 500, 12, 40, 100000],
  ["Broniszów – nowy odcinek D", "Broniszów", 730, 18, 50, 160000],
  ["Wielopole Skrzyńskie – nowy odcinek E", "Wielopole Skrzyńskie", 950, 24, 40, 220000]
] as const;

export const demoSections: LightingSection[] = [
  ...existing.map((item, i) => {
    const [lat, lon] = points[item[1]];
    return {
      id: `demo-existing-${i}`, name: item[0], sectionType: "istniejacy" as const, locality: item[1],
      roadType: "gminna" as const, lengthM: item[2], lampsCount: item[3], lampPowerW: item[4],
      fundingSource: i % 2 ? "Polski Ład" : "budżet gminy", technicalCondition: i === 2 ? "do_weryfikacji" as const : "dobry" as const,
      constructionYear: 2018 + i, ppeOrCircuit: `PPE-${100 + i}`, startLat: lat, startLon: lon,
      endLat: lat + .004 + i * .0004, endLon: lon + .006, notes: "Dane demonstracyjne.", createdAt: now, updatedAt: now
    };
  }),
  ...planned.map((item, i) => {
    const [lat, lon] = points[item[1]];
    return {
      id: `demo-planned-${i}`, name: item[0], sectionType: "planowany" as const, locality: item[1],
      roadType: "gminna" as const, lengthM: item[2], lampsCount: item[3], lampPowerW: item[4],
      investmentCostPln: item[5], fundingSource: i % 2 ? "RFRD" : "budżet gminy", justification: "brak oświetlenia",
      status: i < 2 ? "projektowany" as const : "koncepcja" as const, startLat: lat - .004, startLon: lon - .003,
      endLat: lat - .001 + i * .0003, endLon: lon + .004, safetyScore: 5 - (i % 3),
      socialNeedScore: 4 + (i % 2), noAlternativeLightingScore: 3 + (i % 3), feasibilityScore: 5 - (i % 2),
      notes: "Dane demonstracyjne.", createdAt: now, updatedAt: now
    };
  })
];
