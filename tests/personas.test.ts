import { describe, it, expect } from "vitest";
import { getPersona, listPersonas } from "@/lib/personas";
import { resumeSchema } from "@/lib/schema";

describe("personas", () => {
  it("lists 4 personas", () => {
    expect(listPersonas()).toHaveLength(4);
  });

  it("each persona is valid Resume", () => {
    for (const p of listPersonas()) {
      const r = getPersona(p.id);
      expect(resumeSchema.safeParse(r).success).toBe(true);
      expect(r.meta.persona).toBe(p.id);
      expect(r.skills.length).toBeGreaterThanOrEqual(8);
    }
  });
});
