"use client";

import Link from "next/link";
import { useState } from "react";
import { extractPdfText } from "@/lib/import/extractPdfText";

type Check = { label: string; pass: boolean; note?: string };

function runChecks(text: string): { checks: Check[]; score: number; words: number } {
  const t = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const checks: Check[] = [
    { label: "Contact email present", pass: /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text) },
    { label: "Phone number present", pass: /\d[\d\s().-]{7,}\d/.test(text) },
    { label: "Work Experience section", pass: /(work experience|experience|employment history)/.test(t) },
    { label: "Education section", pass: /education/.test(t) },
    { label: "Skills section", pass: /(skills|competencies)/.test(t) },
    { label: "Uses real bullet points", pass: /[•·▪]/.test(text) || /(^|\n)\s*[-*]\s+/.test(text) },
    {
      label: "Reasonable length (150–1000 words)",
      pass: words >= 150 && words <= 1000,
      note: `${words} words`,
    },
    { label: "Standard section headings", pass: /(summary|experience|education|skills)/.test(t) },
  ];
  const score = Math.round((checks.filter((c) => c.pass).length / checks.length) * 100);
  return { checks, score, words };
}

export function AtsChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ReturnType<typeof runChecks> | null>(null);
  const [busy, setBusy] = useState(false);

  function check() {
    if (text.trim().length < 20) return;
    setResult(runChecks(text));
  }

  async function onPdf(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const extracted = await extractPdfText(file);
      setText(extracted);
      setResult(runChecks(extracted));
    } catch {
      setResult(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your résumé text here…"
        className="h-56 w-full resize-y rounded-lg border border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-200 outline-none focus:border-cyan-500/60"
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={check}
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:from-cyan-400 hover:to-indigo-400"
        >
          Check my résumé
        </button>
        <label className="cursor-pointer rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-cyan-500/50">
          {busy ? "Reading…" : "…or upload a PDF"}
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => onPdf(e.target.files?.[0])}
          />
        </label>
      </div>

      {result && (
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-slate-100">{result.score}%</div>
            <div className="text-sm text-slate-400">ATS-readiness (formatting signals)</div>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {result.checks.map((c) => (
              <li key={c.label} className={c.pass ? "text-emerald-300" : "text-rose-400"}>
                {c.pass ? "✓" : "✗"} {c.label}
                {c.note ? <span className="text-slate-500"> — {c.note}</span> : null}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            This checks text-level formatting signals only. It can’t see tables or columns in the
            original file — the safest fix is to rebuild it in the{" "}
            <Link href="/editor" className="text-cyan-300 hover:underline">ATS builder</Link>, which is
            parse-safe by design.
          </p>
        </div>
      )}
    </div>
  );
}
