# ATS Resume Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a client-side Next.js app where users fill a form, see a live ATS-safe preview, and export .docx + PDF — with 10 templates, 4 personas, localStorage, ATS self-check, and keyword matching.

**Architecture:** Single Resume JSON is the source of truth. Pure generators (`resumeToDocx`, `resumeToHtml`, `atsCheck`) never emit non-compliant structure. UI is form + preview; no backend.

**Tech Stack:** Next.js 15 (App Router, static export), TypeScript, Tailwind CSS, Zod, `docx`, mammoth (tests), Vitest, localStorage

## Global Constraints

- Project root: `D:\Etsy Business\ats-resume-builder`
- Remote: `https://github.com/chattes/ats-resume-builder.git`
- Always commit meaningful changes; push when remote is available
- ATS invariants: single column, no tables, contact in body (not header/footer), safe fonts only, standard section headings, margins 0.5"–1"
- Safe fonts: Calibri, Arial, Helvetica, Georgia, Garamond, Times New Roman, Cambria
- Section vocabulary: "Professional Summary", "Skills", "Work Experience", "Education", "Certifications", "Projects"
- Page sizes: Letter | A4
- Personas: tech | healthcare | finance | education
- 10 templates: classic, modern, compact, minimal, bold-name, executive, underlined, two-tone, detailed, simple-sans
- No auth, no server, no AI in MVP
- `output: 'export'` for static hosting

## File Map

```
ats-resume-builder/
  package.json
  tsconfig.json
  next.config.ts
  tailwind.config.ts
  postcss.config.mjs
  vitest.config.ts
  .gitignore
  README.md
  app/
    layout.tsx
    page.tsx                 # landing + persona pick
    editor/page.tsx
    globals.css
  components/
    Landing.tsx
    editor/
      EditorShell.tsx
      Toolbar.tsx
      FormAccordion.tsx
      sections/
        ContactForm.tsx
        SummaryForm.tsx
        SkillsForm.tsx
        ExperienceForm.tsx
        EducationForm.tsx
        CertificationsForm.tsx
        ProjectsForm.tsx
      PreviewPane.tsx
      KeywordPanel.tsx
      AtsBadge.tsx
  lib/
    schema.ts
    defaults.ts
    store.tsx
    accents.ts
    keywords.ts
    personas/
      index.ts
      tech.ts
      healthcare.ts
      finance.ts
      education.ts
    templates/
      index.ts
      types.ts
      catalog.ts
    generate/
      docx.ts
      html.ts
      atsCheck.ts
      download.ts
  styles/
    print.css
  tests/
    fixtures/sample-resume.ts
    schema.test.ts
    templates.test.ts
    docx-ats.test.ts
    atsCheck.test.ts
    keywords.test.ts
  docs/superpowers/...
```

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `.gitignore`, `README.md`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

**Interfaces:**
- Produces: runnable `npm run dev`, `npm test`, TypeScript path alias `@/*` → project root

- [ ] **Step 1: Create package.json and config files**

```json
{
  "name": "ats-resume-builder",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "docx": "^9.5.0",
    "file-saver": "^2.0.5",
    "next": "^15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@types/file-saver": "^2.0.7",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "mammoth": "^1.9.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.8.0",
    "vitest": "^3.0.0"
  }
}
```

`next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

`postcss.config.mjs`:
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

`.gitignore`:
```
node_modules
.next
out
dist
*.log
.DS_Store
.env*
```

`app/globals.css`:
```css
@import "tailwindcss";
@import "../styles/print.css";

:root {
  --bg: #0f172a;
  --card: #1e293b;
  --accent: #22d3ee;
  --text: #f8fafc;
  --muted: #94a3b8;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, sans-serif;
}
```

`styles/print.css`:
```css
@media print {
  body * {
    visibility: hidden;
  }
  #resume-print-root,
  #resume-print-root * {
    visibility: visible;
  }
  #resume-print-root {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: white;
    color: black;
  }
  .no-print {
    display: none !important;
  }
}
```

`app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATS Resume Builder | BrightByteTreasures",
  description: "Build a genuinely ATS-safe résumé. Export .docx and PDF. Data stays in your browser.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
