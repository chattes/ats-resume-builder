// Heuristic mapping of extracted résumé / LinkedIn-PDF lines into the Resume
// schema. Tuned for LinkedIn "Save to PDF" (Company / Title / Month-Year dates,
// Top Skills, Certifications) but also handles ordinary résumés. Best-effort:
// the user refines the result in the editor afterwards.
import { emptyResume } from "@/lib/defaults";
import type { Resume } from "@/lib/schema";

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE = /(\+?\d[\d\s().-]{7,}\d)/;
const URL =
  /((https?:\/\/)?(www\.)?(linkedin\.com\/[^\s]+|github\.com\/[^\s]+|[\w-]+\.(com|io|dev|me|xyz)\/[^\s]+))/i;

const MONTH = "(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?";
const DATE_RANGE = new RegExp(
  `(${MONTH}\\s+)?((?:19|20)\\d{2})\\s*[-\\u2013\\u2014to]+\\s*(present|current|(?:${MONTH}\\s+)?(?:19|20)\\d{2})`,
  "i"
);

type Section =
  | "summary" | "experience" | "education" | "skills" | "certifications" | "projects" | "ignore" | null;

function classifyHeading(line: string): Section {
  const l = line.replace(/:+$/, "").trim().toLowerCase();
  if (l.length > 34) return null;
  if (/^(summary|profile|about|objective|overview)$/.test(l)) return "summary";
  if (/^(experience|work experience|employment|professional experience|work history)$/.test(l)) return "experience";
  if (/^education$/.test(l)) return "education";
  if (/^(top skills|skills|technical skills|core competencies|key skills)$/.test(l)) return "skills";
  if (/^(certifications?|licen[cs]es?|licen[cs]es? (and|&) certifications?)$/.test(l)) return "certifications";
  if (/^(projects?|selected projects?)$/.test(l)) return "projects";
  if (/^(contact|languages?|honors?-?\s?&?\s?awards?|interests|recommendations?|volunteering|publications?)$/.test(l))
    return "ignore";
  return null;
}

function isNoise(line: string): boolean {
  const l = line.trim();
  return (
    l.length === 0 ||
    /^page \d+ of \d+$/i.test(l) ||
    /^\((linkedin|blog|company|mobile|email|personal)\)$/i.test(l)
  );
}

function stripBullet(s: string): string {
  return s.replace(/^[\s•·▪◦*–-]+/, "").replace(/\s+/g, " ").trim();
}

function endYear(line: string): string | null {
  const range = line.match(/((?:19|20)\d{2})\s*[-–—]\s*((?:19|20)\d{2}|present)/i);
  if (range) return /present/i.test(range[2]) ? "Present" : range[2];
  const single = line.match(/\b(?:19|20)\d{2}\b/);
  return single ? single[0] : null;
}

type Exp = Resume["experience"][number];
type Edu = Resume["education"][number];

function parseExperience(lines: string[]): Exp[] {
  const entries: Exp[] = [];
  let buffer: string[] = [];
  for (const raw of lines) {
    if (isNoise(raw)) continue;
    const m = raw.match(DATE_RANGE);
    if (m) {
      const header = buffer.slice(-2);
      const prev = buffer.slice(0, Math.max(0, buffer.length - 2));
      if (entries.length && prev.length) {
        entries[entries.length - 1].bullets.push(
          ...prev.map(stripBullet).filter((b) => b.length > 1)
        );
      }
      buffer = [];
      const start = `${m[1] ?? ""}${m[2]}`.trim();
      const end = /present|current/i.test(m[3]) ? "Present" : m[3].trim();
      const company = header.length === 2 ? header[0] : "";
      const role = header.length === 2 ? header[1] : header[0] ?? "Role";
      entries.push({ company, role: role || "Role", location: "", start, end, bullets: [] });
    } else {
      buffer.push(raw);
    }
  }
  if (entries.length && buffer.length) {
    entries[entries.length - 1].bullets.push(
      ...buffer.map(stripBullet).filter((b) => b.length > 1)
    );
  }
  return entries.slice(0, 10);
}

