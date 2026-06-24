import type { ViewId } from "../types";

const items: { id: ViewId; label: string; icon: string }[] = [
  { id: "mapa", label: "Mapa", icon: "⌖" },
  { id: "dodaj", label: "Dodaj odcinek", icon: "+" },
  { id: "lista", label: "Lista", icon: "☷" },
  { id: "ranking", label: "Ranking", icon: "↗" },
  { id: "analiza", label: "Analiza", icon: "◫" }
];

export default function Navigation({ active, onChange }: { active: ViewId; onChange: (view: ViewId) => void }) {
  return (
    <nav className="flex gap-1 overflow-x-auto border-t border-slate-200 bg-white px-3 py-2 lg:flex-col lg:border-0 lg:bg-transparent lg:p-0">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`flex min-w-max items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            active === item.id ? "bg-ink text-white shadow-lg shadow-ink/20" : "text-slate-600 hover:bg-white hover:text-ink"
          }`}
        >
          <span className="w-5 text-center text-lg">{item.icon}</span>{item.label}
        </button>
      ))}
    </nav>
  );
}
