"use client";

import { useMemo, useState, type ReactNode } from "react";
import { getContentSectionOrder, sectionHeadingLabel } from "@/lib/sections";
import { useResume } from "@/lib/store";
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

export function FormAccordion() {
  const { resume } = useResume();
  const persona = resume.meta.persona;

  const sections: Section[] = useMemo(() => {
    const contentForms: Record<string, Section> = {
      summary: {
        id: "summary",
        title: sectionHeadingLabel("summary", persona),
        content: <SummaryForm />,
      },
      skills: {
        id: "skills",
        title: sectionHeadingLabel("skills", persona),
        content: <SkillsForm />,
      },
      experience: {
        id: "experience",
        title: sectionHeadingLabel("experience", persona),
        content: <ExperienceForm />,
      },
      education: {
        id: "education",
        title: sectionHeadingLabel("education", persona),
        content: <EducationForm />,
      },
      certifications: {
        id: "certifications",
        title: sectionHeadingLabel("certifications", persona),
        content: <CertificationsForm />,
      },
      projects: {
        id: "projects",
        title: sectionHeadingLabel("projects", persona),
        content: <ProjectsForm />,
      },
    };

    const ordered = getContentSectionOrder(persona)
      .filter((k) => k !== "customSections")
      .map((k) => contentForms[k])
      .filter(Boolean);

    return [
      { id: "contact", title: "Contact", content: <ContactForm /> },
      ...ordered,
    ];
  }, [persona]);

  const [open, setOpen] = useState<Record<string, boolean>>({
    contact: true,
    summary: true,
    certifications: persona === "trades",
  });

  function toggle(id: string) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="divide-y divide-slate-700">
      {sections.map((s) => {
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
