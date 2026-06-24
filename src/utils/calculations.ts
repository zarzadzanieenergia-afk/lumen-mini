import type { GlobalParameters, LightingSection } from "../types";

export const DEFAULT_PARAMETERS: GlobalParameters = {
  operatingHours: 2177,
  energyPrice: 1341.98,
  emissionFactor: 0.553
};

export function calculateSection(section: LightingSection, params: GlobalParameters) {
  const powerKw = (section.lampsCount * section.lampPowerW) / 1000;
  const energyMwh = (powerKw * params.operatingHours) / 1000;
  const energyCostPln = energyMwh * params.energyPrice;
  const emissionsMg = energyMwh * params.emissionFactor;
  const priority = section.sectionType === "planowany"
    ? (section.safetyScore ?? 0) + (section.socialNeedScore ?? 0) +
      (section.noAlternativeLightingScore ?? 0) + (section.feasibilityScore ?? 0)
    : 0;
  return {
    powerKw,
    energyMwh,
    energyCostPln,
    emissionsMg,
    priority,
    costPerLamp: section.investmentCostPln && section.lampsCount ? section.investmentCostPln / section.lampsCount : 0,
    costPerKm: section.investmentCostPln && section.lengthM ? section.investmentCostPln / (section.lengthM / 1000) : 0,
    energyPerLamp: section.lampsCount ? energyMwh / section.lampsCount : 0,
    emissionsKgPerLamp: section.lampsCount ? emissionsMg * 1000 / section.lampsCount : 0
  };
}

export function aggregateSections(sections: LightingSection[], params: GlobalParameters) {
  return sections.reduce((total, section) => {
    const calculated = calculateSection(section, params);
    total.sections += 1;
    total.lamps += section.lampsCount;
    total.powerKw += calculated.powerKw;
    total.energyMwh += calculated.energyMwh;
    total.energyCostPln += calculated.energyCostPln;
    total.emissionsMg += calculated.emissionsMg;
    return total;
  }, { sections: 0, lamps: 0, powerKw: 0, energyMwh: 0, energyCostPln: 0, emissionsMg: 0 });
}

export function calculateEnergyScenarios(sections: LightingSection[], params: GlobalParameters) {
  const existing = aggregateSections(sections.filter(section => section.sectionType === "istniejacy"), params);
  const all = aggregateSections(sections, params);
  return [
    { name: "Istniejące", factor: 1, base: existing },
    { name: "Po planowanych", factor: 1, base: all },
    { name: "Ograniczenie 10%", factor: 0.9, base: all },
    { name: "Ograniczenie 15%", factor: 0.85, base: all }
  ].map(scenario => ({
    name: scenario.name,
    energyMwh: scenario.base.energyMwh * scenario.factor,
    energyCostPln: scenario.base.energyCostPln * scenario.factor,
    emissionsMg: scenario.base.emissionsMg * scenario.factor
  }));
}
