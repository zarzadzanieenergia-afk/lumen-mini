import type { GlobalParameters, LightingSection } from "../types";
import { exportSectionsCsv } from "../utils/csv";

export default function ExportButton({ sections, params, onError }: { sections: LightingSection[]; params: GlobalParameters; onError: (message: string) => void }) {
  return (
    <button className="btn-secondary" onClick={() => sections.length ? exportSectionsCsv(sections, params) : onError("Brak danych do eksportu.")}>
      <span>⇩</span> Eksportuj do CSV
    </button>
  );
}
