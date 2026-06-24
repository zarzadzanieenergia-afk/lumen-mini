export type SectionType = "istniejacy" | "planowany";
export type Locality = "Wielopole Skrzyńskie" | "Brzeziny" | "Glinik" | "Broniszów" | "Nawsie";
export type RoadType = "gminna" | "powiatowa" | "wojewódzka" | "wewnętrzna" | "inna";

export interface LightingSection {
  id: string;
  name: string;
  sectionType: SectionType;
  locality: Locality;
  roadType: RoadType;
  lengthM: number;
  lampsCount: number;
  lampPowerW: number;
  investmentCostPln?: number;
  fundingSource?: string;
  justification?: string;
  status?: "koncepcja" | "projektowany" | "do_realizacji" | "zrealizowany";
  technicalCondition?: "dobry" | "do_weryfikacji" | "awarie";
  constructionYear?: number;
  ppeOrCircuit?: string;
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  safetyScore?: number;
  socialNeedScore?: number;
  noAlternativeLightingScore?: number;
  feasibilityScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalParameters {
  operatingHours: number;
  energyPrice: number;
  emissionFactor: number;
}

export type ViewId = "mapa" | "dodaj" | "lista" | "ranking" | "analiza";
