import { PersonaLanding } from "@/components/marketing/PersonaLanding";
import { getPersonaPage, pageMetadata } from "@/lib/seo/site";

const page = getPersonaPage("teacher-resume-builder")!;

export const metadata = pageMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: `/${page.slug}`,
  keywords: page.keywords,
});

export default function Page() {
  return <PersonaLanding slug="teacher-resume-builder" />;
}
