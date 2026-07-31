import type { PersonaId } from "@/lib/schema";

// Set NEXT_PUBLIC_SITE_URL in Vercel once a domain is connected.
export const SITE = {
  name: "ATS Resume Builder",
  brand: "BrightByteTreasures",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://ats-resume-builder.vercel.app",
  tagline:
    "Build a genuinely ATS-safe résumé — free, no sign-up. Export .docx and PDF. Your data never leaves your browser.",
};

export type NavLink = { href: string; label: string };

export const NAV: NavLink[] = [
  { href: "/editor", label: "Build résumé" },
  { href: "/ats-resume-checker", label: "ATS checker" },
  { href: "/linkedin-to-resume", label: "LinkedIn → résumé" },
  { href: "/why-ats-resume", label: "Why ATS?" },
];

export type PersonaPage = {
  slug: string; // URL segment, e.g. "nurse-resume-builder"
  persona: PersonaId; // maps to a builder preset
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  points: { title: string; body: string }[];
  keywords: string[];
};

export const PERSONA_PAGES: PersonaPage[] = [
  {
    slug: "nurse-resume-builder",
    persona: "healthcare",
    h1: "Free ATS Nurse Résumé Builder",
    metaTitle: "Free ATS Nurse Résumé Builder (Word & PDF) — No Sign-Up",
    metaDescription:
      "Build an ATS-friendly nursing résumé free. RN, BSN and new-grad ready, with licenses and certifications up top. Export .docx and PDF. No sign-up.",
    intro:
      "Hospitals screen applications with ATS software before a recruiter sees them. This free builder keeps your nursing résumé single-column and parse-safe, with your license and certifications where recruiters look first.",
    points: [
      { title: "Licenses first", body: "RN, BLS, ACLS and more sit near the top, formatted so the ATS reads them correctly." },
      { title: "Clinical keywords", body: "Start from a nursing sample with patient-care, EHR/Epic and HIPAA phrasing you can edit." },
      { title: "New-grad friendly", body: "Highlight clinical rotations and education when experience is light." },
    ],
    keywords: ["nurse resume", "nursing resume template", "rn resume", "ats nurse resume", "new grad nurse resume"],
  },
  {
    slug: "tech-resume-builder",
    persona: "tech",
    h1: "Free ATS Tech Résumé Builder",
    metaTitle: "Free ATS Tech / Software Résumé Builder (Word & PDF)",
    metaDescription:
      "Build an ATS-friendly software engineer résumé free. Skills, projects and quantified impact, single-column and parse-safe. Export .docx and PDF. No sign-up.",
    intro:
      "Tech recruiters and ATS both scan for stack keywords and measurable impact. This free builder keeps your engineering résumé clean and machine-readable while you focus on the wins.",
    points: [
      { title: "Skills that parse", body: "List your stack as plain, scannable text — no skill bars or graphics that break ATS." },
      { title: "Projects section", body: "Show side projects and open-source work alongside experience." },
      { title: "Impact bullets", body: "Start from a sample full of quantified, results-first bullet points." },
    ],
    keywords: ["tech resume", "software engineer resume", "developer resume", "ats tech resume", "engineering resume template"],
  },
  {
    slug: "finance-resume-builder",
    persona: "finance",
    h1: "Free ATS Finance Résumé Builder",
    metaTitle: "Free ATS Finance & Accounting Résumé Builder (Word & PDF)",
    metaDescription:
      "Build an ATS-friendly finance résumé free. CPA, analyst and accounting ready, with certifications and metric-driven bullets. Export .docx and PDF. No sign-up.",
    intro:
      "Finance roles are competitive and heavily ATS-screened. This free builder keeps your résumé conservative, single-column and parse-safe, with certifications and quantified results front and center.",
    points: [
      { title: "Certifications up top", body: "CPA, CFA and MBA sit where finance recruiters expect them." },
      { title: "Metric-driven", body: "Start from a sample with budgets, variances and dollar-impact bullets." },
      { title: "Conservative design", body: "Clean, professional formatting suited to finance and banking." },
    ],
    keywords: ["finance resume", "accountant resume", "cpa resume", "financial analyst resume", "ats finance resume"],
  },
  {
    slug: "teacher-resume-builder",
    persona: "education",
    h1: "Free ATS Teacher Résumé Builder",
    metaTitle: "Free ATS Teacher & Education Résumé Builder (Word & PDF)",
    metaDescription:
      "Build an ATS-friendly teacher résumé free. Licenses, certifications and classroom impact, single-column and parse-safe. Export .docx and PDF. No sign-up.",
    intro:
      "School districts use ATS too. This free builder keeps your teaching résumé parse-safe, with your state license and certifications prominent and classroom results easy to scan.",
    points: [
      { title: "License prominent", body: "State teaching certification and endorsements sit near the top." },
      { title: "Classroom impact", body: "Start from a sample with curriculum, differentiation and outcome bullets." },
      { title: "K-12 ready", body: "Structured for classroom teachers and school staff roles." },
    ],
    keywords: ["teacher resume", "education resume", "teaching resume template", "ats teacher resume", "school resume"],
  },
];

export function getPersonaPage(slug: string): PersonaPage | undefined {
  return PERSONA_PAGES.find((p) => p.slug === slug);
}
