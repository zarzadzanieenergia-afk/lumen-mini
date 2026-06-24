import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { GlobalParameters, LightingSection } from "../types";
import { aggregateSections, calculateEnergyScenarios } from "../utils/calculations";
import { currency, integer, number } from "../utils/format";
import KpiCard from "./KpiCard";

const localities = ["Wielopole Skrzyńskie", "Brzeziny", "Glinik", "Broniszów", "Nawsie"];

export default function AnalyticsPanel({ sections, params, onParamsChange }: {
  sections: LightingSection[]; params: GlobalParameters; onParamsChange: (params: GlobalParameters) => void;
}) {
  const existing = aggregateSections(sections.filter(s => s.sectionType === "istniejacy"), params);
  const planned = aggregateSections(sections.filter(s => s.sectionType === "planowany"), params);
  const all = aggregateSections(sections, params);
  const localityData = localities.map(locality => {
    const a = aggregateSections(sections.filter(s => s.locality === locality), params);
    return { locality: locality.replace("Wielopole Skrzyńskie", "Wielopole"), moc: a.powerKw, energia: a.energyMwh, koszt: a.energyCostPln, emisja: a.emissionsMg };
  });
  const scenarios = calculateEnergyScenarios(sections, params).map(scenario => ({
    name: scenario.name,
    energia: scenario.energyMwh,
    koszt: scenario.energyCostPln,
    emisja: scenario.emissionsMg
  }));

  const Group = ({ title, data, accent }: { title: string; data: typeof all; accent: "teal" | "blue" | "amber" }) => (
    <section>
      <div className="mb-3 flex items-center gap-2"><span className={`h-3 w-3 rounded-full ${accent === "teal" ? "bg-teal" : accent === "blue" ? "bg-blue-600" : "bg-amber"}`} /><h3 className="font-bold text-ink">{title}</h3></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <KpiCard label="Odcinki" value={integer(data.sections)} accent={accent} /><KpiCard label="Oprawy" value={integer(data.lamps)} accent={accent} />
        <KpiCard label="Moc łączna" value={`${number(data.powerKw)} kW`} accent={accent} /><KpiCard label="Energia rocznie" value={`${number(data.energyMwh)} MWh`} accent={accent} />
        <KpiCard label="Koszt rocznie" value={currency(data.energyCostPln)} accent={accent} /><KpiCard label="Emisja CO₂" value={`${number(data.emissionsMg)} Mg`} accent={accent} />
      </div>
    </section>
  );

  const Chart = ({ title, dataKey, unit, color }: { title: string; dataKey: string; unit: string; color: string }) => (
    <div className="card p-5"><h3 className="mb-4 font-bold text-ink">{title}</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={localityData} margin={{ left: 4, right: 8, bottom: 20 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="locality" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={55} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(value: number) => [`${number(value)} ${unit}`, ""]} /><Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
  );

  return (
    <div className="space-y-7">
      <div className="card p-5 sm:p-7"><div className="mb-5"><h2 className="section-title">Parametry globalne</h2><p className="text-sm text-slate-500">Zmiany są automatycznie zapisywane lokalnie i przeliczają całą analizę.</p></div><div className="grid gap-4 md:grid-cols-3">
        <label><span className="label">Czas pracy systemu [h/rok]</span><input className="input" type="number" min="1" value={params.operatingHours} onChange={e => onParamsChange({ ...params, operatingHours: Number(e.target.value) })} /></label>
        <label><span className="label">Cena energii [zł/MWh]</span><input className="input" type="number" min="0" step=".01" value={params.energyPrice} onChange={e => onParamsChange({ ...params, energyPrice: Number(e.target.value) })} /></label>
        <label><span className="label">Wskaźnik emisji CO₂ [Mg/MWh]</span><input className="input" type="number" min="0" step=".001" value={params.emissionFactor} onChange={e => onParamsChange({ ...params, emissionFactor: Number(e.target.value) })} /></label>
      </div></div>
      <Group title="Odcinki istniejące" data={existing} accent="teal" />
      <Group title="Odcinki planowane" data={planned} accent="blue" />
      <Group title="Razem po realizacji planowanych odcinków" data={all} accent="amber" />
      <section className="card overflow-hidden">
        <div className="border-b border-slate-200 p-5 sm:p-7"><h2 className="section-title">Scenariusze ograniczenia rocznego zużycia energii</h2><p className="mt-1 text-sm text-slate-500">Porównanie skutków energetycznych, kosztowych i emisyjnych względem stanu istniejącego.</p></div>
        <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Wariant", "Energia [MWh/rok]", "Koszt [zł/rok]", "Emisja [Mg/rok]", "Różnica energii vs istniejące"].map(x => <th key={x} className="table-cell font-semibold">{x}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{scenarios.map(s => {
          const diff = existing.energyMwh ? (s.energia / existing.energyMwh - 1) * 100 : 0;
          return <tr key={s.name}><td className="table-cell font-semibold text-ink">{s.name}</td><td className="table-cell">{number(s.energia)}</td><td className="table-cell">{currency(s.koszt)}</td><td className="table-cell">{number(s.emisja)}</td><td className={`table-cell font-bold ${diff > 0 ? "text-amber-700" : "text-emerald-700"}`}>{diff > 0 ? "+" : ""}{number(diff, 1)}%</td></tr>;
        })}</tbody></table></div>
      </section>
      <div className="grid gap-5 xl:grid-cols-2">
        <Chart title="Moc łączna według miejscowości" dataKey="moc" unit="kW" color="#287b78" />
        <Chart title="Zużycie energii według miejscowości" dataKey="energia" unit="MWh/rok" color="#2563eb" />
        <Chart title="Koszt energii według miejscowości" dataKey="koszt" unit="zł/rok" color="#d69b3c" />
        <Chart title="Emisja CO₂ według miejscowości" dataKey="emisja" unit="Mg/rok" color="#64748b" />
      </div>
      <div className="card p-5"><h3 className="mb-4 font-bold text-ink">Porównanie scenariuszy</h3><div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={scenarios}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(value: number) => number(value)} /><Legend /><Bar dataKey="energia" name="Energia [MWh/rok]" fill="#2563eb" radius={[5, 5, 0, 0]} /><Bar dataKey="emisja" name="Emisja [Mg/rok]" fill="#d69b3c" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
    </div>
  );
}
