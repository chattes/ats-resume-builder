"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { extractPdfLines } from "@/lib/import/extractPdfText";
import { pdfLinesToResume } from "@/lib/import/pdfToResume";
import { STORAGE_KEY } from "@/lib/store";
import type { Resume } from "@/lib/schema";

type State =
  | { kind: "idle" }
  | { kind: "parsing" }
  | { kind: "done"; resume: Resume }
  | { kind: "error"; message: string };

export function PdfToResume() {
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: "idle" });

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setState({ kind: "error", message: "Please choose a PDF file." });
      return;
    }
    setState({ kind: "parsing" });
    try {
      const lines = await extractPdfLines(file);
      if (lines.length < 3) {
        setState({
          kind: "error",
          message:
            "Couldn't read text from this PDF. If it's a scanned image, export a text-based PDF (e.g. LinkedIn → More → Save to PDF).",
        });
        return;
      }
      const resume = pdfLinesToResume(lines);
      setState({ kind: "done", resume });
    } catch {
      setState({ kind: "error", message: "Something went wrong reading that PDF. Try another file." });
    }
  }

  function openInEditor(resume: Resume) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
      sessionStorage.removeItem("ats-resume-persona");
      sessionStorage.removeItem("ats-resume-blank");
    } catch {
      // ignore storage errors
    }
    router.push("/editor");
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
      <label
        htmlFor="pdf-input"
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 px-6 py-12 text-center transition hover:border-cyan-500/60"
      >
        <span className="text-base font-semibold text-slate-100">
          Upload your LinkedIn or résumé PDF
        </span>
        <span className="mt-1 text-sm text-slate-400">
          Click to choose a .pdf — it’s read in your browser and never uploaded.
        </span>
        <input
          id="pdf-input"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>

      {state.kind === "parsing" && (
        <p className="mt-6 text-sm text-cyan-300">Reading your PDF…</p>
      )}

      {state.kind === "error" && (
        <p className="mt-6 text-sm text-rose-400">{state.message}</p>
      )}

      {state.kind === "done" && (
        <div className="mt-6">
          <p className="text-sm text-slate-300">
            Imported{" "}
            <strong className="text-slate-100">
              {state.resume.contact.fullName || "your résumé"}
            </strong>{" "}
            — {state.resume.experience.length} role(s), {state.resume.education.length} education
            entry(ies), {state.resume.skills.length} skill(s). It’s a draft — refine it in the editor.
          </p>
          <button
            type="button"
            onClick={() => openInEditor(state.resume)}
            className="mt-4 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:from-cyan-400 hover:to-indigo-400"
          >
            Open in ATS editor →
          </button>
        </div>
      )}

      <ol className="mt-8 space-y-2 text-sm text-slate-400">
        <li><strong className="text-slate-300">Tip:</strong> On LinkedIn, open your profile → <em>More</em> → <em>Save to PDF</em>, then upload it here.</li>
        <li>We turn it into a clean, single-column, ATS-safe résumé you can edit and export.</li>
      </ol>
    </div>
  );
}
