import { describe, it, expect } from "vitest";
import { listTemplates, getTemplate, TEMPLATES } from "@/lib/templates";
import { TEMPLATE_IDS } from "@/lib/schema";

describe("template catalog", () => {
  it("has exactly 10 templates", () => {
    expect(listTemplates()).toHaveLength(10);
  });

  it("covers every TemplateId", () => {
    for (const id of TEMPLATE_IDS) {
      expect(TEMPLATES[id]).toBeDefined();
      expect(getTemplate(id).id).toBe(id);
    }
  });

  it("only uses safe fonts", () => {
    const safe = new Set([
      "Calibri",
      "Arial",
      "Helvetica",
      "Georgia",
      "Garamond",
      "Times New Roman",
      "Cambria",
    ]);
    for (const t of listTemplates()) {
      expect(safe.has(t.font.body)).toBe(true);
      expect(safe.has(t.font.heading)).toBe(true);
    }
  });
});
