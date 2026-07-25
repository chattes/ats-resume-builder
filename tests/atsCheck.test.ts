import { describe, it, expect } from "vitest";
import { atsCheck } from "@/lib/generate/atsCheck";
import { sampleResume } from "./fixtures/sample-resume";
import { emptyResume } from "@/lib/defaults";

describe("atsCheck", () => {
  it("sample resume is ATS ok", () => {
    expect(atsCheck(sampleResume).ok).toBe(true);
  });

  it("empty resume fails name/contact", () => {
    const r = atsCheck(emptyResume());
    expect(r.ok).toBe(false);
    expect(r.checks.find((c) => c.id === "has-name")?.pass).toBe(false);
  });
});
