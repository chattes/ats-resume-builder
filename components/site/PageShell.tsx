import Link from "next/link";
import { NAV, SITE, PERSONA_PAGES } from "@/lib/seo/site";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xs font-medium tracking-wide text-cyan-400 uppercase">
              {SITE.brand}
            </span>
          </Link>
          <nav className="hidden gap-5 text-sm text-slate-300 sm:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-cyan-300">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-slate-400">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="font-semibold text-slate-200">{SITE.name}</div>
              <p className="mt-2 max-w-xs text-slate-400">{SITE.tagline}</p>
            </div>
            <div>
              <div className="font-semibold text-slate-200">Résumé builders</div>
              <ul className="mt-2 space-y-1">
                {PERSONA_PAGES.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/${p.slug}`} className="hover:text-cyan-300">
                      {p.h1.replace("Free ATS ", "").replace(" Builder", "")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold text-slate-200">Tools & guides</div>
              <ul className="mt-2 space-y-1">
                <li><Link href="/editor" className="hover:text-cyan-300">Résumé builder</Link></li>
                <li><Link href="/ats-resume-checker" className="hover:text-cyan-300">ATS résumé checker</Link></li>
                <li><Link href="/linkedin-to-resume" className="hover:text-cyan-300">LinkedIn / PDF → résumé</Link></li>
                <li><Link href="/why-ats-resume" className="hover:text-cyan-300">Why an ATS résumé?</Link></li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-xs text-slate-500">
            Free ATS résumé tools. Your résumé data stays in your browser — nothing is uploaded.
          </p>
        </div>
      </footer>
    </div>
  );
}