function parseEducation(lines: string[]): Edu[] {
  const edu: Edu[] = [];
  let cur: Edu | null = null;
  for (const raw of lines) {
    if (isNoise(raw)) continue;
    const line = raw.trim();
    const yr = endYear(line);
    if (!cur) {
      cur = { school: line, degree: "", location: "", start: "", end: "", details: [] };
      edu.push(cur);
      continue;
    }
    if (yr && !cur.degree) {
      cur.degree = line
        .replace(/\(?\s*(?:19|20)\d{2}\s*[-–—]\s*(?:(?:19|20)\d{2}|present)\s*\)?/i, "")
        .replace(/\b(?:19|20)\d{2}\b/, "")
        .replace(/[·|]\s*$/, "")
        .replace(/\(\s*\)/g, "")
        .trim();
      cur.end = yr;
      cur = null; // close entry; next line begins a new school
      continue;
    }
    if (!cur.degree) {
      cur.degree = line;
      continue;
    }
    cur.details = [...(cur.details ?? []), stripBullet(line)];
  }
  return edu.slice(0, 6);
}

export function pdfLinesToResume(lines: string[]): Resume {
  const resume = emptyResume();
  const text = lines.join("\n");

  // contact — email (repair LinkedIn line-wrapping, e.g. "gmail.co" + "m")
  let email: string | undefined;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(EMAIL);
    if (m) {
      email = m[0];
      const nxt = lines[i + 1]?.trim();
      if (lines[i].trim().endsWith(email) && nxt && /^[a-z]{1,4}$/.test(nxt)) email += nxt;
      break;
    }
  }
  if (email) resume.contact.email = email.trim();

  const phone = text.match(PHONE)?.[0];
  if (phone && !/^\(?\d{4}\)?$/.test(phone.trim())) resume.contact.phone = phone.trim();

  // links — repair wrapped URLs (a line ending in "-" or "/" continues on the next)
  const links: { label: string; url: string }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(URL);
    if (!m) continue;
    let url = m[0];
    const nxt = lines[i + 1]?.trim();
    if (/[-/]$/.test(lines[i].trim()) && nxt) {
      const cont = nxt.split(/\s+/)[0];
      if (/^[\w-]+$/.test(cont)) url += cont;
    }
    url = url.replace(/^https?:\/\//, "").replace(/\s+/g, "");
    const label = /linkedin/i.test(url) ? "LinkedIn" : /github/i.test(url) ? "GitHub" : "Website";
    if (url.length < 100 && !links.some((x) => x.url === url)) links.push({ label, url });
  }
  if (links.length) resume.contact.links = links.slice(0, 3);

  // Bucket lines by section; capture pre-heading lines for name/title/location.
  const buckets: Record<Exclude<Section, null>, string[]> = {
    summary: [], experience: [], education: [], skills: [], certifications: [], projects: [], ignore: [],
  };
  const preHeading: string[] = [];
  let current: Section = null;
  for (const raw of lines) {
    if (isNoise(raw)) continue;
    const line = raw.trim();
    const h = classifyHeading(line);
    if (h) { current = h; continue; }
    if (current) buckets[current].push(line);
    else preHeading.push(line);
  }

  // name / title / location from the pre-heading block (main column top)
  const candidates = preHeading.filter(
    (l) => !EMAIL.test(l) && !PHONE.test(l) && !URL.test(l) && l.length > 1
  );
  if (candidates[0]) resume.contact.fullName = candidates[0];
  const locIdx = candidates.findIndex(
    (l, i) => i > 0 && /,/.test(l) && !/\d/.test(l) && l.length < 60
  );
  // headline may wrap across several lines before the location
  const title =
    locIdx > 1 ? candidates.slice(1, locIdx).join(" ") : candidates[1];
  if (title && title.length < 160) resume.contact.title = title;
  if (locIdx > 0) resume.contact.location = candidates[locIdx];

  // summary
  const summary = buckets.summary.join(" ").replace(/\s+/g, " ").trim();
  if (summary) resume.summary = summary;

  // skills (LinkedIn lists one per line; also handle comma lists)
  if (buckets.skills.length) {
    const toks = buckets.skills
      .flatMap((l) => l.split(/[,•·|/]/))
      .map((s) => stripBullet(s))
      .filter((s) => s.length >= 2 && s.length <= 40);
    resume.skills = Array.from(new Set(toks)).slice(0, 25);
  }

  // experience & education
  const exp = parseExperience(buckets.experience);
  if (exp.length) resume.experience = exp;
  const edu = parseEducation(buckets.education);
  if (edu.length) resume.education = edu;

  // certifications
  if (buckets.certifications.length) {
    resume.certifications = buckets.certifications
      .map((l) => stripBullet(l))
      .filter((l) => l.length > 1 && !endYear(l)?.match(/^$/))
      .map((name) => ({ name }))
      .slice(0, 12);
  }

  return resume;
}
