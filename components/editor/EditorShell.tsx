"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { PersonaId } from "@/lib/schema";
import { useResume } from "@/lib/store";
import { FormAccordion } from "./FormAccordion";
import { KeywordPanel } from "./KeywordPanel";
import { PreviewPane } from "./PreviewPane";
import { Toolbar } from "./Toolbar";

const PERSONA_KEY = "ats-resume-persona";
const PERSONA_IDS = new Set<PersonaId>([
  "tech",
  "healthcare",
  "finance",
  "education",
]);

function resolvePersona(): PersonaId | null {
  if (typeof window === "undefined") return null;
  try {
    const q = new URLSearchParams(window.location.search).get("persona");
    if (q && PERSONA_IDS.has(q as PersonaId)) return q as PersonaId;
    const s = sessionStorage.getItem(PERSONA_KEY);
    if (s && PERSONA_IDS.has(s as PersonaId)) return s as PersonaId;
  } catch {
    // ignore
  }
  return null;
}

export function EditorShell() {
  const { loadPersona, reset } = useResume();
  const router = useRouter();

  useEffect(() => {
    // Run after ResumeProvider localStorage hydration.
    const t = window.setTimeout(() => {
      try {
        if (sessionStorage.getItem("ats-resume-blank") === "1") {
          sessionStorage.removeItem("ats-resume-blank");
          reset();
          router.replace("/editor");
          return;
        }
      } catch {
        // ignore
      }

      const id = resolvePersona();
      if (!id) return;
      loadPersona(id);
      try {
        sessionStorage.removeItem(PERSONA_KEY);
      } catch {
        // ignore
      }
      // One-shot: strip ?persona= so refresh does not re-apply and wipe edits.
      router.replace("/editor");
    }, 0);
    return () => window.clearTimeout(t);
  }, [loadPersona, reset, router]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Toolbar />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="no-print flex max-h-[45vh] w-full flex-col border-b border-slate-700 bg-slate-900 lg:max-h-none lg:w-[40%] lg:border-r lg:border-b-0">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <FormAccordion />
          </div>
          <KeywordPanel />
        </aside>
        <section className="min-h-0 flex-1 lg:w-[60%]">
          <PreviewPane />
        </section>
      </div>
    </div>
  );
}
