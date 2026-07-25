import { describe, it, expect } from "vitest";
import { Packer } from "docx";
import mammoth from "mammoth";
import { getPersona, listPersonas } from "@/lib/personas";
import { resumeToDocxDocument } from "@/lib/generate/docx";
import { resumeSchema } from "@/lib/schema";
import { sectionHeadingLabel } from "@/lib/sections";

describe("personas", () => {
  it("lists 5 personas including trades", () => {
    const list = listPersonas();
    expect(list).toHaveLength(5);
    expect(list.map((p) => p.id)).toContain("trades");
  });

  it("each persona is valid Resume", () => {
    for (const p of listPersonas()) {
      const r = getPersona(p.id);
      expect(resumeSchema.safeParse(r).success).toBe(true);
      expect(r.meta.persona).toBe(p.id);
      expect(r.skills.length).toBeGreaterThanOrEqual(8);
    }
  });

  it("trades promotes licenses/certs before skills in DOCX", async () => {
    const resume = getPersona("trades");
    const buffer = await Packer.toBuffer(resumeToDocxDocument(resume));
    const text = (await mammoth.extractRawText({ buffer })).value.replace(
      /\r/g,
      ""
    );
    const certH = sectionHeadingLabel("certifications", "trades");
    const skillsH = sectionHeadingLabel("skills", "trades");
    const expH = sectionHeadingLabel("experience", "trades");
    const certIdx = text.indexOf(certH);
    const skillsIdx = text.indexOf(skillsH);
    const expIdx = text.indexOf(expH);
    expect(certIdx).toBeGreaterThanOrEqual(0);
    expect(skillsIdx).toBeGreaterThan(certIdx);
    expect(expIdx).toBeGreaterThan(skillsIdx);
    expect(text).toContain("OSHA 30");
    expect(text).toContain("DoorDash");
  });
});
