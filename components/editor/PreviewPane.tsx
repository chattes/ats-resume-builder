"use client";

import { useMemo } from "react";
import { resumeToHtml } from "@/lib/generate/html";
import { useResume } from "@/lib/store";

export function PreviewPane() {
  const { resume } = useResume();
  const html = useMemo(() => resumeToHtml(resume), [resume]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="no-print shrink-0 border-b border-slate-700 px-4 py-2 text-xs font-medium tracking-wide text-slate-400 uppercase">
        Live preview
      </div>
      <div className="flex-1 overflow-auto bg-slate-900/50 p-4 sm:p-6">
        <div
          className="mx-auto shadow-2xl shadow-black/40"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
