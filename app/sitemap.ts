import type { MetadataRoute } from "next";
import { SITE, PERSONA_PAGES } from "@/lib/seo/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "/editor",
    "/ats-resume-checker",
    "/linkedin-to-resume",
    "/why-ats-resume",
    ...PERSONA_PAGES.map((p) => `/${p.slug}`),
  ];
  return routes.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/editor" ? 0.9 : 0.7,
  }));
}
