"use client";

import { atsCheck } from "@/lib/generate/atsCheck";
import { useResume } from "@/lib/store";

export function AtsBadge() {
  const { resume } = useResume();
  const result = atsCheck(resume);
  const failed = result.checks.filter((c) => !c.pass);

  return (
    <div className="relative group">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          result.ok
            ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40"
            : "bg-red-500/15 text-red-300 ring-1 ring-red-500/40"
        }`}
        title={
          result.ok
            ? "All ATS checks passed"
            : failed.map((c) => c.label).join(", ")
        }
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            result.ok ? "bg-emerald-400" : "bg-red-400"
          }`}
          aria-hidden
        />
        ATS {result.ok ? "OK" : `${failed.length} issue${failed.length === 1 ? "" : "s"}`}
      </span>
      {!result.ok && (
        <ul className="pointer-events-none absolute right-0 z-20 mt-1 hidden min-w-[12rem] rounded-lg border border-slate-600 bg-slate-900 p-2 text-xs text-slate-300 shadow-xl group-hover:block">
          {result.checks.map((c) => (
            <li key={c.id} className={c.pass ? "text-emerald-400" : "text-red-300"}>
              {c.pass ? "✓" : "✗"} {c.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
