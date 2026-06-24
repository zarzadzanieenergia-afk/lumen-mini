import type { GlobalParameters, LightingSection } from "../types";
import { calculateSection } from "./calculations";

const escapeCell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export function createSectionsCsv(sections: LightingSection[], params: GlobalParameters) {
  const headers = [
    "Nazwa", "Typ", "Miejscowość", "Typ drogi", "Długość [m]", "Liczba opraw",
    "Moc oprawy [W]", "Koszt inwestycji [zł]", "Źródło finansowania", "Uzasadnienie",
    "Status/stan", "Rok wykonania", "PPE/obwód", "Start lat", "Start lon", "Koniec lat",
    "Koniec lon", "Moc łączna [kW]", "Energia [MWh/rok]", "Koszt energii [zł/rok]",
    "Emisja CO2 [Mg/rok]", "Bezpieczeństwo [1-5]", "Potrzeba mieszkańców [1-5]",
    "Brak alternatywnego oświetlenia [1-5]", "Łatwość realizacji [1-5]", "Priorytet [0-20]",
    "Koszt jednej oprawy [zł/oprawę]", "Koszt 1 km [zł/km]",
    "Energia na oprawę [MWh/oprawę/rok]", "Emisja na oprawę [kg CO2/oprawę/rok]",
    "Uwagi", "Utworzono", "Zaktualizowano"
  ];
  const rows = sections.map(section => {
    const c = calculateSection(section, params);
    return [
      section.name, section.sectionType, section.locality, section.roadType, section.lengthM,
      section.lampsCount, section.lampPowerW, section.investmentCostPln, section.fundingSource,
      section.justification, section.status ?? section.technicalCondition, section.constructionYear,
      section.ppeOrCircuit, section.startLat, section.startLon, section.endLat, section.endLon,
      c.powerKw, c.energyMwh, c.energyCostPln, c.emissionsMg,
      section.safetyScore, section.socialNeedScore, section.noAlternativeLightingScore, section.feasibilityScore,
      c.priority, c.costPerLamp, c.costPerKm, c.energyPerLamp, c.emissionsKgPerLamp, section.notes,
      section.createdAt, section.updatedAt
    ].map(escapeCell).join(";");
  });
  return ["\uFEFF", headers.map(escapeCell).join(";"), "\n", rows.join("\n")].join("");
}

export function exportSectionsCsv(sections: LightingSection[], params: GlobalParameters) {
  const blob = new Blob([createSectionsCsv(sections, params)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `lumen-mini-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
