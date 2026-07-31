import type { Metadata } from "next";
import { PersonaLanding } from "@/components/marketing/PersonaLanding";
import { getPersonaPage } from "@/lib/seo/site";

const page = getPersonaPage("finance-resume-builder")!;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  keywords: page.keywords,
  alternates: { canonical: `/${page.slug}` },
  openGraph: { title: page.metaTitle, description: page.metaDescription, url: `/${page.slug}` },
};

export default function Page() {
  return <PersonaLanding slug="finance-resume-builder" />;
}
