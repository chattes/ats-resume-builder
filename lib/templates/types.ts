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
