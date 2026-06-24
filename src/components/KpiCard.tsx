interface Props {
  label: string;
  value: string;
  hint?: string;
  accent?: "teal" | "blue" | "amber";
}

export default function KpiCard({ label, value, hint, accent = "teal" }: Props) {
  const colors = { teal: "bg-teal", blue: "bg-blue-600", amber: "bg-amber" };
  return (
    <div className="card relative overflow-hidden p-5">
      <span className={`absolute inset-y-0 left-0 w-1 ${colors[accent]}`} />
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
