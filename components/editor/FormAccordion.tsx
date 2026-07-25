"use client";

import { useState, type ReactNode } from "react";
import { SECTION_HEADINGS } from "@/lib/schema";
import { CertificationsForm } from "./sections/CertificationsForm";
import { ContactForm } from "./sections/ContactForm";
import { EducationForm } from "./sections/EducationForm";
import { ExperienceForm } from "./sections/ExperienceForm";
import { ProjectsForm } from "./sections/ProjectsForm";
import { SkillsForm } from "./sections/SkillsForm";
import { SummaryForm } from "./sections/SummaryForm";

type Section = {
  id: string;
  title: string;
  content: ReactNode;
};

const SECTIONS: Section[] = [
  { id: "contact", title: "Contact", content: <ContactForm /> },
  {
    id: "summary",
    title: SECTION_HEADINGS.summary,
    content: <SummaryForm />,
  },
  { id: "skills", title: SECTION_HEADINGS.skills, content: <SkillsForm /> },
  {
    id: "experience",
    title: SECTION_HEADINGS.experience,
    content: <ExperienceForm />,
  },
  {
    id: "education",
    title: SECTION_HEADINGS.education,
    content: <EducationForm />,
  },
  {
    id: "certifications",
    title: SECTION_HEADINGS.certifications,
    content: <CertificationsForm />,
  },
  {
    id: "projects",
    title: SECTION_HEADINGS.projects,
    content: <ProjectsForm />,
  },
];

export function FormAccordion() {
  const [open, setOpen] = useState<Record<string, boolean>>({
    contact: true,
    summary: true,
  });

  function toggle(id: string) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="divide-y divide-slate-700">
      {SECTIONS.map((s) => {
        const isOpen = !!open[s.id];
        return (
          <div key={s.id}>
            <button
              type="button"
              onClick={() => toggle(s.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold text-slate-100 hover:bg-slate-800/60"
            >
              {s.title}
              <span className="text-slate-500" aria-hidden>
                {isOpen ? "▾" : "▸"}
              </span>
            </button>
            {isOpen && <div className="px-3 pb-4">{s.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
