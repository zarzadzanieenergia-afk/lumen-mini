import assert from "node:assert/strict";
import type { LightingSection } from "../src/types";
import {
  aggregateSections,
  calculateEnergyScenarios,
  calculateSection,
  DEFAULT_PARAMETERS
} from "../src/utils/calculations";
import { createSectionsCsv } from "../src/utils/csv";

const now = "2026-06-24T00:00:00.000Z";
const planned: LightingSection = {
  id: "qa-planned",
  name: "Odcinek testowy",
  sectionType: "planowany",
  locality: "Brzeziny",
  roadType: "gminna",
  lengthM: 500,
  lampsCount: 10,
  lampPowerW: 40,
  investmentCostPln: 100000,
  status: "koncepcja",
  startLat: 49.94,
  startLon: 21.61,
  endLat: 49.95,
  endLon: 21.62,
  safetyScore: 5,
  socialNeedScore: 4,
  noAlternativeLightingScore: 3,
  feasibilityScore: 2,
  createdAt: now,
  updatedAt: now
};

const existing: LightingSection = {
  ...planned,
  id: "qa-existing",
  name: "Odcinek istniejący",
  sectionType: "istniejacy",
  investmentCostPln: undefined,
  status: undefined,
  technicalCondition: "dobry"
};

const result = calculateSection(planned, DEFAULT_PARAMETERS);
assert.equal(result.powerKw, 0.4);
assert.ok(Math.abs(result.energyMwh - 0.8708) < 1e-10);
assert.ok(Math.abs(result.energyCostPln - 1168.596184) < 1e-9);
assert.ok(Math.abs(result.emissionsMg - 0.4815524) < 1e-10);
assert.equal(result.costPerLamp, 10000);
assert.equal(result.costPerKm, 200000);
assert.ok(Math.abs(result.energyPerLamp - 0.08708) < 1e-10);
assert.ok(Math.abs(result.emissionsKgPerLamp - 48.15524) < 1e-9);
assert.equal(result.priority, 14);

const aggregate = aggregateSections([existing, planned], DEFAULT_PARAMETERS);
assert.equal(aggregate.sections, 2);
assert.equal(aggregate.lamps, 20);
assert.ok(Math.abs(aggregate.energyMwh - result.energyMwh * 2) < 1e-10);

const scenarios = calculateEnergyScenarios([existing, planned], DEFAULT_PARAMETERS);
assert.ok(Math.abs(scenarios[2].energyMwh - aggregate.energyMwh * 0.9) < 1e-10);
assert.ok(Math.abs(scenarios[3].energyCostPln - aggregate.energyCostPln * 0.85) < 1e-10);
assert.ok(Math.abs(scenarios[3].emissionsMg - aggregate.emissionsMg * 0.85) < 1e-10);

const csv = createSectionsCsv([planned], DEFAULT_PARAMETERS);
for (const required of [
  "Odcinek testowy",
  "Moc łączna [kW]",
  "Koszt jednej oprawy",
  "Koszt 1 km",
  "Energia na oprawę",
  "Emisja na oprawę",
  "Priorytet [0-20]",
  "100000"
]) {
  assert.ok(csv.includes(required), `CSV nie zawiera: ${required}`);
}

console.log("QA logiki: wszystkie testy zaliczone.");
