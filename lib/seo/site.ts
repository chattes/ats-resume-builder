import type { Metadata } from "next";
import type { PersonaId } from "@/lib/schema";

// Canonical site URL. Override with NEXT_PUBLIC_SITE_URL in Vercel if needed.
// Primary domain is the apex; make sure Vercel redirects www → apex.
export const SITE = {
  name: "ATS Resume Builder",
  brand: "BrightByteTreasures",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://proresume.store",
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

/** Shared metadata builder — gives every page a canonical + OpenGraph + Twitter card. */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string; // e.g. "/nurse-resume-builder" or "/"
  keywords?: string[];
}): Metadata {
  const { title, description, path, keywords } = opts;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title,
      description,
      url: path,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export type PersonaPage = {
  slug: string;
  persona: PersonaId;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  points: { title: string; body: string }[];
  sampleBullets: string[];
  faqs: { q: string; a: string }[];
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
    sampleBullets: [
      "Provided direct patient care for 5–6 acute med-surg patients per shift, maintaining zero medication errors over 18 months.",
      "Documented assessments, interventions and outcomes in Epic with 100% chart completion before end of shift.",
      "Precepted 3 new-graduate nurses on patient-care workflows, medication safety and infection-control standards.",
    ],
    faqs: [
      { q: "Is this nursing résumé ATS-friendly?", a: "Yes. It uses a single-column layout, standard headings, and keeps your name, license and contact details in the body where applicant tracking systems can read them." },
      { q: "I'm a new grad with little experience — will it work?", a: "Yes. Lead with your education, clinical rotations and certifications; the builder lets you reorder sections so your strongest content comes first." },
      { q: "Should I send a Word file or PDF to hospitals?", a: "A text-based .docx is the safest choice for most hospital ATS. You can export both free here." },
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
    sampleBullets: [
      "Led migration of a monolith to microservices on AWS, cutting deploy time 60% and improving p99 latency 35% for 2M+ monthly users.",
      "Built CI/CD pipelines with GitHub Actions and Terraform, enabling 40+ engineers to ship safely multiple times per day.",
      "Optimized PostgreSQL queries and Redis caching to hold a 99.95% uptime SLA at 10k requests per second.",
    ],
    faqs: [
      { q: "How do I list my tech stack so the ATS reads it?", a: "As plain comma-separated text in a Skills section. Avoid skill bars, ratings or icons — ATS parsers can't read graphics." },
      { q: "Can I include GitHub and side projects?", a: "Yes. The builder has a Projects section so you can show open-source and personal work with links and quantified results." },
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
    sampleBullets: [
      "Owned monthly forecasting and rolling 12-month outlook for a $400M revenue portfolio, improving forecast accuracy from 88% to 96%.",
      "Led GAAP-compliant month-end close, shortening the cycle from 10 to 6 business days.",
      "Built driver-based financial models used by the CFO for board packs and two successful capital raises totaling $75M.",
    ],
    faqs: [
      { q: "Where should certifications like CPA go?", a: "Near the top. Finance recruiters and ATS look for CPA, CFA or MBA early, so the builder places a certifications section prominently." },
      { q: "Is a conservative design better for finance?", a: "Yes. Finance favours clean, single-column, no-frills formatting — which is exactly what keeps a résumé ATS-safe." },
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
    sampleBullets: [
      "Designed and taught differentiated ELA curriculum for 120+ students, raising reading proficiency 18% year over year.",
      "Implemented data-driven small-group instruction, moving 30% of below-grade readers to grade level within one semester.",
      "Led a grade-level PLC and mentored two first-year teachers on classroom management and assessment.",
    ],
    faqs: [
      { q: "Where do I put my teaching license?", a: "Near the top. Districts screen for a valid state certification and endorsements, so the builder keeps a licenses/certifications section prominent." },
      { q: "Can I show classroom results without student data?", a: "Yes — use aggregate outcomes like proficiency gains, attendance or program growth rather than individual student information." },
    ],
    keywords: ["teacher resume", "education resume", "teaching resume template", "ats teacher resume", "school resume"],
  },
];

export function getPersonaPage(slug: string): PersonaPage | undefined {
  return PERSONA_PAGES.find((p) => p.slug === slug);
}