```

`app/page.tsx` (placeholder until Task 8):
```tsx
export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold text-cyan-300">ATS Resume Builder</h1>
      <p className="mt-2 text-slate-400">Scaffold ready.</p>
    </main>
  );
}
```

`README.md`:
```md
# ATS Resume Builder

Client-side ATS-safe résumé builder. Form → live preview → .docx / PDF.

Data never leaves your browser.

## Dev

\`\`\`bash
npm install
npm run dev
npm test
npm run build
\`\`\`
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`  
Expected: lockfile created, no errors

- [ ] **Step 3: Verify build scaffold**

Run: `npx tsc --noEmit`  
Expected: exit 0 (or only missing-next types until first `next build`)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js ATS resume builder"
```

---

### Task 2: Schema, defaults, accents

**Files:**
- Create: `lib/schema.ts`, `lib/defaults.ts`, `lib/accents.ts`
- Test: `tests/schema.test.ts`

**Interfaces:**
- Produces:
  - `Resume`, `TemplateId`, `PersonaId`, `PageSize`, `SafeFont` types
  - `resumeSchema` (Zod)
  - `emptyResume(): Resume`
  - `ACCENT_PALETTE: { name: string; hex: string }[]`
  - `isContrastSafe(hex: string): boolean`

- [ ] **Step 1: Write failing schema test**

```ts
// tests/schema.test.ts
import { describe, it, expect } from "vitest";
import { resumeSchema, emptyResume } from "@/lib/schema";
import { emptyResume as empty } from "@/lib/defaults";

describe("resumeSchema", () => {
  it("accepts emptyResume()", () => {
    const r = empty();
    const parsed = resumeSchema.safeParse(r);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid email when provided non-empty", () => {
    const r = empty();
    r.contact.email = "not-an-email";
    // email can be empty string during draft; if non-empty must be valid
    const parsed = resumeSchema.safeParse(r);
    expect(parsed.success).toBe(false);
  });
});
```

Note: put `emptyResume` in `lib/defaults.ts` and re-export from schema if cleaner; test imports from `@/lib/defaults` and `@/lib/schema`.

- [ ] **Step 2: Run test — expect FAIL**

Run: `npm test -- tests/schema.test.ts`  
Expected: FAIL module not found

- [ ] **Step 3: Implement schema + defaults + accents**

`lib/schema.ts`:
```ts
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
```

`lib/defaults.ts`:
```ts
import type { Resume } from "./schema";

export function emptyResume(): Resume {
  return {
    contact: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      links: [],
    },
    summary: "",
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    customSections: [],
    meta: {
      template: "modern",
      accentHex: "#1E3A5F",
      pageSize: "Letter",
      persona: undefined,
    },
  };
}
```

`lib/accents.ts`:
```ts
export const ACCENT_PALETTE = [
  { name: "Navy", hex: "#1E3A5F" },
  { name: "Slate", hex: "#334155" },
  { name: "Teal", hex: "#0F766E" },
  { name: "Burgundy", hex: "#7F1D1D" },
  { name: "Forest", hex: "#14532D" },
] as const;

