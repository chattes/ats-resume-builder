import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { PdfToResume } from "@/components/tools/PdfToResume";

export const metadata: Metadata = {
  title: "LinkedIn to Résumé — Free PDF → ATS-Friendly Résumé",
  description:
    "Turn your LinkedIn profile PDF (or any résumé PDF) into a clean, ATS-friendly résumé you can edit and export as .docx or PDF. Free, in-browser, no sign-up.",
  keywords: [
    "linkedin to resume",
    "linkedin pdf to resume",
    "pdf to ats resume",
    "convert linkedin to resume",
    "resume from linkedin free",
  ],
  alternates: { canonical: "/linkedin-to-resume" },
  openGraph: {
    title: "LinkedIn to Résumé — Free PDF → ATS-Friendly Résumé",
    description:
      "Convert your LinkedIn PDF into an editable, ATS-safe résumé. Free and in-browser.",
    url: "/linkedin-to-resume",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Convert a LinkedIn PDF into an ATS-friendly résumé",
    step: [
      { "@type": "HowToStep", text: "On LinkedIn, open your profile, click More, then Save to PDF." },
      { "@type": "HowToStep", text: "Upload that PDF here — it is read in your browser." },
      { "@type": "HowToStep", text: "Review the imported draft and refine it in the editor." },
      { "@type": "HowToStep", text: "Export a clean, ATS-safe .docx or PDF." },
    ],
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium tracking-wide text-cyan-400 uppercase">Free · In-browser</p>
        <h1 className="mt-3 bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent">
          LinkedIn → ATS-friendly résumé
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Already have your career history on LinkedIn? Export it as a PDF and turn it into a clean,
          single-column, ATS-safe résumé in seconds. Everything happens in your browser — your PDF is
          never uploaded to a server.
        </p>

        <div className="mt-10">
          <PdfToResume />
        </div>

        <div className="mt-10 text-sm text-slate-400">
          Rather start fresh?{" "}
          <Link href="/editor" className="text-cyan-300 hover:underline">Build a résumé from scratch</Link>{" "}
          or read{" "}
          <Link href="/why-ats-resume" className="text-cyan-300 hover:underline">why ATS formatting matters</Link>.
        </div>
      </section>
    </PageShell>
  );
}
