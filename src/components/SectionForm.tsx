import { useEffect, useState } from "react";
import type { LightingSection, Locality, RoadType, SectionType } from "../types";

const localities: Locality[] = ["Wielopole Skrzyńskie", "Brzeziny", "Glinik", "Broniszów", "Nawsie"];
const roadTypes: RoadType[] = ["gminna", "powiatowa", "wojewódzka", "wewnętrzna", "inna"];
const empty = (): LightingSection => ({
  id: crypto.randomUUID(), name: "", sectionType: "istniejacy", locality: "Wielopole Skrzyńskie",
  roadType: "gminna", lengthM: 0, lampsCount: 0, lampPowerW: 40, technicalCondition: "dobry",
  startLat: 49.945, startLon: 21.615, endLat: 49.948, endLon: 21.621,
  safetyScore: 3, socialNeedScore: 3, noAlternativeLightingScore: 3, feasibilityScore: 3,
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
});

export default function SectionForm({ editing, onSave, onCancel, notify }: {
  editing: LightingSection | null;
  onSave: (section: LightingSection) => void;
  onCancel: () => void;
  notify: (message: string, error?: boolean) => void;
}) {
  const [form, setForm] = useState<LightingSection>(editing ?? empty());
  const [gpsLoading, setGpsLoading] = useState<"start" | "end" | null>(null);
  useEffect(() => setForm(editing ?? empty()), [editing]);

  const set = <K extends keyof LightingSection>(key: K, value: LightingSection[K]) => setForm(current => ({ ...current, [key]: value }));
  const numberField = (key: keyof LightingSection, value: string) => set(key, Number(value) as never);

  const getGps = (target: "start" | "end") => {
    if (!navigator.geolocation) return notify("GPS niedostępny.", true);
    setGpsLoading(target);
    navigator.geolocation.getCurrentPosition(
      position => {
        setForm(current => ({
          ...current,
          [target === "start" ? "startLat" : "endLat"]: position.coords.latitude,
          [target === "start" ? "startLon" : "endLon"]: position.coords.longitude
        }));
        setGpsLoading(null);
        notify(`Pobrano GPS jako punkt ${target === "start" ? "początkowy" : "końcowy"}.`);
      },
      error => {
        setGpsLoading(null);
        notify(error.code === error.PERMISSION_DENIED ? "Brak zgody na lokalizację." : "GPS niedostępny.", true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || form.lengthM <= 0 || form.lampsCount <= 0 || form.lampPowerW <= 0 ||
      !Number.isFinite(form.startLat) || !Number.isFinite(form.startLon) || !Number.isFinite(form.endLat) || !Number.isFinite(form.endLon) ||
      (form.sectionType === "planowany" && (
        !form.investmentCostPln || form.investmentCostPln <= 0 ||
        [form.safetyScore, form.socialNeedScore, form.noAlternativeLightingScore, form.feasibilityScore]
          .some(score => score === undefined || score < 1 || score > 5)
      ))) {
      notify("Błędne dane formularza. Uzupełnij wymagane pola wartościami większymi od zera.", true);
      return;
    }
    onSave({ ...form, updatedAt: new Date().toISOString() });
    if (!editing) setForm(empty());
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => <label><span className="label">{label}</span>{children}</label>;

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="card p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div><h2 className="section-title">{editing ? "Edytuj odcinek" : "Nowy odcinek"}</h2><p className="mt-1 text-sm text-slate-500">Dane podstawowe i parametry techniczne.</p></div>
          <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal">Pola wymagane *</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Nazwa odcinka *"><input className="input" value={form.name} onChange={e => set("name", e.target.value)} placeholder="np. Nawsie — droga do szkoły" /></Field>
          <Field label="Typ odcinka *"><select className="input" value={form.sectionType} onChange={e => {
            const type = e.target.value as SectionType;
            setForm(current => ({ ...current, sectionType: type, technicalCondition: type === "istniejacy" ? "dobry" : undefined, status: type === "planowany" ? "koncepcja" : undefined }));
          }}><option value="istniejacy">Istniejący</option><option value="planowany">Planowany</option></select></Field>
          <Field label="Miejscowość *"><select className="input" value={form.locality} onChange={e => set("locality", e.target.value as Locality)}>{localities.map(x => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Typ drogi *"><select className="input" value={form.roadType} onChange={e => set("roadType", e.target.value as RoadType)}>{roadTypes.map(x => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Długość odcinka [m] *"><input className="input" type="number" min="1" value={form.lengthM || ""} onChange={e => numberField("lengthM", e.target.value)} /></Field>
          <Field label="Liczba opraw *"><input className="input" type="number" min="1" value={form.lampsCount || ""} onChange={e => numberField("lampsCount", e.target.value)} /></Field>
          <Field label="Moc jednej oprawy [W] *"><input className="input" type="number" min="1" value={form.lampPowerW || ""} onChange={e => numberField("lampPowerW", e.target.value)} /></Field>
        </div>
      </div>

      <div className="card p-5 sm:p-7">
        <h3 className="font-bold text-ink">Lokalizacja odcinka</h3>
        <p className="mb-5 mt-1 text-sm text-slate-500">Wpisz współrzędne ręcznie lub pobierz bieżącą pozycję GPS.</p>
        {(["start", "end"] as const).map(target => (
          <div key={target} className="mb-5 grid items-end gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto]">
            <Field label={`Punkt ${target === "start" ? "początkowy" : "końcowy"} — lat`}>
              <input className="input" type="number" step="any" value={target === "start" ? form.startLat : form.endLat} onChange={e => numberField(target === "start" ? "startLat" : "endLat", e.target.value)} />
            </Field>
            <Field label={`Punkt ${target === "start" ? "początkowy" : "końcowy"} — lon`}>
              <input className="input" type="number" step="any" value={target === "start" ? form.startLon : form.endLon} onChange={e => numberField(target === "start" ? "startLon" : "endLon", e.target.value)} />
            </Field>
            <button type="button" className="btn-secondary" onClick={() => getGps(target)} disabled={gpsLoading !== null}>
              {gpsLoading === target ? "Pobieranie…" : `⌖ Pobierz GPS jako punkt ${target === "start" ? "początkowy" : "końcowy"}`}
            </button>
          </div>
        ))}
      </div>

      <div className="card p-5 sm:p-7">
        <h3 className="mb-5 font-bold text-ink">{form.sectionType === "istniejacy" ? "Dane odcinka istniejącego" : "Planowanie inwestycji"}</h3>
        {form.sectionType === "istniejacy" ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Rok wykonania"><input className="input" type="number" min="1900" max="2100" value={form.constructionYear ?? ""} onChange={e => numberField("constructionYear", e.target.value)} /></Field>
            <Field label="Źródło finansowania"><select className="input" value={form.fundingSource ?? ""} onChange={e => set("fundingSource", e.target.value)}><option value="">Wybierz</option>{["Rozświetlamy Polskę", "Polski Ład", "RFRD", "budżet gminy", "inne"].map(x => <option key={x}>{x}</option>)}</select></Field>
            <Field label="PPE / obwód"><input className="input" value={form.ppeOrCircuit ?? ""} onChange={e => set("ppeOrCircuit", e.target.value)} /></Field>
            <Field label="Stan techniczny"><select className="input" value={form.technicalCondition} onChange={e => set("technicalCondition", e.target.value as LightingSection["technicalCondition"])}><option value="dobry">Dobry</option><option value="do_weryfikacji">Do weryfikacji</option><option value="awarie">Awarie</option></select></Field>
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Szacowany koszt inwestycji [zł] *"><input className="input" type="number" min="1" value={form.investmentCostPln ?? ""} onChange={e => numberField("investmentCostPln", e.target.value)} /></Field>
              <Field label="Źródło finansowania"><select className="input" value={form.fundingSource ?? ""} onChange={e => set("fundingSource", e.target.value)}><option value="">Wybierz</option>{["budżet gminy", "Polski Ład", "RFRD", "inne"].map(x => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Uzasadnienie"><select className="input" value={form.justification ?? ""} onChange={e => set("justification", e.target.value)}><option value="">Wybierz</option>{["bezpieczeństwo", "wnioski mieszkańców", "brak oświetlenia", "inne"].map(x => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Status"><select className="input" value={form.status} onChange={e => set("status", e.target.value as LightingSection["status"])}><option value="koncepcja">Koncepcja</option><option value="projektowany">Projektowany</option><option value="do_realizacji">Do realizacji</option><option value="zrealizowany">Zrealizowany</option></select></Field>
            </div>
            <div className="mt-6 grid gap-4 rounded-xl bg-blue-50/60 p-4 md:grid-cols-2 xl:grid-cols-4">
              {([
                ["safetyScore", "Bezpieczeństwo"],
                ["socialNeedScore", "Potrzeba mieszkańców"],
                ["noAlternativeLightingScore", "Brak alternatywnego oświetlenia"],
                ["feasibilityScore", "Łatwość realizacji"]
              ] as const).map(([key, label]) => <Field key={key} label={`${label} (1–5)`}><input className="input" type="number" min="1" max="5" value={form[key] ?? 3} onChange={e => numberField(key, e.target.value)} /></Field>)}
            </div>
          </>
        )}
        <label className="mt-5 block"><span className="label">Uwagi</span><textarea className="input min-h-24 resize-y" value={form.notes ?? ""} onChange={e => set("notes", e.target.value)} /></label>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        {editing && <button type="button" className="btn-secondary" onClick={onCancel}>Anuluj</button>}
        <button className="btn-primary" type="submit">{editing ? "Zapisz zmiany" : "Dodaj odcinek"}</button>
      </div>
    </form>
  );
}
