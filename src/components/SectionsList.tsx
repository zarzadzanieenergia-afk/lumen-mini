import { useMemo, useState } from "react";
import type { GlobalParameters, LightingSection } from "../types";
import { calculateSection } from "../utils/calculations";
import { labels, number } from "../utils/format";

export default function SectionsList({ sections, params, onEdit, onDelete }: {
  sections: LightingSection[]; params: GlobalParameters; onEdit: (section: LightingSection) => void; onDelete: (id: string) => void;
}) {
  const [type, setType] = useState("");
  const [locality, setLocality] = useState("");
  const [road, setRoad] = useState("");
  const [state, setState] = useState("");
  const filtered = useMemo(() => sections.filter(s =>
    (!type || s.sectionType === type) && (!locality || s.locality === locality) && (!road || s.roadType === road) &&
    (!state || s.status === state || s.technicalCondition === state)
  ), [sections, type, locality, road, state]);

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="mb-4"><h2 className="section-title">Lista odcinków</h2><p className="text-sm text-slate-500">Przegląd i zarządzanie lokalną ewidencją.</p></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <select className="input" value={type} onChange={e => setType(e.target.value)}><option value="">Wszystkie typy</option><option value="istniejacy">Istniejące</option><option value="planowany">Planowane</option></select>
          <select className="input" value={locality} onChange={e => setLocality(e.target.value)}><option value="">Wszystkie miejscowości</option>{[...new Set(sections.map(s => s.locality))].map(x => <option key={x}>{x}</option>)}</select>
          <select className="input" value={road} onChange={e => setRoad(e.target.value)}><option value="">Wszystkie drogi</option>{[...new Set(sections.map(s => s.roadType))].map(x => <option key={x}>{x}</option>)}</select>
          <select className="input" value={state} onChange={e => setState(e.target.value)}><option value="">Każdy status / stan</option>{["dobry", "do_weryfikacji", "awarie", "koncepcja", "projektowany", "do_realizacji", "zrealizowany"].map(x => <option key={x} value={x}>{labels[x]}</option>)}</select>
        </div>
      </div>
      <div className="card overflow-hidden">
        {filtered.length === 0 ? <div className="p-12 text-center"><p className="text-3xl">☷</p><h3 className="mt-3 font-bold text-ink">Brak odcinków</h3><p className="text-sm text-slate-500">Zmień filtry lub dodaj pierwszy odcinek.</p></div> : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Nazwa", "Typ", "Miejscowość", "Droga", "Długość", "Oprawy", "Moc oprawy", "Moc łączna", "Energia", "Koszt", "Emisja CO₂", "Status / stan", "Akcje"].map(x => <th className="table-cell font-semibold" key={x}>{x}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(section => {
                  const c = calculateSection(section, params);
                  return <tr key={section.id} className="hover:bg-slate-50/70">
                    <td className="table-cell font-semibold text-ink">{section.name}</td>
                    <td className="table-cell"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${section.sectionType === "istniejacy" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>{labels[section.sectionType]}</span></td>
                    <td className="table-cell">{section.locality}</td><td className="table-cell">{section.roadType}</td>
                    <td className="table-cell">{number(section.lengthM, 0)} m</td><td className="table-cell">{section.lampsCount}</td>
                    <td className="table-cell">{section.lampPowerW} W</td><td className="table-cell">{number(c.powerKw)} kW</td>
                    <td className="table-cell">{number(c.energyMwh)} MWh</td><td className="table-cell">{number(c.energyCostPln, 0)} zł</td>
                    <td className="table-cell">{number(c.emissionsMg)} Mg</td><td className="table-cell">{labels[section.status ?? section.technicalCondition ?? ""]}</td>
                    <td className="table-cell"><div className="flex gap-2"><button className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold hover:bg-slate-200" onClick={() => onEdit(section)}>Edytuj</button><button className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100" onClick={() => onDelete(section.id)}>Usuń</button></div></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
