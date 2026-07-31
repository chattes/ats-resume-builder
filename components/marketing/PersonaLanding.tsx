import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { PERSONA_PAGES, getPersonaPage, SITE } from "@/lib/seo/site";

export function PersonaLanding({ slug }: { slug: string }) {
  const page = getPersonaPage(slug);
  if (!page) return null;
  const others = PERSONA_PAGES.filter((p) => p.slug !== slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: page.h1,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `${SITE.url}/${page.slug}`,
    description: page.metaDescription,
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-medium tracking-wide text-cyan-400 uppercase">
          Free · No sign-up
        </p>
        <h1 className="mt-3 max-w-3xl bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          {page.h1}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">{page.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/editor?persona=${page.persona}`}
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

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {page.points.map((pt) => (
            <div key={pt.title} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="text-base font-semibold text-cyan-300">{pt.title}</div>
              <p className="mt-2 text-sm text-slate-400">{pt.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="text-xl font-semibold text-slate-100">
            Why it passes the ATS
          </h2>
          <ul className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <li>✓ Single-column layout — no tables or columns that scramble parsers</li>
            <li>✓ Contact details in the body, never hidden in headers/footers</li>
            <li>✓ Standard section headings the ATS recognises</li>
            <li>✓ Export as .docx (the recruiter-safe format) or PDF</li>
          </ul>
          <p className="mt-4 text-sm text-slate-400">
            Prefer to check an existing résumé first? Run it through the free{" "}
            <Link href="/ats-resume-checker" className="text-cyan-300 hover:underline">
              ATS résumé checker
            </Link>.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-lg font-semibold text-slate-200">Other free résumé builders</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/${o.slug}`}
                className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300"
              >
                {o.h1.replace("Free ATS ", "").replace(" Builder", "")}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
