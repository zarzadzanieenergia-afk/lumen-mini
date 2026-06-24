import type { GlobalParameters, LightingSection } from "../types";
import { calculateSection } from "../utils/calculations";
import { currency, number } from "../utils/format";

export default function SectionsRanking({ sections, params }: { sections: LightingSection[]; params: GlobalParameters }) {
  const rows = sections.filter(s => s.sectionType === "planowany").map(s => ({ section: s, ...calculateSection(s, params) })).sort((a, b) => b.priority - a.priority);
  return (
    <div className="space-y-4">
      <div className="card p-5 sm:p-7"><div className="flex items-start gap-4"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-2xl text-blue-700">↗</div><div><h2 className="section-title">Ranking planowanych odcinków</h2><p className="mt-1 max-w-3xl text-sm text-slate-500">Priorytet to suma czterech ocen: bezpieczeństwo, potrzeba mieszkańców, brak alternatywnego oświetlenia i łatwość realizacji. Maksymalnie 20 punktów.</p></div></div></div>
      <div className="card overflow-hidden">
        {rows.length === 0 ? <div className="p-12 text-center text-slate-500">Brak planowanych odcinków.</div> : <div className="overflow-x-auto"><table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Miejsce", "Odcinek", "Priorytet", "Koszt inwestycji", "Koszt / oprawę", "Koszt / km", "Energia / oprawę", "Emisja / oprawę"].map(x => <th key={x} className="table-cell font-semibold">{x}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{rows.map((row, index) => <tr key={row.section.id} className="hover:bg-slate-50/70">
            <td className="table-cell"><span className={`grid h-8 w-8 place-items-center rounded-full font-bold ${index < 3 ? "bg-amber/15 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{index + 1}</span></td>
            <td className="table-cell"><strong className="text-ink">{row.section.name}</strong><div className="text-xs text-slate-500">{row.section.locality} · {row.section.lengthM} m · {row.section.lampsCount} opraw</div></td>
            <td className="table-cell"><div className="min-w-28"><div className="mb-1 flex justify-between font-bold text-blue-700"><span>{row.priority}/20</span><span>{row.priority * 5}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${row.priority * 5}%` }} /></div></div></td>
            <td className="table-cell font-semibold">{currency(row.section.investmentCostPln ?? 0)}</td><td className="table-cell">{currency(row.costPerLamp)}</td>
            <td className="table-cell">{currency(row.costPerKm)}</td><td className="table-cell">{number(row.energyPerLamp, 3)} MWh</td><td className="table-cell">{number(row.emissionsKgPerLamp, 1)} kg</td>
          </tr>)}</tbody>
        </table></div>}
      </div>
    </div>
  );
}
