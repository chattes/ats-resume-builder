import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { AtsChecker } from "@/components/tools/AtsChecker";

export const metadata: Metadata = {
  title: "Free ATS Résumé Checker — Test Your Résumé Instantly",
  description:
    "Paste or upload your résumé and get an instant ATS-readiness check: contact details, standard sections, length and formatting. Free, in-browser, no sign-up.",
  keywords: [
    "ats resume checker",
    "resume ats checker free",
    "ats resume scanner",
    "check resume ats",
    "ats resume test",
  ],
  alternates: { canonical: "/ats-resume-checker" },
  openGraph: {
    title: "Free ATS Résumé Checker — Test Your Résumé Instantly",
    description: "Instant ATS-readiness check. Free and in-browser.",
    url: "/ats-resume-checker",
  },
};

export default function Page() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium tracking-wide text-cyan-400 uppercase">Free · In-browser</p>
        <h1 className="mt-3 bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent">
          Free ATS résumé checker
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Paste your résumé text (or upload a PDF) for an instant read on how ATS-friendly it is —
          contact details, standard sections, length and bullet formatting. Nothing is uploaded; the
          check runs in your browser.
        </p>

        <div className="mt-10">
          <AtsChecker />
        </div>

        <div className="mt-10 text-sm text-slate-400">
          Want a résumé that passes by design?{" "}
          <Link href="/editor" className="text-cyan-300 hover:underline">Build one free</Link>{" "}
          or learn{" "}
          <Link href="/why-ats-resume" className="text-cyan-300 hover:underline">why ATS formatting matters</Link>.
        </div>
      </section>
    </PageShell>
  );
}
