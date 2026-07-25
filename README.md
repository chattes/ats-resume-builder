# ATS Resume Builder

Client-side ATS-safe résumé builder. Fill a form, pick a template and persona, get a live preview, then export **.docx** or **PDF**. Everything runs in the browser — no accounts, no server-side resume storage.

**Repo:** https://github.com/chattes/ats-resume-builder

## Features

- **10 ATS-safe templates** — single-column layouts with standard section headings
- **5 personas** — Tech, Healthcare, Finance, Education, **Trades & Gig** (licenses/certs promoted high)
- **Exports** — `.docx` (OOXML engine; **ATS-verified**) and print-to-PDF from the HTML preview
- **localStorage** — drafts persist in the browser; import/export JSON
- **Completeness badge** — name/contact/summary checks (structural ATS safety is guaranteed by the DOCX generator + golden tests)
- **Keyword match** — paste a job description and see skill/keyword overlap

## ATS invariants

DOCX output is built to stay parse-friendly for applicant tracking systems:

- **Single-column** body flow (no multi-column layouts)
- **No tables** in OOXML (`w:tbl` absent)
- **No headers or footers** (no `header*.xml` / `footer*.xml`)
- **Standard section headings** (Summary, Skills, Experience, Education, …)
- **Reading order** preserved (persona may promote Certifications after Summary for trades)
- **Safe accents only** when the template uses color (contrast-checked)

**For online applications, submit the `.docx`** — it is the ATS-verified format. Print/PDF is fine for human readers and in-person copies.

Golden tests under `tests/docx-ats.test.ts` and `tests/html-order.test.ts` lock reading order.

### Fonts

Templates may use Garamond, Cambria, or Georgia. If a machine lacks those fonts, Word/Google Docs will substitute (e.g. Garamond → Georgia/Times). Text still parses for ATS; visual fidelity may vary.

## Privacy

Resume data stays in your browser (localStorage and in-memory state). Nothing is uploaded to a backend for processing or storage.

## Dev

Prefer a **fresh install on the target OS** (avoids optional native-dep issues when copying `node_modules` across Windows/Linux):

```bash
npm ci          # or: npm install
npm run dev     # local Next.js dev server
npm test        # Vitest
npm run build   # production static export → out/
```

## Deploy

Static export via Next.js (`output: 'export'`). After `npm run build`, deploy the **`out/`** directory to Vercel (or any static host).

```bash
npm run build
npx vercel --prebuilt
# or point the project root output to out/
```

## Out of scope (Phase 2+)

- Cover letter + references generators (Etsy template packs)
- Marketing / Executive / Entry-Level personas
- Google Docs make-a-copy delivery (template shop, not builder)
