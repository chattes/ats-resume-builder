import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { SITE, pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "Why an ATS Résumé Matters (and How to Pass) — 2026 Guide",
  description:
    "What an ATS is, why most résumé templates fail it, and the formatting rules that get your résumé parsed correctly in 2026. Then build one free.",
  path: "/why-ats-resume",
  keywords: [
    "why ats resume",
    "what is an ats",
    "ats friendly resume format",
    "how to pass ats",
    "ats resume rules 2026",
  ],
});

const faqs = [
  {
    q: "What is an ATS?",
    a: "An Applicant Tracking System is software employers use to collect, parse and rank résumés. Most mid-to-large employers use one, so your résumé is usually read by software before any human sees it.",
  },
  {
    q: "Why do so many résumé templates fail the ATS?",
    a: "Multi-column layouts, tables, text boxes and graphics look nice but scramble when the ATS extracts text — so your experience, dates or contact details can end up jumbled or dropped.",
  },
  {
    q: "Is a PDF or Word file better for ATS?",
    a: "A text-based .docx is the safest choice for most systems. A text-based PDF is usually fine too, but never submit a scanned or image-only PDF.",
  },
  {
    q: "Do I need special software?",
    a: "No. This free builder keeps your résumé single-column and parse-safe automatically, and exports .docx and PDF with no sign-up.",
  },
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent">
          Why an ATS résumé matters
        </h1>
        <p className="mt-5 text-lg text-slate-300">
          Before a recruiter reads your résumé, software usually reads it first. If that software —
          an Applicant Tracking System — can’t parse your résumé, you can be filtered out no matter
          how strong your experience is. Here’s how it works and how to stay safe.
        </p>

        <h2 className="mt-12 text-2xl font-semibold text-slate-100">How the ATS reads your résumé</h2>
        <p className="mt-3 text-slate-300">
          An ATS extracts the text from your file and tries to sort it into fields: name, contact,
          work history, education, skills. It reads left-to-right, top-to-bottom. Anything that
          disrupts that flow — a sidebar, a two-column layout, a table, an icon standing in for text —
          can be read out of order or skipped entirely.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-100">The rules that keep you safe</h2>
        <ul className="mt-4 space-y-2 text-slate-300">
          <li>• Use a <strong>single-column</strong> layout — no columns, tables or text boxes.</li>
          <li>• Put your <strong>name and contact details in the body</strong>, not in the header or footer.</li>
          <li>• Use <strong>standard section headings</strong>: Summary, Skills, Work Experience, Education.</li>
          <li>• Stick to <strong>standard fonts</strong> and real bullet points — no graphics carrying information.</li>
          <li>• Export a <strong>text-based .docx</strong> (or text-based PDF) — never a scanned image.</li>
          <li>• Mirror keywords from the job posting in your skills and bullets.</li>
        </ul>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-slate-200">
            This builder applies every one of these rules for you automatically — there’s no way to
            accidentally produce a non-ATS-safe résumé.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/editor"
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:from-cyan-400 hover:to-indigo-400"
            >
              Build a free ATS résumé
            </Link>
            <Link
              href="/ats-resume-checker"
              className="rounded-lg border border-slate-700 px-6 py-2.5 text-sm font-semibold text-slate-200 hover:border-cyan-500/50"
            >
              Check my current résumé
            </Link>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-semibold text-slate-100">FAQ</h2>
        <div className="mt-4 space-y-6">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold text-slate-100">{f.q}</h3>
              <p className="mt-1 text-slate-300">{f.a}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-xs text-slate-500">
          {SITE.name} — free ATS résumé tools. Your data never leaves your browser.
        </p>
      </article>
    </PageShell>
  );
}
