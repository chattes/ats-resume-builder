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
