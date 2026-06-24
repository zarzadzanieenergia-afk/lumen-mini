import type { GlobalParameters, LightingSection } from "../types";
import { DEFAULT_PARAMETERS } from "./calculations";

const SECTIONS_KEY = "lumen-mini-sections";
const PARAMETERS_KEY = "lumen-mini-parameters";

export function loadSections(): LightingSection[] {
  try {
    return JSON.parse(localStorage.getItem(SECTIONS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveSections(sections: LightingSection[]) {
  localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
}

export function loadParameters(): GlobalParameters {
  try {
    return { ...DEFAULT_PARAMETERS, ...JSON.parse(localStorage.getItem(PARAMETERS_KEY) ?? "{}") };
  } catch {
    return DEFAULT_PARAMETERS;
  }
}

export function saveParameters(params: GlobalParameters) {
  localStorage.setItem(PARAMETERS_KEY, JSON.stringify(params));
}
