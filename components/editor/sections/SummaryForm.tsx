"use client";

import { useResume } from "@/lib/store";

export function SummaryForm() {
  const { resume, dispatch } = useResume();

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-400" htmlFor="summary">
        Professional summary
      </label>
      <textarea
        id="summary"
        rows={5}
        value={resume.summary}
        onChange={(e) =>
          dispatch({ type: "SET_SUMMARY", payload: e.target.value })
        }
        className="w-full resize-y rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
      />
    </div>
  );
}
