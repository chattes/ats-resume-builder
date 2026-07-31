// Heuristic mapping of extracted résumé/LinkedIn-PDF lines into the Resume schema.
// Best-effort: the user refines the result in the editor afterwards.
import { emptyResume } from "@/lib/defaults";
import type { Resume } from "@/lib/schema";

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE = /(\+?\d[\d\s().-]{7,}\d)/;
const URL = /((https?:\/\/)?(www\.)?(linkedin\.com\/[^\s]+|github\.com\/[^\s]+|[\w-]+\.(com|io|dev|me)\/[^\s]+))/i;
const DATE_RANGE =
  /((?:\d{1,2}\/)?(?:19|20)\d{2})\s*[–—-]\s*((?:\d{1,2}\/)?(?:19|20)\d{2}|present|current)/i;
const YEAR = /\b(19|20)\d{2}\b/;

type Section =
  | "summary" | "experience" | "education" | "skills" | "certifications" | "projects" | null;

function classifyHeading(line: string): Section {
  const l = line.replace(/[:]+$/, "").trim().toLowerCase();
  if (l.length > 32) return null; // headings are short
  if (/^(summary|profile|about|professional summary|objective|overview)$/.test(l)) return "summary";
  if (/^(experience|work experience|employment|professional experience|work history)$/.test(l)) return "experience";
  if (/^(education|academic background)$/.test(l)) return "education";
  if (/^(skills|technical skills|core competencies|key skills|top skills)$/.test(l)) return "skills";
  if (/^(certifications?|licen[cs]es?|licen[cs]es? (and|&) certifications?)$/.test(l)) return "certifications";
  if (/^(projects?|selected projects?)$/.test(l)) return "projects";
  return null;
}

function stripBullet(s: string): string {
  return s.replace(/^[\s•·▪◦*\-–]+/, "").trim();
}

export function pdfLinesToResume(lines: string[]): Resume {
  const resume = emptyResume();
  const text = lines.join("\n");

  // contact
  const email = text.match(EMAIL)?.[0];
  const phone = text.match(PHONE)?.[0];
  if (email) resume.contact.email = email.trim();
  if (phone) resume.contact.phone = phone.trim();

  const links: { label: string; url: string }[] = [];
  for (const line of lines) {
    const m = line.match(URL);
    if (m) {
      const url = m[0].replace(/^https?:\/\//, "");
      const label = /linkedin/i.test(url) ? "LinkedIn" : /github/i.test(url) ? "GitHub" : "Website";
      if (!links.some((x) => x.url === url)) links.push({ label, url });
    }
  }
  if (links.length) resume.contact.links = links.slice(0, 3);

  // name + headline: first meaningful lines that aren't headings/contact
  const clean = lines.filter((l) => l.trim().length > 0);
  const firstReal = clean.find(
    (l) => !EMAIL.test(l) && !PHONE.test(l) && !URL.test(l) && !classifyHeading(l)
  );
  if (firstReal) resume.contact.fullName = firstReal.trim();
  const nameIdx = firstReal ? clean.indexOf(firstReal) : -1;
  if (nameIdx >= 0 && clean[nameIdx + 1]) {
    const cand = clean[nameIdx + 1];
    if (cand.length < 60 && !EMAIL.test(cand) && !PHONE.test(cand) && !URL.test(cand) && !classifyHeading(cand)) {
      resume.contact.title = cand.trim();
    }
  }

  // section buckets
  const buckets: Record<Exclude<Section, null>, string[]> = {
    summary: [], experience: [], education: [], skills: [], certifications: [], projects: [],
  };
  let current: Section = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const h = classifyHeading(line);
    if (h) { current = h; continue; }
    if (current) buckets[current].push(line);
  }

  // summary
  const summary = buckets.summary.join(" ").trim();
  if (summary) resume.summary = summary;

  // skills
  if (buckets.skills.length) {
    const toks = buckets.skills
      .join(", ")
      .split(/[,•·|/\n]|\s{2,}/)
      .map((s) => stripBullet(s))
      .filter((s) => s.length >= 2 && s.length <= 40);
    resume.skills = Array.from(new Set(toks)).slice(0, 25);
  }

  // experience
  const exp: Resume["experience"] = [];
  let cur: Resume["experience"][number] | null = null;
  for (const line of buckets.experience) {
    const dr = line.match(DATE_RANGE);
    const looksHeader = dr || / at | — | \| /.test(line);
    if (looksHeader) {
      const role = line.replace(DATE_RANGE, "").replace(/[|—–-]\s*$/, "").trim();
      cur = {
        company: "", role: role || "Role", location: "",
        start: dr?.[1] ?? "", end: dr?.[2] ? capitalize(dr[2]) : "", bullets: [],
      };
      exp.push(cur);
    } else if (cur) {
      if (!cur.company && line.length < 60 && !/^[•·▪]/.test(line)) cur.company = line.trim();
      else cur.bullets.push(stripBullet(line));
    } else {
      cur = { company: "", role: line, location: "", start: "", end: "", bullets: [] };
      exp.push(cur);
    }
  }
  if (exp.length) resume.experience = exp.slice(0, 8);

  // education
  const edu: Resume["education"] = [];
  let curEd: Resume["education"][number] | null = null;
  for (const line of buckets.education) {
    const year = line.match(YEAR)?.[0];
    if (!curEd || year) {
      curEd = {
        school: "", degree: line.replace(YEAR, "").trim() || "Degree",
        location: "", start: "", end: year ?? "", details: [],
      };
      edu.push(curEd);
    } else if (!curEd.school) {
      curEd.school = line.trim();
    } else {
      curEd.details = [...(curEd.details ?? []), stripBullet(line)];
    }
  }
  if (edu.length) resume.education = edu.slice(0, 5);

  // certifications
  if (buckets.certifications.length) {
    resume.certifications = buckets.certifications
      .map((l) => ({ name: stripBullet(l) }))
      .filter((c) => c.name.length > 1)
      .slice(0, 12);
  }

  return resume;
}

function capitalize(s: string): string {
  const l = s.toLowerCase();
  if (l === "present" || l === "current") return "Present";
  return s;
}
