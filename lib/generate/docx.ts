import {
  AlignmentType,
  BorderStyle,
  Document,
  LevelFormat,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
  type IBorderOptions,
} from "docx";
import type { Resume } from "@/lib/schema";
import { SECTION_HEADINGS } from "@/lib/schema";
import { getTemplate } from "@/lib/templates";
import type { HeadingStyle, Template } from "@/lib/templates/types";

const MARGIN_TWIPS = 720;

const PAGE_SIZE = {
  Letter: { width: 12240, height: 15840 },
  A4: { width: 11906, height: 16838 },
} as const;

const DENSITY_SPACING = {
  compact: { sectionAfter: 120, paraAfter: 60 },
  standard: { sectionAfter: 200, paraAfter: 120 },
  airy: { sectionAfter: 280, paraAfter: 160 },
} as const;

const BULLET_CHAR: Record<Template["bullet"], string> = {
  dot: "\u2022",
  dash: "\u2013",
  square: "\u25AA",
};

const BULLET_REF = "resume-bullets";

function hexToDocxColor(hex: string): string {
  return hex.replace(/^#/, "").toUpperCase();
}

function ptToHalfPoints(pt: number): number {
  return Math.round(pt * 2);
}

function contentWidthTwips(pageSize: Resume["meta"]["pageSize"]): number {
  const page = PAGE_SIZE[pageSize];
  return page.width - MARGIN_TWIPS * 2;
}

function accentColor(
  template: Template,
  accentHex: string,
  use: "name" | "heading" | "date"
): string | undefined {
  const color = hexToDocxColor(accentHex);
  switch (template.accentUse) {
    case "none":
      return undefined;
    case "headings":
      return use === "heading" ? color : undefined;
    case "headings+name":
      return use === "heading" || use === "name" ? color : undefined;
    case "headings+dates":
      return use === "heading" || use === "date" ? color : undefined;
  }
}

function headingBorder(
  style: HeadingStyle,
  accent?: string
): { bottom: IBorderOptions } | undefined {
  if (style === "rule-below") {
    return {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 6,
        color: accent ?? "000000",
        space: 4,
      },
    };
  }
  if (style === "rule-thick") {
    return {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 18,
        color: accent ?? "000000",
        space: 4,
      },
    };
  }
  return undefined;
}

function dividerParagraph(
  template: Template,
  accentHex: string,
  spacing: { sectionAfter: number; paraAfter: number }
): Paragraph | undefined {
  if (template.divider === "none") return undefined;

  const accentForHeadings = accentColor(template, accentHex, "heading");
  const color = accentForHeadings ?? "000000";
  const borderStyle =
    template.divider === "dotted" ? BorderStyle.DOTTED : BorderStyle.SINGLE;
  const size = template.divider === "thick" ? 18 : 6;

  return new Paragraph({
    spacing: { after: spacing.sectionAfter },
    border: {
      bottom: {
        style: borderStyle,
        size,
        color,
        space: 1,
      },
    },
    children: [],
  });
}

function sectionHeading(
  text: string,
  template: Template,
  accentHex: string,
  spacing: { sectionAfter: number; paraAfter: number }
): Paragraph {
  const headingAccent = accentColor(template, accentHex, "heading");
  const border = headingBorder(template.headingStyle, headingAccent);
  const underline =
    template.headingStyle === "underline"
      ? ({ type: "single" as const, color: headingAccent })
      : undefined;

  return new Paragraph({
    spacing: { after: spacing.sectionAfter, before: spacing.paraAfter },
    border,
    children: [
      new TextRun({
        text,
        bold: true,
        font: template.font.heading,
        size: ptToHalfPoints(11),
        color: headingAccent,
        smallCaps: template.headingStyle === "small-caps",
        allCaps: template.headingStyle === "spaced-caps",
        characterSpacing:
          template.headingStyle === "spaced-caps" ? 60 : undefined,
        underline,
      }),
    ],
  });
}

