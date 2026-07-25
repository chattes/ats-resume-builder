"use client";

import { useState } from "react";
import { atsCheck } from "@/lib/generate/atsCheck";
import { useResume } from "@/lib/store";

export function AtsBadge() {
  const { resume } = useResume();
  const result = atsCheck(resume);
  const failed = result.checks.filter((c) => !c.pass);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="ats-check-details"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          result.ok
            ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40"
            : "bg-red-500/15 text-red-300 ring-1 ring-red-500/40"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            result.ok ? "bg-emerald-400" : "bg-red-400"
          }`}
          aria-hidden
        />
        Ready{" "}
        {result.ok
          ? "OK"
          : `${failed.length} issue${failed.length === 1 ? "" : "s"}`}
      </button>
      {open && (
        <div
          id="ats-check-details"
          className="absolute right-0 z-20 mt-1 min-w-[14rem] rounded-lg border border-slate-600 bg-slate-900 p-2 text-xs text-slate-300 shadow-xl"
        >
          <p className="mb-1.5 border-b border-slate-700 pb-1 text-[10px] leading-snug text-slate-500">
            Completeness check. Structural ATS safety is guaranteed by DOCX
            export + golden tests.
          </p>
          <ul>
            {result.checks.map((c) => (
              <li
                key={c.id}
                className={c.pass ? "text-emerald-400" : "text-red-300"}
              >
                {c.pass ? "✓" : "✗"} {c.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
