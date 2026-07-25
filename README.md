# ATS Resume Builder

Client-side ATS-safe résumé builder. Fill a form, pick a template and persona, get a live preview, then export **.docx** or **PDF**. Everything runs in the browser — no accounts, no server-side resume storage.

**Repo:** https://github.com/chattes/ats-resume-builder

## Features

- **10 ATS-safe templates** — single-column layouts with standard section headings
- **4 personas** — Tech (T), Healthcare (H), Finance (F), Education (E) with tailored defaults
- **Exports** — `.docx` (OOXML engine) and print-to-PDF from the HTML preview
- **localStorage** — drafts persist in the browser; import/export JSON
- **ATS self-check** — badge with pass/fail checks (name, contact, summary, experience/education, template, accent contrast)
- **Keyword match** — paste a job description and see skill/keyword overlap

## ATS invariants

DOCX output is built to stay parse-friendly for applicant tracking systems:

- **Single-column** body flow (no multi-column layouts)
- **No tables** in OOXML (`w:tbl` absent)
- **No headers or footers** (no `header*.xml` / `footer*.xml`)
- **Standard section headings** (Summary, Skills, Experience, Education, …)
- **Reading order** preserved: name → contact → summary → skills → experience → education
- **Safe accents only** when the template uses color (contrast-checked)

Golden tests under `tests/docx-ats.test.ts` lock these rules for all 10 templates.

## Privacy

Resume data stays in your browser (localStorage and in-memory state). Nothing is uploaded to a backend for processing or storage.

## Dev

```bash
npm install
npm run dev      # local Next.js dev server
npm test         # Vitest
npm run build    # production static export → out/
```

## Deploy

Static export via Next.js (`output: 'export'`). After `npm run build`, deploy the **`out/`** directory to Vercel (or any static host).

Example (Vercel CLI):

```bash
npm run build
npx vercel --prebuilt
# or point the project root output to out/
```
