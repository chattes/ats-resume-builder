import { z } from "zod";

export const TEMPLATE_IDS = [
  "classic",
  "modern",
  "compact",
  "minimal",
  "bold-name",
  "executive",
  "underlined",
  "two-tone",
  "detailed",
  "simple-sans",
] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];
export type PersonaId = "tech" | "healthcare" | "finance" | "education";
export type PageSize = "Letter" | "A4";
export type SafeFont =
  | "Calibri"
  | "Arial"
  | "Helvetica"
  | "Georgia"
  | "Garamond"
  | "Times New Roman"
  | "Cambria";

export const SECTION_HEADINGS = {
  summary: "Professional Summary",
  skills: "Skills",
  experience: "Work Experience",
  education: "Education",
  certifications: "Certifications",
  projects: "Projects",
} as const;

const emailField = z.string().refine(
  (v) => v === "" || z.string().email().safeParse(v).success,
  { message: "Invalid email" }
);

export const resumeSchema = z.object({
  contact: z.object({
    fullName: z.string(),
    title: z.string().optional(),
    email: emailField,
    phone: z.string(),
    location: z.string().optional(),
    links: z
      .array(z.object({ label: z.string(), url: z.string() }))
      .optional(),
  }),
  summary: z.string(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      location: z.string().optional(),
      start: z.string(),
      end: z.union([z.string(), z.literal("Present")]),
      bullets: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      school: z.string(),
      degree: z.string(),
      location: z.string().optional(),
      start: z.string().optional(),
      end: z.string(),
      details: z.array(z.string()).optional(),
    })
  ),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string().optional(),
        year: z.string().optional(),
      })
    )
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        bullets: z.array(z.string()).optional(),
      })
    )
    .optional(),
  customSections: z
    .array(z.object({ heading: z.string(), items: z.array(z.string()) }))
    .optional(),
  meta: z.object({
    template: z.enum(TEMPLATE_IDS),
    accentHex: z.string(),
    pageSize: z.enum(["Letter", "A4"]),
    persona: z
      .enum(["tech", "healthcare", "finance", "education"])
      .optional(),
  }),
});

export type Resume = z.infer<typeof resumeSchema>;
