import type { Resume } from "@/lib/schema";

/** Trades & gig workers — licenses high, contract/gig experience, equipment skills. */
export function tradesPersona(): Resume {
  return {
    contact: {
      fullName: "Jordan Blake",
      title: "Licensed Electrician / Independent Contractor",
      email: "jordan.blake@email.com",
      phone: "(512) 555-0198",
      location: "Austin, TX",
      links: [],
    },
    summary:
      "Reliable journeyman electrician and independent contractor with 7+ years in commercial and residential work. OSHA 30 certified with a strong safety record, clean driving history, and proven on-time delivery for contractors and gig platforms. Known for quality installs, clear customer communication, and self-managed scheduling.",
    skills: [
      "Electrical systems (residential/commercial)",
      "Blueprint reading",
      "Preventive maintenance",
      "Hand & power tools",
      "Equipment operation",
      "Safety compliance",
      "DOT compliance awareness",
      "Forklift certified",
      "Customer service",
      "Independent contractor ops",
      "Punctual / reliable",
      "Job estimating",
      "Troubleshooting",
      "Panel upgrades",
      "Conduit bending",
    ],
    experience: [
      {
        company: "Blake Electric LLC (self-employed)",
        role: "Journeyman Electrician / Owner-Operator",
        location: "Austin, TX",
        start: "03/2021",
        end: "Present",
        bullets: [
          "Completed 180+ residential and light-commercial jobs with zero lost-time incidents",
          "Maintained 98% on-time arrival and 4.9/5 average customer rating across private and contractor clients",
          "Quoted, scheduled, and closed work as sole operator — permitting, materials, and final walkthroughs",
        ],
      },
      {
        company: "Independent Delivery Driver — DoorDash / Uber",
        role: "Gig Economy Driver (supplemental)",
        location: "Austin, TX metro",
        start: "06/2022",
        end: "Present",
        bullets: [
          "Completed 3,000+ deliveries while maintaining a 4.9/5 rating and 98% on-time rate",
          "Self-managed peak-hour routes and multi-app dispatch without missed shifts",
          "Handled high-volume nights with consistent customer communication and safe driving",
        ],
      },
      {
        company: "Metro Build Electrical",
        role: "Apprentice Electrician",
        location: "Round Rock, TX",
        start: "08/2018",
        end: "02/2021",
        bullets: [
          "Supported journeymen on commercial TI projects: rough-in, trim-out, and device installs",
          "Followed lockout/tagout and site safety plans; contributed to incident-free crew record",
          "Read blueprints and material lists; staged tools and materials for multi-floor builds",
        ],
      },
    ],
    education: [
      {
        school: "Austin Community College — Continuing Education",
        degree: "Electrical Trades Certificate / Apprenticeship hours",
        location: "Austin, TX",
        end: "2020",
        details: [
          "Completed registered apprenticeship classroom hours alongside field training",
        ],
      },
    ],
    certifications: [
      {
        name: "Journeyman Electrician License",
        issuer: "State of Texas",
        year: "2021",
      },
      {
        name: "OSHA 30 — Construction",
        issuer: "OSHA Outreach",
        year: "2022",
      },
      {
        name: "OSHA 10 — General Industry",
        issuer: "OSHA Outreach",
        year: "2019",
      },
      {
        name: "Forklift Operator Certification",
        issuer: "Site-certified",
        year: "2020",
      },
      {
        name: "EPA 608 Type II (HVAC cross-training)",
        issuer: "EPA",
        year: "2023",
      },
      {
        name: "CDL Class B (optional transport)",
        issuer: "Texas DPS",
        year: "2024",
      },
    ],
    projects: [],
    customSections: [],
    meta: {
      template: "compact",
      accentHex: "#1E3A5F",
      pageSize: "Letter",
      persona: "trades",
    },
  };
}
