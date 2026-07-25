"use client";

import { useState } from "react";
import { useResume } from "@/lib/store";

export function SkillsForm() {
  const { resume, dispatch } = useResume();
  const [draft, setDraft] = useState("");

  function addSkill() {
    const s = draft.trim();
    if (!s) return;
    if (resume.skills.includes(s)) {
      setDraft("");
      return;
    }
    dispatch({ type: "SET_SKILLS", payload: [...resume.skills, s] });
    setDraft("");
  }

  function removeSkill(index: number) {
    dispatch({
      type: "SET_SKILLS",
      payload: resume.skills.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="skill-input">
          Add skill
        </label>
        <input
          id="skill-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder="e.g. TypeScript"
          className="w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={addSkill}
          className="shrink-0 rounded-md bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-600"
        >
          Add
        </button>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {resume.skills.map((skill, i) => (
          <li
            key={`${skill}-${i}`}
            className="inline-flex items-center gap-1 rounded-full bg-slate-700/80 px-2.5 py-1 text-xs text-slate-200"
          >
            {skill}
            <button
              type="button"
              aria-label={`Remove ${skill}`}
              onClick={() => removeSkill(i)}
              className="text-slate-400 hover:text-red-300"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
