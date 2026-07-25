import { describe, it, expect } from "vitest";
import { resumeToHtml } from "@/lib/generate/html";
import { getPersona } from "@/lib/personas";
import { SECTION_HEADINGS } from "@/lib/schema";
import { sectionHeadingLabel } from "@/lib/sections";
import { sampleResume } from "./fixtures/sample-resume";

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

describe("resumeToHtml reading order", () => {
  it("default order: name → summary → skills → experience → education", () => {
    const html = resumeToHtml(sampleResume);
    expect(html).toContain('id="resume-print-root"');
    expect(html).not.toContain("display:flex");
    const text = stripTags(html);
    const nameIdx = text.indexOf("Alex Rivera");
    const summaryIdx = text.indexOf(SECTION_HEADINGS.summary);
    const skillsIdx = text.indexOf(SECTION_HEADINGS.skills);
    const expIdx = text.indexOf(SECTION_HEADINGS.experience);
    const eduIdx = text.indexOf(SECTION_HEADINGS.education);
    expect(nameIdx).toBeGreaterThanOrEqual(0);
    expect(summaryIdx).toBeGreaterThan(nameIdx);
    expect(skillsIdx).toBeGreaterThan(summaryIdx);
    expect(expIdx).toBeGreaterThan(skillsIdx);
    expect(eduIdx).toBeGreaterThan(expIdx);
  });

  it("trades order: certs before skills", () => {
    const html = resumeToHtml(getPersona("trades"));
    const text = stripTags(html);
    const certH = sectionHeadingLabel("certifications", "trades");
    const skillsH = sectionHeadingLabel("skills", "trades");
    expect(text.indexOf(certH)).toBeGreaterThanOrEqual(0);
    expect(text.indexOf(skillsH)).toBeGreaterThan(text.indexOf(certH));
  });
});
