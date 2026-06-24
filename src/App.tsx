import { useEffect, useState } from "react";
import AnalyticsPanel from "./components/AnalyticsPanel";
import ExportButton from "./components/ExportButton";
import MapView from "./components/MapView";
import Navigation from "./components/Navigation";
import SectionForm from "./components/SectionForm";
import SectionsList from "./components/SectionsList";
import SectionsRanking from "./components/SectionsRanking";
import { demoSections } from "./data/demoSections";
import type { GlobalParameters, LightingSection, ViewId } from "./types";
import { loadParameters, loadSections, saveParameters, saveSections } from "./utils/storage";

export default function App() {
  const [view, setView] = useState<ViewId>("mapa");
  const [sections, setSections] = useState<LightingSection[]>(loadSections);
  const [params, setParams] = useState<GlobalParameters>(loadParameters);
  const [editing, setEditing] = useState<LightingSection | null>(null);
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null);
  useEffect(() => saveSections(sections), [sections]);
  useEffect(() => saveParameters(params), [params]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(null), 4000); return () => clearTimeout(timer); }, [toast]);

  const notify = (message: string, error = false) => setToast({ message, error });
  const save = (section: LightingSection) => {
    setSections(current => current.some(x => x.id === section.id) ? current.map(x => x.id === section.id ? section : x) : [...current, section]);
    notify(editing ? "Zapisano zmiany odcinka." : "Dodano nowy odcinek.");
    setEditing(null);
    setView("lista");
  };

  const titles: Record<ViewId, [string, string]> = {
    mapa: ["Mapa odcinków", "Przestrzenny przegląd ewidencji i planów"],
    dodaj: [editing ? "Edycja odcinka" : "Dodaj odcinek", "Wprowadź dane techniczne, kosztowe i lokalizację"],
    lista: ["Ewidencja odcinków", "Wszystkie odcinki w jednym zestawieniu"],
    ranking: ["Ranking inwestycji", "Priorytetyzacja planowanych odcinków"],
    analiza: ["Analiza energetyczna", "Moc, energia, koszty i emisje CO₂"]
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-slate-100/70 p-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="mb-8 flex items-center gap-3 px-2"><img src="/lumen-icon.png" className="h-12 w-12 rounded-2xl shadow-md" alt="" /><div><p className="text-lg font-black tracking-tight text-ink">LUMEN Mini</p><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">Gmina Wielopole</p></div></div>
        <Navigation active={view} onChange={v => { setView(v); if (v !== "dodaj") setEditing(null); }} />
        <div className="mt-auto rounded-2xl bg-ink p-4 text-white"><p className="text-xs font-bold uppercase tracking-wider text-white/60">Lokalny zapis</p><p className="mt-2 text-sm leading-relaxed text-white/85">Dane pozostają w tej przeglądarce. Aplikacja działa również jako PWA.</p></div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-[1000] flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-7 lg:px-10 lg:py-5">
          <div className="flex items-center gap-3"><img src="/lumen-icon.png" className="h-10 w-10 rounded-xl lg:hidden" alt="" /><div><h1 className="text-lg font-bold tracking-tight text-ink sm:text-xl">{titles[view][0]}</h1><p className="hidden text-xs text-slate-500 sm:block">{titles[view][1]}</p></div></div>
          <div className="flex gap-2"><button className="btn-secondary hidden sm:inline-flex" onClick={() => { setSections(demoSections); notify("Wczytano dane przykładowe."); }}>Wczytaj dane przykładowe</button><ExportButton sections={sections} params={params} onError={message => notify(message, true)} /></div>
        </header>
        <main className="p-4 pb-28 sm:p-7 lg:p-10">
          <div className="mb-4 sm:hidden"><button className="btn-secondary w-full" onClick={() => { setSections(demoSections); notify("Wczytano dane przykładowe."); }}>Wczytaj dane przykładowe</button></div>
          {view === "mapa" && <MapView sections={sections} params={params} />}
          {view === "dodaj" && <SectionForm editing={editing} onSave={save} onCancel={() => { setEditing(null); setView("lista"); }} notify={notify} />}
          {view === "lista" && <SectionsList sections={sections} params={params} onEdit={section => { setEditing(section); setView("dodaj"); }} onDelete={id => { setSections(current => current.filter(x => x.id !== id)); notify("Usunięto odcinek."); }} />}
          {view === "ranking" && <SectionsRanking sections={sections} params={params} />}
          {view === "analiza" && <AnalyticsPanel sections={sections} params={params} onParamsChange={setParams} />}
        </main>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-[1100] lg:hidden"><Navigation active={view} onChange={v => { setView(v); if (v !== "dodaj") setEditing(null); }} /></div>
      {toast && <div className={`fixed bottom-24 right-4 z-[2000] max-w-sm rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-2xl lg:bottom-6 ${toast.error ? "bg-red-700" : "bg-teal"}`}>{toast.message}</div>}
    </div>
  );
}
