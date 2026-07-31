import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SITE } from "@/lib/seo/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Free ATS Resume Builder — Word & PDF, No Sign-Up",
    template: `%s | ${SITE.name}`,
  },
  description: SITE.tagline,
  applicationName: SITE.name,
  keywords: [
    "ats resume builder",
    "free resume builder",
    "ats friendly resume",
    "resume builder no sign up",
    "resume builder word google docs",
    "ats resume checker",
    "linkedin to resume",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Free ATS Resume Builder — Word & PDF, No Sign-Up",
    description: SITE.tagline,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ATS Resume Builder — Word & PDF, No Sign-Up",
    description: SITE.tagline,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
