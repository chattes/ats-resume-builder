import type { Resume } from "./schema";

export function emptyResume(): Resume {
  return {
    contact: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      links: [],
    },
    summary: "",
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    customSections: [],
    meta: {
      template: "modern",
      accentHex: "#1E3A5F",
      pageSize: "Letter",
      persona: undefined,
    },
  };
}
