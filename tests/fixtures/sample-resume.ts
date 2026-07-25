import type { Resume } from "@/lib/schema";

export const sampleResume: Resume = {
  contact: {
    fullName: "Alex Rivera",
    title: "Software Engineer",
    email: "alex.rivera@email.com",
    phone: "(555) 010-2000",
    location: "Austin, TX",
    links: [{ label: "LinkedIn", url: "https://linkedin.com/in/alexrivera" }],
  },
  summary:
    "Software engineer with 5 years building cloud APIs. Delivered CI/CD pipelines and cut deploy time 2x.",
  skills: [
    "Python",
    "TypeScript",
    "AWS",
    "CI/CD",
    "Agile",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "REST",
    "GraphQL",
  ],
  experience: [
    {
      company: "CloudNine Systems",
      role: "Senior Software Engineer",
      location: "Austin, TX",
      start: "2021-03",
      end: "Present",
      bullets: [
        "Designed APIs serving 2M requests/day with 99.9% uptime",
        "Led migration to Kubernetes, reducing infra cost 28%",
        "Mentored 4 engineers on code review and testing practices",
      ],
    },
    {
      company: "DataSpark",
      role: "Software Engineer",
      location: "Remote",
      start: "2019-06",
      end: "2021-02",
      bullets: [
        "Built ETL jobs processing 50GB daily with Python and Airflow",
        "Improved test coverage from 40% to 85%",
      ],
    },
  ],
  education: [
    {
      school: "University of Texas",
      degree: "B.S. Computer Science",
      location: "Austin, TX",
      end: "2019",
    },
  ],
  certifications: [{ name: "AWS Solutions Architect Associate", year: "2022" }],
  projects: [
    {
      name: "OpenMetric",
      description: "Open-source metrics dashboard",
      bullets: ["1.2k GitHub stars", "Used by 3 internal teams"],
    },
  ],
  meta: {
    template: "modern",
    accentHex: "#1E3A5F",
    pageSize: "Letter",
    persona: "tech",
  },
};
