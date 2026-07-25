import type { Resume } from "@/lib/schema";
import {
  getContentSectionOrder,
  sectionHeadingLabel,
  type ContentSection,
} from "@/lib/sections";
import { getTemplate } from "@/lib/templates";
import type { HeadingStyle, Template } from "@/lib/templates/types";

const DENSITY_SPACING = {
  compact: { sectionAfter: "6pt", paraAfter: "3pt" },
  standard: { sectionAfter: "10pt", paraAfter: "6pt" },
  airy: { sectionAfter: "14pt", paraAfter: "8pt" },
} as const;

const BULLET_CHAR: Record<Template["bullet"], string> = {
  dot: "\u2022",
  dash: "\u2013",
  square: "\u25AA",
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function accentColor(
  template: Template,
  accentHex: string,
  use: "name" | "heading" | "date"
): string | undefined {
  switch (template.accentUse) {
    case "none":
      return undefined;
    case "headings":
      return use === "heading" ? accentHex : undefined;
    case "headings+name":
      return use === "heading" || use === "name" ? accentHex : undefined;
    case "headings+dates":
      return use === "heading" || use === "date" ? accentHex : undefined;
  }
}

function headingStyleCss(
  style: HeadingStyle,
  accent?: string
): string {
  const color = accent ? `color:${accent};` : "";
  switch (style) {
    case "rule-below":
      return `${color}border-bottom:1px solid ${accent ?? "#000"};padding-bottom:2pt;`;
    case "rule-thick":
      return `${color}border-bottom:3px solid ${accent ?? "#000"};padding-bottom:2pt;`;
    case "underline":
      return `${color}text-decoration:underline;text-decoration-color:${accent ?? "currentColor"};`;
    case "small-caps":
      return `${color}font-variant:small-caps;`;
    case "spaced-caps":
      return `${color}text-transform:uppercase;letter-spacing:0.08em;`;
    case "plain-bold":
      return color;
  }
}

function dateRange(start: string | undefined, end: string): string {
  if (start) return `${start} – ${end}`;
  return end;
}

function contactLine(resume: Resume): string {
  const parts: string[] = [];
  if (resume.contact.email) parts.push(resume.contact.email);
  if (resume.contact.phone) parts.push(resume.contact.phone);
  if (resume.contact.location) parts.push(resume.contact.location);
  for (const link of resume.contact.links ?? []) {
    parts.push(link.url || link.label);
  }
  return parts.join(" | ");
}

function sectionHeadingHtml(
  text: string,
  template: Template,
  accentHex: string,
  spacing: { sectionAfter: string; paraAfter: string }
): string {
  const headingAccent = accentColor(template, accentHex, "heading");
  const style = [
    `font-family:${template.font.heading},sans-serif`,
    "font-size:11pt",
    "font-weight:bold",
    `margin: ${spacing.paraAfter} 0 ${spacing.sectionAfter}`,
    headingStyleCss(template.headingStyle, headingAccent),
  ].join(";");
  return `<h2 style="${style}">${escapeHtml(text)}</h2>`;
}

function bulletList(
  items: string[],
  template: Template,
  spacing: { paraAfter: string }
): string {
  if (items.length === 0) return "";
  const char = BULLET_CHAR[template.bullet];
  const lis = items
    .map(
      (item) =>
        `<li style="margin:0 0 ${spacing.paraAfter};font-family:${template.font.body},sans-serif;font-size:10pt;color:#111;">${escapeHtml(char)} ${escapeHtml(item)}</li>`
    )
    .join("");
  return `<ul style="list-style:none;padding:0;margin:0 0 0 18pt;">${lis}</ul>`;
}

/** Single-line role/date — no flex — so plain-text extract keeps reading order. */
function roleDateLine(
  title: string,
  dates: string,
  template: Template,
  spacing: { paraAfter: string },
  dateAccent?: string
): string {
  const dateStyle = dateAccent ? `color:${dateAccent};` : "color:#111;";
  return (
    `<p style="font-family:${template.font.body},sans-serif;font-size:10pt;margin:0 0 calc(${spacing.paraAfter} / 2);color:#111;">` +
    `<strong>${escapeHtml(title)}</strong>` +
    `<span style="${dateStyle}"> — ${escapeHtml(dates)}</span>` +
    `</p>`
  );
}

type HtmlSectionCtx = {
  resume: Resume;
  template: Template;
  spacing: { sectionAfter: string; paraAfter: string };
  dateAccent: string | undefined;
  persona: Resume["meta"]["persona"];
};

function buildHtmlSection(key: ContentSection, ctx: HtmlSectionCtx): string[] {
  const { resume, template, spacing, dateAccent, persona } = ctx;
  const parts: string[] = [];

  switch (key) {
    case "summary": {
      if (!resume.summary.trim()) return parts;
      parts.push(
        sectionHeadingHtml(
          sectionHeadingLabel("summary", persona),
          template,
          resume.meta.accentHex,
          spacing
        )
      );
      parts.push(
        `<p style="font-family:${template.font.body},sans-serif;font-size:10pt;margin:0 0 ${spacing.sectionAfter};color:#111;">${escapeHtml(resume.summary)}</p>`
      );
      return parts;
    }
    case "skills": {
      if (resume.skills.length === 0) return parts;
      parts.push(
        sectionHeadingHtml(
          sectionHeadingLabel("skills", persona),
          template,
          resume.meta.accentHex,
          spacing
        )
      );
      parts.push(
        `<p style="font-family:${template.font.body},sans-serif;font-size:10pt;margin:0 0 ${spacing.sectionAfter};color:#111;">${escapeHtml(resume.skills.join(", "))}</p>`
      );
      return parts;
    }
    case "experience": {
      if (resume.experience.length === 0) return parts;
      parts.push(
        sectionHeadingHtml(
          sectionHeadingLabel("experience", persona),
          template,
          resume.meta.accentHex,
          spacing
        )
      );
      for (const job of resume.experience) {
        parts.push(
          roleDateLine(
            job.role,
            dateRange(job.start, job.end),
            template,
            spacing,
            dateAccent
          )
        );
        const companyLine = [job.company, job.location]
          .filter(Boolean)
          .join(" — ");
        parts.push(
          `<div style="font-family:${template.font.body},sans-serif;font-size:10pt;font-weight:bold;margin:0 0 calc(${spacing.paraAfter} / 2);color:#111;">${escapeHtml(companyLine)}</div>`
        );
        parts.push(bulletList(job.bullets, template, spacing));
      }
      return parts;
    }
    case "education": {
      if (resume.education.length === 0) return parts;
      parts.push(
        sectionHeadingHtml(
          sectionHeadingLabel("education", persona),
          template,
          resume.meta.accentHex,
          spacing
        )
      );
      for (const edu of resume.education) {
        parts.push(
          roleDateLine(
            edu.degree,
            dateRange(edu.start, edu.end),
            template,
            spacing,
            dateAccent
          )
        );
        const schoolLine = [edu.school, edu.location]
          .filter(Boolean)
          .join(" — ");
        parts.push(
          `<div style="font-family:${template.font.body},sans-serif;font-size:10pt;margin:0 0 ${spacing.paraAfter};color:#111;">${escapeHtml(schoolLine)}</div>`
        );
        if (edu.details?.length) {
          parts.push(bulletList(edu.details, template, spacing));
        }
      }
      return parts;
    }
    case "certifications": {
      if (!resume.certifications?.length) return parts;
      parts.push(
        sectionHeadingHtml(
          sectionHeadingLabel("certifications", persona),
          template,
          resume.meta.accentHex,
          spacing
        )
      );
      for (const cert of resume.certifications) {
        const line = [cert.name, cert.issuer, cert.year]
          .filter(Boolean)
          .join(" — ");
        parts.push(
          `<div style="font-family:${template.font.body},sans-serif;font-size:10pt;margin:0 0 ${spacing.paraAfter};color:#111;">${escapeHtml(line)}</div>`
        );
      }
      return parts;
    }
    case "projects": {
      if (!resume.projects?.length) return parts;
      parts.push(
        sectionHeadingHtml(
          sectionHeadingLabel("projects", persona),
          template,
          resume.meta.accentHex,
          spacing
        )
      );
      for (const project of resume.projects) {
        parts.push(
          `<div style="font-family:${template.font.body},sans-serif;font-size:10pt;margin:0 0 calc(${spacing.paraAfter} / 2);color:#111;">` +
            `<strong>${escapeHtml(project.name)}</strong> — ${escapeHtml(project.description)}` +
            `</div>`
        );
        if (project.bullets?.length) {
          parts.push(bulletList(project.bullets, template, spacing));
        }
      }
      return parts;
    }
    case "customSections": {
      for (const section of resume.customSections ?? []) {
        parts.push(
          sectionHeadingHtml(
            section.heading,
            template,
            resume.meta.accentHex,
            spacing
          )
        );
        parts.push(bulletList(section.items, template, spacing));
      }
      return parts;
    }
  }
}

export function resumeToHtml(resume: Resume): string {
  const template = getTemplate(resume.meta.template);
  const spacing = DENSITY_SPACING[template.density];
  const nameAccent = accentColor(template, resume.meta.accentHex, "name");
  const dateAccent = accentColor(template, resume.meta.accentHex, "date");
  const nameText = template.nameStyle.caps
    ? resume.contact.fullName.toUpperCase()
    : resume.contact.fullName;
  const nameAlign = template.nameStyle.align;
  const pageWidth =
    resume.meta.pageSize === "A4" ? "210mm" : "8.5in";
  const tracking =
    template.nameStyle.tracking != null
      ? `letter-spacing:${template.nameStyle.tracking * 0.05}em;`
      : "";

  const parts: string[] = [];

  const nameStyle = [
    `font-family:${template.font.heading},sans-serif`,
    `font-size:${template.nameStyle.size}pt`,
    "font-weight:bold",
    `text-align:${nameAlign}`,
    `margin:0 0 ${spacing.paraAfter}`,
    nameAccent ? `color:${nameAccent}` : "color:#111",
    tracking,
    template.nameStyle.caps ? "text-transform:uppercase;" : "",
  ].join(";");
  parts.push(`<div style="${nameStyle}">${escapeHtml(nameText)}</div>`);

  if (resume.contact.title) {
    parts.push(
      `<div style="font-family:${template.font.body},sans-serif;font-size:11pt;text-align:${nameAlign};margin:0 0 ${spacing.paraAfter};color:#111;">${escapeHtml(resume.contact.title)}</div>`
    );
  }

  const contact = contactLine(resume);
  if (contact) {
    const after =
      template.divider === "none" ? spacing.sectionAfter : spacing.paraAfter;
    parts.push(
      `<div style="font-family:${template.font.body},sans-serif;font-size:9pt;text-align:${nameAlign};margin:0 0 ${after};color:#111;">${escapeHtml(contact)}</div>`
    );
  }

  if (template.divider !== "none") {
    const accentForHeadings = accentColor(
      template,
      resume.meta.accentHex,
      "heading"
    );
    const color = accentForHeadings ?? "#000";
    let border = `1px solid ${color}`;
    if (template.divider === "thick") border = `3px solid ${color}`;
    if (template.divider === "dotted") border = `1px dotted ${color}`;
    parts.push(
      `<div style="border-bottom:${border};margin:0 0 ${spacing.sectionAfter};"></div>`
    );
  }

  for (const key of getContentSectionOrder(resume.meta.persona)) {
    parts.push(
      ...buildHtmlSection(key, {
        resume,
        template,
        spacing,
        dateAccent,
        persona: resume.meta.persona,
      })
    );
  }

  const rootStyle = [
    `width:${pageWidth}`,
    "max-width:100%",
    "box-sizing:border-box",
    "padding:0.6in",
    "background:#fff",
    "color:#111",
    `font-family:${template.font.body},sans-serif`,
    "font-size:10pt",
    "line-height:1.35",
  ].join(";");

  return (
    `<div id="resume-print-root" class="resume-sheet" data-template="${escapeHtml(resume.meta.template)}" style="${rootStyle}">` +
    parts.join("") +
    `</div>`
  );
}
