import { describe, it, expect } from "vitest";
import mammoth from "mammoth";
import { Packer } from "docx";
import JSZip from "jszip";
import { resumeToDocxDocument } from "@/lib/generate/docx";
import { sampleResume } from "./fixtures/sample-resume";
import { TEMPLATE_IDS, SECTION_HEADINGS } from "@/lib/schema";

async function extractText(templateId: (typeof TEMPLATE_IDS)[number]) {
  const resume = { ...sampleResume, meta: { ...sampleResume.meta, template: templateId } };
  const doc = resumeToDocxDocument(resume);
  const buffer = await Packer.toBuffer(doc);
  const result = await mammoth.extractRawText({ buffer });
  return result.value.replace(/\r/g, "");
}

describe("resumeToDocx ATS golden", () => {
  for (const id of TEMPLATE_IDS) {
    it(`${id}: reading order and required fields`, async () => {
      const text = await extractText(id);
      const nameIdx = text.indexOf("Alex Rivera");
      const summaryIdx = text.indexOf(SECTION_HEADINGS.summary);
      const skillsIdx = text.indexOf(SECTION_HEADINGS.skills);
      const expIdx = text.indexOf(SECTION_HEADINGS.experience);
      const eduIdx = text.indexOf(SECTION_HEADINGS.education);

      expect(nameIdx).toBeGreaterThanOrEqual(0);
      expect(text).toContain("alex.rivera@email.com");
      expect(text).toContain("(555) 010-2000");
      expect(summaryIdx).toBeGreaterThan(nameIdx);
      expect(skillsIdx).toBeGreaterThan(summaryIdx);
      expect(expIdx).toBeGreaterThan(skillsIdx);
      expect(eduIdx).toBeGreaterThan(expIdx);
      expect(text).toContain("CloudNine Systems");
      expect(text).toContain("Senior Software Engineer");
    });
  }

  it("OOXML has no tables, headers, or footers", async () => {
    const doc = resumeToDocxDocument(sampleResume);
    const buffer = await Packer.toBuffer(doc);
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")!.async("string");
    expect(documentXml.includes("w:tbl")).toBe(false);
    expect(documentXml.includes("w:hdr")).toBe(false);
    expect(documentXml.includes("w:ftr")).toBe(false);
    expect(zip.file("word/header1.xml")).toBeNull();
    expect(zip.file("word/footer1.xml")).toBeNull();
  });
});