/** Relative luminance contrast vs near-black body (#111) — accents used on white paper. */
export function contrastRatio(hex: string, bg = "#FFFFFF"): number {
  const lum = (h: string) => {
    const n = h.replace("#", "");
    const r = parseInt(n.slice(0, 2), 16) / 255;
    const g = parseInt(n.slice(2, 4), 16) / 255;
    const b = parseInt(n.slice(4, 6), 16) / 255;
    const f = (c: number) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const L1 = lum(hex);
  const L2 = lum(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function isContrastSafe(hex: string): boolean {
  return contrastRatio(hex) >= 4.5;
}
```

Fix test to import `emptyResume` from `@/lib/defaults` only.

- [ ] **Step 4: Run tests — expect PASS**

Run: `npm test -- tests/schema.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/schema.ts lib/defaults.ts lib/accents.ts tests/schema.test.ts
git commit -m "feat: add Resume schema, defaults, and accent palette"
```

---

### Task 3: Template catalog (all 10)

**Files:**
- Create: `lib/templates/types.ts`, `lib/templates/catalog.ts`, `lib/templates/index.ts`
- Test: `tests/templates.test.ts`

**Interfaces:**
- Produces:
  - `Template` type (design tokens)
  - `TEMPLATES: Record<TemplateId, Template>`
  - `getTemplate(id: TemplateId): Template`
  - `listTemplates(): Template[]`

- [ ] **Step 1: Write failing test**

```ts
// tests/templates.test.ts
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
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement catalog**

`lib/templates/types.ts`:
```ts
import type { SafeFont, TemplateId } from "@/lib/schema";

export type HeadingStyle =
  | "rule-below"
  | "underline"
  | "small-caps"
  | "spaced-caps"
  | "plain-bold"
  | "rule-thick";

export type Template = {
  id: TemplateId;
  name: string;
  description: string;
  font: { heading: SafeFont; body: SafeFont };
  nameStyle: {
    size: number; // pt
    align: "left" | "center";
    caps?: boolean;
    tracking?: number;
    accent?: boolean;
  };
  headingStyle: HeadingStyle;
  divider: "thin" | "thick" | "dotted" | "none";
  accentUse: "headings" | "headings+name" | "headings+dates" | "none";
  density: "compact" | "standard" | "airy";
  bullet: "dot" | "dash" | "square";
};
```

`lib/templates/catalog.ts` — define all 10 per design spec §6 (full objects). Example entries:

```ts
import type { Template } from "./types";
import type { TemplateId } from "@/lib/schema";

export const TEMPLATES: Record<TemplateId, Template> = {
  classic: {
    id: "classic",
    name: "Classic",
    description: "Garamond, centered name, ruled headings — finance/legal",
    font: { heading: "Garamond", body: "Garamond" },
    nameStyle: { size: 22, align: "center" },
    headingStyle: "rule-below",
    divider: "thin",
    accentUse: "headings",
    density: "standard",
    bullet: "dot",
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "Calibri, spaced-caps headings — tech/general",
    font: { heading: "Calibri", body: "Calibri" },
    nameStyle: { size: 20, align: "left" },
    headingStyle: "spaced-caps",
    divider: "thin",
    accentUse: "headings",
    density: "standard",
    bullet: "dot",
  },
  compact: {
    id: "compact",
    name: "Compact",
    description: "Arial, tight spacing — fit one page",
    font: { heading: "Arial", body: "Arial" },
    nameStyle: { size: 18, align: "left" },
    headingStyle: "plain-bold",
    divider: "none",
    accentUse: "none",
    density: "compact",
    bullet: "dash",
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Airy, tracked caps, no rules",
    font: { heading: "Calibri", body: "Calibri" },
    nameStyle: { size: 20, align: "center", tracking: 2 },
    headingStyle: "spaced-caps",
    divider: "none",
    accentUse: "none",
    density: "airy",
    bullet: "dot",
  },
  "bold-name": {
    id: "bold-name",
    name: "Bold Name",
    description: "Large accent name, thick rule",
    font: { heading: "Arial", body: "Arial" },
    nameStyle: { size: 26, align: "left", accent: true },
    headingStyle: "rule-thick",
    divider: "thick",
    accentUse: "headings+name",
    density: "standard",
    bullet: "square",
  },
  executive: {
    id: "executive",
    name: "Executive",
    description: "Georgia, small-caps headings",
    font: { heading: "Georgia", body: "Georgia" },
    nameStyle: { size: 22, align: "center" },
    headingStyle: "small-caps",
    divider: "thin",
    accentUse: "headings",
    density: "standard",
    bullet: "dot",
  },
  underlined: {
    id: "underlined",
    name: "Underlined",
    description: "Underline headings, accent dates",
    font: { heading: "Cambria", body: "Cambria" },
    nameStyle: { size: 20, align: "left" },
    headingStyle: "underline",
    divider: "none",
    accentUse: "headings+dates",
    density: "standard",
    bullet: "dot",
  },
  "two-tone": {
    id: "two-tone",
    name: "Two-Tone",
    description: "Accent headings + dates",
    font: { heading: "Calibri", body: "Calibri" },
    nameStyle: { size: 20, align: "left", accent: true },
    headingStyle: "rule-below",
    divider: "thin",
    accentUse: "headings+dates",
    density: "standard",
    bullet: "dot",
  },
  detailed: {
    id: "detailed",
    name: "Detailed",
    description: "Georgia, airy — education/research",
    font: { heading: "Georgia", body: "Georgia" },
    nameStyle: { size: 20, align: "left" },
    headingStyle: "rule-below",
    divider: "thin",
    accentUse: "headings",
    density: "airy",
    bullet: "dot",
  },
  "simple-sans": {
    id: "simple-sans",
    name: "Simple Sans",
    description: "Pure B/W Arial — max ATS safety",
    font: { heading: "Arial", body: "Arial" },
    nameStyle: { size: 18, align: "left" },
    headingStyle: "plain-bold",
    divider: "none",
    accentUse: "none",
    density: "standard",
    bullet: "dot",
  },
};
```

`lib/templates/index.ts`:
```ts
export * from "./types";
export { TEMPLATES } from "./catalog";
import { TEMPLATES } from "./catalog";
import type { TemplateId } from "@/lib/schema";
import type { Template } from "./types";

export function getTemplate(id: TemplateId): Template {
  return TEMPLATES[id];
}

export function listTemplates(): Template[] {
  return Object.values(TEMPLATES);
}
```

- [ ] **Step 4: Run tests — PASS**

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: add 10 ATS-safe template design configs"
```

---

### Task 4: Persona presets

**Files:**
- Create: `lib/personas/tech.ts`, `healthcare.ts`, `finance.ts`, `education.ts`, `index.ts`
- Test: can extend `tests/schema.test.ts` or `tests/personas.test.ts`

**Interfaces:**
- Produces: `getPersona(id: PersonaId): Resume`, `listPersonas(): { id, name, description }[]`
- Each persona returns a full `Resume` with sample content + `meta.persona` set + `meta.template` sensible default

- [ ] **Step 1: Implement four persona files with realistic sample content**

Each must include: contact, summary (2–4 sentences), 10–15 skills, 2 experience jobs with 3–4 STAR bullets each, education, certifications where relevant, projects for tech.

Tech keywords: Python, Java, Agile, CI/CD, AWS  
Healthcare: Patient care, EHR/Epic, BLS/ACLS, HIPAA  
Finance: CPA, GAAP, forecasting, reconciliation  
Education: curriculum development, IEP/504, Google Classroom, differentiated instruction

- [ ] **Step 2: Export via index**

```ts
// lib/personas/index.ts
import type { PersonaId, Resume } from "@/lib/schema";
import { techPersona } from "./tech";
import { healthcarePersona } from "./healthcare";
import { financePersona } from "./finance";
import { educationPersona } from "./education";

const MAP: Record<PersonaId, () => Resume> = {
  tech: techPersona,
  healthcare: healthcarePersona,
  finance: financePersona,
  education: educationPersona,
};

export function getPersona(id: PersonaId): Resume {
  return structuredClone(MAP[id]());
}

export function listPersonas() {
  return [
    { id: "tech" as const, name: "Tech / Software", description: "Engineers & IT" },
    { id: "healthcare" as const, name: "Healthcare / Nursing", description: "Clinical roles" },
    { id: "finance" as const, name: "Finance / Accounting", description: "Finance pros" },
    { id: "education" as const, name: "Education", description: "Teachers & school staff" },
  ];
}
```

- [ ] **Step 3: Test each persona passes resumeSchema**

```ts
// tests/personas.test.ts
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
```

- [ ] **Step 4: Commit**

```bash
git commit -am "feat: add Tech, Healthcare, Finance, Education persona presets"
```

---

### Task 5: DOCX generator + ATS golden tests

**Files:**
- Create: `lib/generate/docx.ts`, `lib/generate/download.ts`, `tests/fixtures/sample-resume.ts`
- Test: `tests/docx-ats.test.ts`

**Interfaces:**
- Produces:
  - `async function resumeToDocx(resume: Resume): Promise<Blob>`
  - `function downloadBlob(blob: Blob, filename: string): void`
- Consumes: `Resume`, `getTemplate(resume.meta.template)`

**Hard rules in docx.ts:**
- `Document` with one `section`, no `Table`, no `Header`/`Footer`
- Contact as first body paragraphs
- Named styles / direct runs with safe fonts only
- Section titles from `SECTION_HEADINGS`
- Bullets via numbering config
- Dates on same line as role/company using tab stop (`\t`)
- Margins: 720 twips (0.5") minimum

- [ ] **Step 1: Write fixture + failing golden test**

```ts
// tests/fixtures/sample-resume.ts
import type { Resume } from "@/lib/schema";

export const sampleResume: Resume = {
  contact: {
    fullName: "Alex Rivera",
    title: "Software Engineer",
    email: "alex.rivera@email.com",
    phone: "(555) 010-2000",
    location: "Austin, TX",
    links: [{ label: "LinkedIn", url: "https://linkedin.com/in/alexrivera" }],
  },
  summary:
    "Software engineer with 5 years building cloud APIs. Delivered CI/CD pipelines and cut deploy time 2x.",
  skills: [
    "Python",
    "TypeScript",
    "AWS",
    "CI/CD",
    "Agile",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "REST",
    "GraphQL",
  ],
  experience: [
    {
      company: "CloudNine Systems",
      role: "Senior Software Engineer",
      location: "Austin, TX",
      start: "2021-03",
      end: "Present",
      bullets: [
        "Designed APIs serving 2M requests/day with 99.9% uptime",
        "Led migration to Kubernetes, reducing infra cost 28%",
        "Mentored 4 engineers on code review and testing practices",
      ],
    },
    {
      company: "DataSpark",
      role: "Software Engineer",
      location: "Remote",
      start: "2019-06",
      end: "2021-02",
      bullets: [
        "Built ETL jobs processing 50GB daily with Python and Airflow",
        "Improved test coverage from 40% to 85%",
      ],
    },
  ],
  education: [
    {
      school: "University of Texas",
      degree: "B.S. Computer Science",
      location: "Austin, TX",
      end: "2019",
    },
  ],
  certifications: [{ name: "AWS Solutions Architect Associate", year: "2022" }],
  projects: [
    {
      name: "OpenMetric",
      description: "Open-source metrics dashboard",
      bullets: ["1.2k GitHub stars", "Used by 3 internal teams"],
    },
  ],
  meta: {
    template: "modern",
    accentHex: "#1E3A5F",
    pageSize: "Letter",
    persona: "tech",
  },
};
```

```ts
// tests/docx-ats.test.ts
import { describe, it, expect } from "vitest";
import mammoth from "mammoth";
import { Packer } from "docx";
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
});
```

Export both `resumeToDocxDocument(resume): Document` (for tests) and `resumeToDocx(resume): Promise<Blob>` (for UI).

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement `lib/generate/docx.ts`**

Use `docx` API:
- `Document`, `Packer`, `Paragraph`, `TextRun`, `TabStopType`, `TabStopPosition`, `AlignmentType`, `BorderStyle`, `LevelFormat`
- Density maps spacing: compact 120/60, standard 200/120, airy 280/160 (twips after)
- Accent hex applied per `template.accentUse`
- Hex → docx color string without `#`

Key structure order:
1. Name
2. Title (optional)
3. Contact line (email | phone | location | links)
4. Professional Summary
5. Skills (comma or bullet list)
6. Work Experience entries
7. Education
8. Certifications
9. Projects

```ts
// lib/generate/download.ts
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function resumeToDocxBlob(doc: import("docx").Document): Promise<Blob> {
  const { Packer } = await import("docx");
  return Packer.toBlob(doc);
}
```

Actually keep Packer in docx.ts:

```ts
export async function resumeToDocx(resume: Resume): Promise<Blob> {
  const doc = resumeToDocxDocument(resume);
  return Packer.toBlob(doc);
}
```

- [ ] **Step 4: Run golden tests — all 10 PASS**

Run: `npm test -- tests/docx-ats.test.ts`  
Expected: 10 passed

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: ATS-safe docx generator with golden tests for 10 templates"
```

---

### Task 6: HTML preview generator + ATS check

**Files:**
- Create: `lib/generate/html.ts`, `lib/generate/atsCheck.ts`
- Test: `tests/atsCheck.test.ts`

**Interfaces:**
- Produces:
  - `resumeToHtml(resume: Resume): string` — full HTML fragment for preview/print
  - `atsCheck(resume: Resume): AtsCheckResult`
  - `type AtsCheckResult = { ok: boolean; checks: { id: string; label: string; pass: boolean }[] }`

- [ ] **Step 1: Implement html.ts**

Mirror docx visual tokens via inline styles:
- page width Letter 8.5in / A4 210mm, padding 0.6in
- white background, near-black text
- fonts from template
- heading styles (border-bottom for rules, text-transform, letter-spacing, text-decoration)
- Wrap root: `<div id="resume-print-root" class="resume-sheet" data-template="...">`

- [ ] **Step 2: Implement atsCheck**

Checks:
1. `has-name` — fullName non-empty
2. `has-contact` — email or phone
3. `single-column` — always true (invariant)
4. `safe-template` — template id in catalog
5. `has-summary` — summary length >= 40
6. `has-experience-or-education` — at least one
7. `standard-headings` — always true (generator-controlled)
8. `accent-contrast` — `isContrastSafe` or accentUse === none

```ts
export function atsCheck(resume: Resume): AtsCheckResult {
  const checks = [
    { id: "has-name", label: "Name present", pass: resume.contact.fullName.trim().length > 0 },
    // ...
  ];
  return { ok: checks.every((c) => c.pass), checks };
}
```

- [ ] **Step 3: Tests**

```ts
import { atsCheck } from "@/lib/generate/atsCheck";
import { sampleResume } from "./fixtures/sample-resume";
import { emptyResume } from "@/lib/defaults";

it("sample resume is ATS ok", () => {
  expect(atsCheck(sampleResume).ok).toBe(true);
});

it("empty resume fails name/contact", () => {
  const r = atsCheck(emptyResume());
  expect(r.ok).toBe(false);
  expect(r.checks.find((c) => c.id === "has-name")?.pass).toBe(false);
});
```

- [ ] **Step 4: Commit**

```bash
git commit -am "feat: HTML preview renderer and ATS self-check"
```

---

### Task 7: Keyword matcher

**Files:**
- Create: `lib/keywords.ts`
- Test: `tests/keywords.test.ts`

**Interfaces:**
- Produces: `analyzeKeywords(resumeText: string, jobDescription: string): { matched: string[]; missing: string[] }`
- Tokenize: lowercase, strip punctuation, drop stopwords, keep tokens length >= 3 and multi-word phrases from JD that appear as skills-like tokens (simple: unique words from JD with length>=4, max 40 by frequency)

- [ ] **Step 1: Test**

```ts
import { analyzeKeywords } from "@/lib/keywords";

it("finds matched and missing", () => {
  const resume = "Built Python APIs on AWS with Docker and Kubernetes";
  const jd = "Looking for Python AWS Terraform Docker experience";
  const r = analyzeKeywords(resume, jd);
  expect(r.matched).toEqual(expect.arrayContaining(["python", "aws", "docker"]));
  expect(r.missing).toEqual(expect.arrayContaining(["terraform"]));
});
```

- [ ] **Step 2: Implement + commit**

```bash
git commit -am "feat: job-description keyword match helper"
```

---

### Task 8: Store (useReducer + localStorage)

**Files:**
- Create: `lib/store.tsx`

**Interfaces:**
- Produces React context:
  - `ResumeProvider`
  - `useResume(): { resume, dispatch, loadPersona, reset, exportJson, importJson }`
  - Actions: `SET_CONTACT`, `SET_SUMMARY`, `SET_SKILLS`, `SET_META`, `SET_EXPERIENCE`, `ADD_EXPERIENCE`, `REMOVE_EXPERIENCE`, `UPDATE_EXPERIENCE`, same pattern for education/certs/projects, `REPLACE`, `RESET`

- [ ] **Step 1: Implement reducer + localStorage key `ats-resume-builder:v1`**

```ts
const STORAGE_KEY = "ats-resume-builder:v1";

function load(): Resume {
  if (typeof window === "undefined") return emptyResume();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyResume();
    const parsed = resumeSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : emptyResume();
  } catch {
    return emptyResume();
  }
}

