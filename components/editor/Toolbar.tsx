"use client";

import { useRef } from "react";
import { ACCENT_PALETTE } from "@/lib/accents";
import { resumeToDocx } from "@/lib/generate/docx";
import { downloadBlob } from "@/lib/generate/download";
import type { PageSize, TemplateId } from "@/lib/schema";
import { useResume } from "@/lib/store";
import { listTemplates } from "@/lib/templates";
import { AtsBadge } from "./AtsBadge";

function slug(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "resume"
  );
}

export function Toolbar() {
  const { resume, dispatch, reset, exportJson, importJson } = useResume();
  const fileRef = useRef<HTMLInputElement>(null);
  const templates = listTemplates();

  async function handleDocx() {
    const blob = await resumeToDocx(resume);
    downloadBlob(blob, `${slug(resume.contact.fullName || "resume")}.docx`);
  }

  function handlePrint() {
    window.print();
  }

  function handleClear() {
    if (window.confirm("Clear all resume data? This cannot be undone.")) {
      reset();
    }
  }

  function handleExport() {
    const raw = exportJson();
    const blob = new Blob([raw], { type: "application/json" });
    downloadBlob(blob, `${slug(resume.contact.fullName || "resume")}.json`);
  }

  function handleImportClick() {
    fileRef.current?.click();
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      if (!importJson(text)) {
        window.alert("Invalid resume JSON.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <header className="no-print flex flex-wrap items-center gap-2 border-b border-slate-700 bg-slate-900/90 px-3 py-2">
      <a
        href="/"
        className="mr-1 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
      >
        ATS Builder
      </a>

      <label className="flex items-center gap-1.5 text-xs text-slate-400">
        <span className="sr-only">Template</span>
        <select
          aria-label="Template"
          value={resume.meta.template}
          onChange={(e) =>
            dispatch({
              type: "SET_META",
              payload: { template: e.target.value as TemplateId },
            })
          }
          className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-1" role="group" aria-label="Accent color">
        {ACCENT_PALETTE.map((a) => (
          <button
            key={a.hex}
            type="button"
            title={a.name}
            aria-label={`Accent ${a.name}`}
            aria-pressed={resume.meta.accentHex === a.hex}
            onClick={() =>
              dispatch({ type: "SET_META", payload: { accentHex: a.hex } })
            }
            className={`h-6 w-6 rounded-full border-2 transition ${
              resume.meta.accentHex === a.hex
                ? "border-cyan-300 scale-110"
                : "border-slate-600 hover:border-slate-400"
            }`}
            style={{ backgroundColor: a.hex }}
          />
        ))}
      </div>

      <label className="flex items-center gap-1.5 text-xs text-slate-400">
        <span className="sr-only">Page size</span>
        <select
          aria-label="Page size"
          value={resume.meta.pageSize}
          onChange={(e) =>
            dispatch({
              type: "SET_META",
              payload: { pageSize: e.target.value as PageSize },
            })
          }
          className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
        >
          <option value="Letter">Letter</option>
          <option value="A4">A4</option>
        </select>
      </label>

      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        <AtsBadge />
        <button
          type="button"
          onClick={handleDocx}
          className="rounded-md bg-cyan-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500"
        >
          Download DOCX
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          Print / PDF
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="rounded-md border border-slate-600 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={handleImportClick}
          className="rounded-md border border-slate-600 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
        >
          Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleImportFile}
          aria-label="Import JSON file"
        />
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-red-900/60 px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-950/40"
        >
          Clear
        </button>
      </div>
    </header>
  );
}
