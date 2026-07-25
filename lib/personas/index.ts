import type { PersonaId, Resume } from "@/lib/schema";
import { techPersona } from "./tech";
import { healthcarePersona } from "./healthcare";
import { financePersona } from "./finance";
import { educationPersona } from "./education";
import { tradesPersona } from "./trades";

const MAP: Record<PersonaId, () => Resume> = {
  tech: techPersona,
  healthcare: healthcarePersona,
  finance: financePersona,
  education: educationPersona,
  trades: tradesPersona,
};

export function getPersona(id: PersonaId): Resume {
  return structuredClone(MAP[id]());
}

export function listPersonas() {
  return [
    {
      id: "tech" as const,
      name: "Tech / Software",
      description: "Engineers & IT",
    },
    {
      id: "healthcare" as const,
      name: "Healthcare / Nursing",
      description: "Clinical roles",
    },
    {
      id: "finance" as const,
      name: "Finance / Accounting",
      description: "Finance pros",
    },
    {
      id: "education" as const,
      name: "Education",
      description: "Teachers & school staff",
    },
    {
      id: "trades" as const,
      name: "Trades & Gig",
      description: "Skilled trades & gig workers",
    },
  ];
}