function bodyRun(
  text: string,
  template: Template,
  opts: { bold?: boolean; size?: number; color?: string } = {}
): TextRun {
  return new TextRun({
    text,
    font: template.font.body,
    size: ptToHalfPoints(opts.size ?? 10),
    bold: opts.bold,
    color: opts.color,
  });
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

export function resumeToDocxDocument(resume: Resume): Document {
  const template = getTemplate(resume.meta.template);
  const spacing = DENSITY_SPACING[template.density];
  const page = PAGE_SIZE[resume.meta.pageSize];
  const rightTab = contentWidthTwips(resume.meta.pageSize);
  const nameAccent = accentColor(template, resume.meta.accentHex, "name");
  const dateAccent = accentColor(template, resume.meta.accentHex, "date");
  const nameText = template.nameStyle.caps
    ? resume.contact.fullName.toUpperCase()
    : resume.contact.fullName;

  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      alignment:
        template.nameStyle.align === "center"
          ? AlignmentType.CENTER
          : AlignmentType.LEFT,
      spacing: { after: spacing.paraAfter },
      children: [
        new TextRun({
          text: nameText,
          bold: true,
          font: template.font.heading,
          size: ptToHalfPoints(template.nameStyle.size),
          color: nameAccent,
          characterSpacing: template.nameStyle.tracking
            ? template.nameStyle.tracking * 20
            : undefined,
          allCaps: template.nameStyle.caps,
        }),
      ],
    })
  );

  if (resume.contact.title) {
    children.push(
      new Paragraph({
        alignment:
          template.nameStyle.align === "center"
            ? AlignmentType.CENTER
            : AlignmentType.LEFT,
        spacing: { after: spacing.paraAfter },
        children: [bodyRun(resume.contact.title, template, { size: 11 })],
      })
    );
  }

  const contact = contactLine(resume);
  if (contact) {
    children.push(
      new Paragraph({
        alignment:
          template.nameStyle.align === "center"
            ? AlignmentType.CENTER
            : AlignmentType.LEFT,
        spacing: {
          after:
            template.divider === "none" ? spacing.sectionAfter : spacing.paraAfter,
        },
        children: [bodyRun(contact, template, { size: 9 })],
      })
    );
  }

  const divider = dividerParagraph(template, resume.meta.accentHex, spacing);
  if (divider) children.push(divider);

  if (resume.summary.trim()) {
    children.push(
      sectionHeading(
        SECTION_HEADINGS.summary,
        template,
        resume.meta.accentHex,
        spacing
      )
    );
    children.push(
      new Paragraph({
        spacing: { after: spacing.sectionAfter },
        children: [bodyRun(resume.summary, template)],
      })
    );
  }

  if (resume.skills.length > 0) {
    children.push(
      sectionHeading(
        SECTION_HEADINGS.skills,
        template,
        resume.meta.accentHex,
        spacing
      )
    );
    children.push(
      new Paragraph({
        spacing: { after: spacing.sectionAfter },
        children: [bodyRun(resume.skills.join(", "), template)],
      })
    );
  }

  if (resume.experience.length > 0) {
    children.push(
      sectionHeading(
        SECTION_HEADINGS.experience,
        template,
        resume.meta.accentHex,
        spacing
      )
    );
    for (const job of resume.experience) {
      const dates = dateRange(job.start, job.end);
      children.push(
        new Paragraph({
          spacing: { after: spacing.paraAfter / 2 },
          tabStops: [{ type: TabStopType.RIGHT, position: rightTab }],
          children: [
            bodyRun(job.role, template, { bold: true }),
            bodyRun("\t", template),
            bodyRun(dates, template, { color: dateAccent }),
          ],
        })
      );
      const companyLine = [job.company, job.location].filter(Boolean).join(" — ");
      children.push(
        new Paragraph({
          spacing: { after: spacing.paraAfter / 2 },
          children: [bodyRun(companyLine, template, { bold: true })],
        })
      );
      for (const bullet of job.bullets) {
        children.push(
          new Paragraph({
            spacing: { after: spacing.paraAfter / 2 },
            numbering: { reference: BULLET_REF, level: 0 },
            children: [bodyRun(bullet, template)],
          })
        );
      }
    }
  }

  if (resume.education.length > 0) {
    children.push(
      sectionHeading(
        SECTION_HEADINGS.education,
        template,
        resume.meta.accentHex,
        spacing
      )
    );
    for (const edu of resume.education) {
      const dates = dateRange(edu.start, edu.end);
      children.push(
        new Paragraph({
          spacing: { after: spacing.paraAfter / 2 },
          tabStops: [{ type: TabStopType.RIGHT, position: rightTab }],
          children: [
            bodyRun(edu.degree, template, { bold: true }),
            bodyRun("\t", template),
            bodyRun(dates, template, { color: dateAccent }),
          ],
        })
      );
      const schoolLine = [edu.school, edu.location].filter(Boolean).join(" — ");
      children.push(
        new Paragraph({
          spacing: { after: spacing.paraAfter },
          children: [bodyRun(schoolLine, template)],
        })
      );
      for (const detail of edu.details ?? []) {
        children.push(
          new Paragraph({
            spacing: { after: spacing.paraAfter / 2 },
            numbering: { reference: BULLET_REF, level: 0 },
            children: [bodyRun(detail, template)],
          })
        );
      }
    }
  }

  if (resume.certifications && resume.certifications.length > 0) {
    children.push(
      sectionHeading(
        SECTION_HEADINGS.certifications,
        template,
        resume.meta.accentHex,
        spacing
      )
    );
    for (const cert of resume.certifications) {
      const parts = [cert.name, cert.issuer, cert.year].filter(Boolean);
      children.push(
        new Paragraph({
          spacing: { after: spacing.paraAfter },
          children: [bodyRun(parts.join(" — "), template)],
        })
      );
    }
  }

  if (resume.projects && resume.projects.length > 0) {
    children.push(
      sectionHeading(
        SECTION_HEADINGS.projects,
        template,
        resume.meta.accentHex,
        spacing
      )
    );
    for (const project of resume.projects) {
      children.push(
        new Paragraph({
          spacing: { after: spacing.paraAfter / 2 },
          children: [
            bodyRun(project.name, template, { bold: true }),
            bodyRun(` — ${project.description}`, template),
          ],
        })
      );
      for (const bullet of project.bullets ?? []) {
        children.push(
          new Paragraph({
            spacing: { after: spacing.paraAfter / 2 },
            numbering: { reference: BULLET_REF, level: 0 },
            children: [bodyRun(bullet, template)],
          })
        );
      }
    }
  }

  if (resume.customSections) {
    for (const section of resume.customSections) {
      children.push(
        sectionHeading(section.heading, template, resume.meta.accentHex, spacing)
      );
      for (const item of section.items) {
        children.push(
          new Paragraph({
            spacing: { after: spacing.paraAfter / 2 },
            numbering: { reference: BULLET_REF, level: 0 },
            children: [bodyRun(item, template)],
          })
        );
      }
    }
  }

  return new Document({
    styles: {
      default: {
        document: {
          run: {
            font: template.font.body,
            size: ptToHalfPoints(10),
          },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: BULLET_REF,
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: BULLET_CHAR[template.bullet],
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 720, hanging: 360 },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: page.width,
              height: page.height,
            },
            margin: {
              top: MARGIN_TWIPS,
              right: MARGIN_TWIPS,
              bottom: MARGIN_TWIPS,
              left: MARGIN_TWIPS,
            },
          },
        },
        children,
      },
    ],
  });
}

export async function resumeToDocx(resume: Resume): Promise<Blob> {
  const doc = resumeToDocxDocument(resume);
  return Packer.toBlob(doc);
}
