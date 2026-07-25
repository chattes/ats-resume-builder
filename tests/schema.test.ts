import { describe, it, expect } from "vitest";
import { resumeSchema } from "@/lib/schema";
import { emptyResume } from "@/lib/defaults";

describe("resumeSchema", () => {
  it("accepts emptyResume()", () => {
    const r = emptyResume();
    const parsed = resumeSchema.safeParse(r);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid email when provided non-empty", () => {
    const r = emptyResume();
    r.contact.email = "not-an-email";
    // email can be empty string during draft; if non-empty must be valid
    const parsed = resumeSchema.safeParse(r);
    expect(parsed.success).toBe(false);
  });
});
