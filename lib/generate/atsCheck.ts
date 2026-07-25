import { isContrastSafe } from "@/lib/accents";
import type { Resume } from "@/lib/schema";
import { TEMPLATE_IDS } from "@/lib/schema";
import { getTemplate } from "@/lib/templates";

export type AtsCheckResult = {
  ok: boolean;
  checks: { id: string; label: string; pass: boolean }[];
};

export function atsCheck(resume: Resume): AtsCheckResult {
  const template = getTemplate(resume.meta.template);
  const checks = [
    {
      id: "has-name",
      label: "Name present",
      pass: resume.contact.fullName.trim().length > 0,
    },
    {
      id: "has-contact",
      label: "Email or phone present",
      pass:
        resume.contact.email.trim().length > 0 ||
        resume.contact.phone.trim().length > 0,
    },
    {
      id: "single-column",
      label: "Single-column layout",
      pass: true,
    },
    {
      id: "safe-template",
      label: "Template is ATS-safe",
      pass: (TEMPLATE_IDS as readonly string[]).includes(resume.meta.template),
    },
    {
      id: "has-summary",
      label: "Summary present",
      pass: resume.summary.trim().length >= 40,
    },
    {
      id: "has-experience-or-education",
      label: "Experience or education present",
      pass: resume.experience.length > 0 || resume.education.length > 0,
    },
    {
      id: "standard-headings",
      label: "Standard section headings",
      pass: true,
    },
    {
      id: "accent-contrast",
      label: "Accent contrast safe",
      pass: template.accentUse === "none" || isContrastSafe(resume.meta.accentHex),
    },
  ];

  return { ok: checks.every((c) => c.pass), checks };
}
