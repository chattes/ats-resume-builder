"use client";

import { useMemo, useState } from "react";
import { analyzeKeywords } from "@/lib/keywords";
import type { Resume } from "@/lib/schema";
import { useResume } from "@/lib/store";

function resumeToPlainText(resume: Resume): string {
  const parts: string[] = [
    resume.contact.fullName,
    resume.contact.title ?? "",
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location ?? "",
    resume.summary,
    ...resume.skills,
  ];
  for (const e of resume.experience) {
    parts.push(e.company, e.role, e.location ?? "", e.start, String(e.end), ...e.bullets);
  }
  for (const e of resume.education) {
    parts.push(e.school, e.degree, e.location ?? "", ...(e.details ?? []));
  }
  for (const c of resume.certifications ?? []) {
    parts.push(c.name, c.issuer ?? "", c.year ?? "");
  }
  for (const p of resume.projects ?? []) {
    parts.push(p.name, p.description, ...(p.bullets ?? []));
  }
  return parts.filter(Boolean).join(" ");
}

export function KeywordPanel() {
  const { resume } = useResume();
  const [open, setOpen] = useState(false);
  const [jd, setJd] = useState("");

  const analysis = useMemo(() => {
    if (!jd.trim()) return { matched: [] as string[], missing: [] as string[] };
    return analyzeKeywords(resumeToPlainText(resume), jd);
  }, [resume, jd]);

  return (
    <div className="border-t border-slate-700">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-slate-800/80"
        aria-expanded={open}
      >
        <span>Keyword match</span>
        <span className="text-slate-500">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="space-y-3 px-3 pb-3">
          <label className="block text-xs text-slate-400" htmlFor="jd-paste">
            Paste job description
          </label>
          <textarea
            id="jd-paste"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={5}
            placeholder="Paste a job description to see matched and missing keywords…"
            className="w-full resize-y rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
          />
          {jd.trim() && (
            <div className="grid gap-2 text-xs sm:grid-cols-2">
              <div>
                <div className="mb-1 font-semibold text-emerald-400">
                  Matched ({analysis.matched.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {analysis.matched.length === 0 && (
                    <span className="text-slate-500">None</span>
                  )}
                  {analysis.matched.map((w) => (
                    <span
                      key={w}
                      className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-emerald-300"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1 font-semibold text-amber-400">
                  Missing ({analysis.missing.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {analysis.missing.length === 0 && (
                    <span className="text-slate-500">None</span>
                  )}
                  {analysis.missing.map((w) => (
                    <span
                      key={w}
                      className="rounded bg-amber-500/15 px-1.5 py-0.5 text-amber-300"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
