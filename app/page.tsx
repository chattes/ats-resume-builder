import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { PERSONA_PAGES, SITE, pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "Free ATS Resume Builder — Word & PDF, No Sign-Up",
  description: SITE.tagline,
  path: "/",
  keywords: [
    "ats resume builder",
    "free resume builder",
    "ats friendly resume",
    "resume builder no sign up",
    "ats resume checker",
    "linkedin to resume",
  ],
});

const trust = [
  "100% free",
  "No sign-up",
  "Export .docx & PDF",
  "Data stays in your browser",
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: SITE.url,
    description: SITE.tagline,
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <p className="text-sm font-medium tracking-wide text-cyan-400 uppercase">
          {SITE.brand}
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          Free ATS Resume Builder
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">{SITE.tagline}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/editor"
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-indigo-400"
          >
            Build my résumé free
          </Link>
          <Link
            href="/linkedin-to-resume"
            className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/50"
          >
            Import from LinkedIn / PDF
          </Link>
        </div>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
          {trust.map((t) => (
            <li key={t}>✓ {t}</li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-lg font-semibold text-slate-200">
          Built for your field
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONA_PAGES.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-left transition hover:border-cyan-500/50 hover:bg-slate-900"
            >
              <div className="text-base font-semibold text-cyan-300">
                {p.h1.replace("Free ATS ", "").replace(" Builder", "")}
              </div>
              <p className="mt-1 text-sm text-slate-400">{p.intro.slice(0, 90)}…</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/ats-resume-checker" className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-cyan-500/50">
            <div className="font-semibold text-slate-100">ATS résumé checker</div>
            <p className="mt-1 text-sm text-slate-400">Paste or upload a résumé and see if it’s parse-safe.</p>
          </Link>
          <Link href="/linkedin-to-resume" className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-cyan-500/50">
            <div className="font-semibold text-slate-100">LinkedIn / PDF → résumé</div>
            <p className="mt-1 text-sm text-slate-400">Turn your LinkedIn PDF into an editable, ATS-friendly résumé.</p>
          </Link>
          <Link href="/why-ats-resume" className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-cyan-500/50">
            <div className="font-semibold text-slate-100">Why an ATS résumé?</div>
            <p className="mt-1 text-sm text-slate-400">What an ATS is and the rules that get you through it.</p>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
