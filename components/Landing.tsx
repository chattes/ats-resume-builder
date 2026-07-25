"use client";

import { useRouter } from "next/navigation";
import { listPersonas } from "@/lib/personas";
import type { PersonaId } from "@/lib/schema";

const PERSONA_KEY = "ats-resume-persona";

export function Landing() {
  const router = useRouter();
  const personas = listPersonas();

  function start(persona?: PersonaId) {
    if (persona) {
      try {
        sessionStorage.removeItem("ats-resume-blank");
        sessionStorage.setItem(PERSONA_KEY, persona);
      } catch {
        // ignore
      }
      router.push(`/editor?persona=${persona}`);
    } else {
      try {
        sessionStorage.removeItem(PERSONA_KEY);
        sessionStorage.setItem("ats-resume-blank", "1");
      } catch {
        // ignore
      }
      router.push("/editor");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-medium tracking-wide text-cyan-400 uppercase">
          BrightByteTreasures
        </p>
        <h1 className="mt-3 bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          ATS Resume Builder
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          Build a genuinely ATS-safe résumé. Export .docx and PDF. Your data
          stays in your browser — never uploaded.
        </p>
        <button
          type="button"
          onClick={() => start()}
          className="mt-8 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-indigo-400"
        >
          Start blank
        </button>
      </div>

      <h2 className="mt-16 text-center text-lg font-semibold text-slate-200">
        Or start from a persona
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {personas.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => start(p.id)}
            className="rounded-xl border border-slate-700 bg-slate-800/80 p-5 text-left transition hover:border-cyan-500/50 hover:bg-slate-800"
          >
            <div className="text-base font-semibold text-cyan-300">{p.name}</div>
            <div className="mt-1 text-sm text-slate-400">{p.description}</div>
          </button>
        ))}
      </div>
    </main>
  );
}
