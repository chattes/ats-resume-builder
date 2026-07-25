import { describe, it, expect } from "vitest";
import { analyzeKeywords } from "@/lib/keywords";

describe("analyzeKeywords", () => {
  it("finds matched and missing", () => {
    const resume = "Built Python APIs on AWS with Docker and Kubernetes";
    const jd = "Looking for Python AWS Terraform Docker experience";
    const r = analyzeKeywords(resume, jd);
    expect(r.matched).toEqual(expect.arrayContaining(["python", "aws", "docker"]));
    expect(r.missing).toEqual(expect.arrayContaining(["terraform"]));
  });
});