// debounced or effect-save on every resume change
```

- [ ] **Step 2: Commit**

```bash
git commit -am "feat: resume state store with localStorage autosave"
```

---

### Task 9: UI — Landing + Editor shell

**Files:**
- Create/Modify: `app/page.tsx`, `app/editor/page.tsx`, `components/Landing.tsx`, `components/editor/*` (all form sections, Toolbar, PreviewPane, KeywordPanel, AtsBadge)

**Interfaces:**
- Landing: persona cards → `sessionStorage` or query `?persona=tech` then router push `/editor`
- Editor: wrap with `ResumeProvider`; left form ~40%, right preview ~60%
- Toolbar: template select, accent swatches (only palette), page size, Download DOCX, Print/PDF, Clear, Export/Import JSON
- PreviewPane: `dangerouslySetInnerHTML` from `resumeToHtml` inside `#resume-print-root`
- Forms: controlled inputs bound to dispatch

- [ ] **Step 1: Build Landing with brand styling (cyan/indigo)**

- [ ] **Step 2: Build EditorShell + Toolbar + PreviewPane + AtsBadge**

- [ ] **Step 3: Build all form sections with add/remove for lists**

- [ ] **Step 4: Wire DOCX download**

```ts
const blob = await resumeToDocx(resume);
downloadBlob(blob, `${slug(resume.contact.fullName || "resume")}.docx`);
```

- [ ] **Step 5: Wire PDF via `window.print()`**

- [ ] **Step 6: KeywordPanel collapsible**

- [ ] **Step 7: Manual smoke**

Run: `npm run dev`  
Open `/` → pick Tech → edit → switch templates → download docx → print dialog

- [ ] **Step 8: Commit**

```bash
git commit -am "feat: landing page and full editor UI with export"
```

---

### Task 10: Polish, README, build, push

**Files:**
- Modify: `README.md`, any UI polish
- Verify: `npm test`, `npm run build`

- [ ] **Step 1: Run full test suite**

Run: `npm test`  
Expected: all green

- [ ] **Step 2: Production build**

Run: `npm run build`  
Expected: `out/` static export succeeds

- [ ] **Step 3: Update README with features, ATS invariants, deploy notes**

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "docs: finalize README and polish MVP"
```

- [ ] **Step 5: Push to GitHub**

```bash
git remote add origin https://github.com/chattes/ats-resume-builder.git
git branch -M main
git push -u origin main
```

If remote exists with history, pull/rebase or force only if user confirms empty repo.

- [ ] **Step 6: Confirm remote URL and latest commit hash to user**

---

## Self-Review Checklist

| Spec requirement | Task |
|---|---|
| Resume JSON schema | 2 |
| 10 templates | 3 |
| Personas T/H/F/E | 4 |
| docx single-column engine | 5 |
| Golden ATS tests ×10 | 5 |
| HTML preview + print PDF | 6, 9 |
| ATS self-check badge | 6, 9 |
| Keyword panel | 7, 9 |
| localStorage + JSON I/O | 8, 9 |
| Landing + editor UX | 9 |
| Static export / Vercel-ready | 1, 10 |
| Push to GitHub + always commit | every task + 10 |

No TBD placeholders. Types consistent: `Resume`, `TemplateId`, `resumeToDocx`, `resumeToHtml`, `atsCheck`, `getPersona`, `getTemplate`.
