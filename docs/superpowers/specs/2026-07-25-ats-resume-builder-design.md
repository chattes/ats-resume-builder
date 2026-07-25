# ATS Resume Builder — Design Spec

**Date:** 2026-07-25  
**Status:** Approved  
**Location:** `D:\Etsy Business\ats-resume-builder`  
**Remote:** https://github.com/chattes/ats-resume-builder.git  

## 1. Goal

Client-side web app: guided form → live single-column preview → export **guaranteed ATS-safe** résumé as **.docx** (primary) and **text-based PDF**. Privacy-first (data never leaves the browser). No accounts, no backend for MVP.

## 2. Scope (Full MVP = Phases 0–3)

**In:**
- Resume JSON schema + validation
- Accordion form editor + live preview
- 10 ATS-safe template designs (design tokens only)
- .docx export via `docx` library
- PDF via print CSS + `window.print()`
- localStorage autosave + JSON import/export
- Persona presets: Tech, Healthcare, Finance, Education
- Accent color (contrast-safe palette), Letter/A4
- ATS self-check badge
- Keyword-match panel (paste JD → matched/missing terms)
- Static deploy (Vercel-ready)

**Out:** auth, cloud storage, AI writing, cover-letter builder, multi-column/creative designs, payments.

## 3. Architecture

```
[ Next.js UI: form + live preview ]
         │  Resume JSON (memory + localStorage)
         ▼
[ Pure generation layer ]
   ├── resumeToDocx(json, template) → Blob .docx
   ├── resumeToHtml(json, template) → preview + print
   └── atsCheck(json | extracted text) → pass/fail details
         │
         ▼
[ Browser download / print ]
```

**Invariants (enforced in code, not optional):**
- Single column only
- No tables, text boxes, headers/footers for contact
- Contact plain text at top of body
- Safe fonts allowlist only
- Standard section heading vocabulary
- Margins 0.5"–1"
- Real bullet list definitions
- Dates via tab stops (not columns)

## 4. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript, `output: 'export'` |
| UI | Tailwind CSS + React useReducer |
| DOCX | `docx` (dolanmiu) |
| PDF | Print stylesheet + `window.print()` |
| Validation | Zod |
| Persistence | localStorage |
| Tests | Vitest + mammoth (text extract for golden ATS tests) |
| Hosting | Vercel static |

## 5. Data Model

```ts
type Resume = {
  contact: {
    fullName: string;
    title?: string;
    email: string;
    phone: string;
    location?: string;
    links?: { label: string; url: string }[];
  };
  summary: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    location?: string;
    start: string;
    end: string | "Present";
    bullets: string[];
  }[];
  education: {
    school: string;
    degree: string;
    location?: string;
    start?: string;
    end: string;
    details?: string[];
  }[];
  certifications?: { name: string; issuer?: string; year?: string }[];
  projects?: { name: string; description: string; bullets?: string[] }[];
  customSections?: { heading: string; items: string[] }[];
  meta: {
    template: TemplateId;
    accentHex: string;
    pageSize: "Letter" | "A4";
    persona?: "tech" | "healthcare" | "finance" | "education";
  };
};
```

## 6. Templates (10 designs)

All share the same single-column engine. Differentiation via design tokens only:

| ID | Name | Body font | Name | Heading | Accent | Density |
|---|---|---|---|---|---|---|
| classic | Classic | Garamond | Centered large | Rule-below | Headings | Standard |
| modern | Modern | Calibri | Left bold | Spaced-caps + rule | Headings | Standard |
| compact | Compact | Arial | Left medium | Plain-bold | None | Compact |
| minimal | Minimal | Calibri | Centered tracked | Spaced-caps no rule | None | Airy |
| bold-name | Bold Name | Arial | Extra-large accent | Rule-thick | Headings+name | Standard |
| executive | Executive | Georgia | Centered + title | Small-caps | Headings | Standard |
| underlined | Underlined | Cambria | Left | Underline | Headings+dates | Standard |
| two-tone | Two-Tone | Calibri | Left accent | Rule-below accent | Headings+dates | Standard |
| detailed | Detailed | Georgia | Left | Rule-below | Headings | Airy |
| simple-sans | Simple Sans | Arial | Left plain | Plain-bold | None | Standard |

```ts
type Template = {
  id: TemplateId;
  name: string;
  font: { heading: SafeFont; body: SafeFont };
  nameStyle: {
    size: number;
    align: "left" | "center";
    caps?: boolean;
    tracking?: number;
    accent?: boolean;
  };
  headingStyle:
    | "rule-below"
    | "underline"
    | "small-caps"
    | "spaced-caps"
    | "plain-bold"
    | "rule-thick";
  divider: "thin" | "thick" | "dotted" | "none";
  accentUse: "headings" | "headings+name" | "headings+dates" | "none";
  density: "compact" | "standard" | "airy";
  bullet: "dot" | "dash" | "square";
};
```

## 7. UI Flow

1. **Landing (`/`)** — CTA + persona cards (Tech / Healthcare / Finance / Education / blank)
2. **Editor (`/editor`)** — left accordion form, right live preview
3. **Toolbar** — template switcher (10), accent picker, page size, Download .docx, Download PDF, ATS badge
4. **Keyword panel** — paste JD → matched vs missing tokens
5. **Autosave** — localStorage; Clear; Export/Import JSON

## 8. Project Structure

```
ats-resume-builder/
  app/                    # /, /editor
  components/             # Form*, PreviewPane, Toolbar, KeywordPanel
  lib/
    schema.ts
    store.ts              # useReducer + localStorage
    personas/
    generate/
      docx.ts
      html.ts
      atsCheck.ts
    templates/
  styles/                 # globals + print.css
  tests/                  # unit + ATS golden (all 10 templates)
  docs/superpowers/
```

## 9. Testing

- Unit: `resumeToDocx` — zero tables, single section, contact in body, safe fonts, heading vocab
- Golden ATS: fixture → generate all 10 → extract text (mammoth) → assert reading order + fields
- Manual: open .docx in Word + Google Docs; PDF has selectable text

## 10. Deployment & Git

- Static export → Vercel
- Repo: https://github.com/chattes/ats-resume-builder.git
- **Always commit** meaningful changes with clear messages; push to remote

## 11. Source Specs

- Product: Obsidian `BrightByteTreasures - ATS Resume Templates Spec.md`
- Technical: Obsidian `BrightByteTreasures - ATS Resume Builder Technical Plan.md`
