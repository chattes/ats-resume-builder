import type { PersonaId, Resume } from "@/lib/schema";
import { SECTION_HEADINGS } from "@/lib/schema";

export const PERSONA_IDS = [
  "tech",
  "healthcare",
  "finance",
  "education",
  "trades",
] as const satisfies readonly PersonaId[];

export type ContentSection =
  | "summary"
  | "certifications"
  | "skills"
  | "experience"
  | "education"
  | "projects"
  | "customSections";

/** Default office order vs trades/gig (certs promoted after summary). */
export function getContentSectionOrder(
  persona?: PersonaId
): ContentSection[] {
  if (persona === "trades") {
    return [
      "summary",
      "certifications",
      "skills",
      "experience",
      "education",
      "projects",
      "customSections",
    ];
  }
  return [
    "summary",
    "skills",
    "experience",
    "education",
    "certifications",
    "projects",
    "customSections",
  ];
}

export function sectionHeadingLabel(
  key: Exclude<ContentSection, "customSections">,
  persona?: PersonaId
): string {
  if (key === "certifications" && persona === "trades") {
    return "Licenses & Certifications";
  }
  return SECTION_HEADINGS[key];
}

export function plainTextFromResume(resume: Resume): string {
  const chunks: string[] = [
    resume.contact.fullName,
    resume.contact.title ?? "",
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location ?? "",
    resume.summary,
    ...resume.skills,
    ...resume.experience.flatMap((j) => [
      j.role,
      j.company,
      ...j.bullets,
    ]),
    ...resume.education.flatMap((e) => [e.degree, e.school, ...(e.details ?? [])]),
    ...(resume.certifications ?? []).map((c) =>
      [c.name, c.issuer, c.year].filter(Boolean).join(" ")
    ),
    ...(resume.projects ?? []).flatMap((p) => [
      p.name,
      p.description,
      ...(p.bullets ?? []),
    ]),
  ];
  return chunks.filter(Boolean).join(" ");
}
