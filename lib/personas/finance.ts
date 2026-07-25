import type { Resume } from "@/lib/schema";

export function financePersona(): Resume {
  return {
    contact: {
      fullName: "Taylor Brooks, CPA",
      title: "Senior Financial Analyst",
      email: "taylor.brooks@email.com",
      phone: "(212) 555-0167",
      location: "New York, NY",
      links: [{ label: "LinkedIn", url: "linkedin.com/in/taylorbrookscpa" }],
    },
    summary:
      "Detail-oriented CPA and Senior Financial Analyst with 7+ years in corporate finance, reporting, and FP&A. Skilled in GAAP accounting, forecasting, and month-end reconciliation for multi-entity organizations. Trusted partner to leadership for budget variance analysis and data-driven investment decisions.",
    skills: [
      "CPA",
      "GAAP",
      "Forecasting",
      "Reconciliation",
      "Financial modeling",
      "FP&A",
      "Budgeting",
      "Variance analysis",
      "Excel / Power Query",
      "SAP",
      "Hyperion",
      "SQL",
      "Internal controls",
      "Audit support",
      "Cash flow analysis",
    ],
    experience: [
      {
        company: "Horizon Capital Group",
        role: "Senior Financial Analyst",
        location: "New York, NY",
        start: "08/2021",
        end: "Present",
        bullets: [
          "Own monthly forecasting and rolling 12-month outlook for a $400M revenue portfolio, improving forecast accuracy from 88% to 96%.",
          "Lead GAAP-compliant month-end close and account reconciliation across 12 entities, shortening close cycle from 10 to 6 business days.",
          "Built driver-based financial models used by CFO for board packs, supporting two successful capital raises totaling $75M.",
          "Partnered with internal audit to remediate control gaps, resulting in zero material weaknesses in the latest external audit.",
        ],
      },
      {
        company: "Pinnacle Manufacturing Inc.",
        role: "Staff Accountant",
        location: "Jersey City, NJ",
        start: "06/2017",
        end: "07/2021",
        bullets: [
          "Performed full-cycle reconciliation of balance sheet accounts and prepared journal entries under US GAAP.",
          "Supported annual external audit by compiling PBC schedules and resolving auditor inquiries within agreed SLAs.",
          "Automated recurring Excel/Power Query reports, saving the accounting team 15 hours per month.",
          "Assisted FP&A with quarterly budgeting process and variance analysis for three plant locations.",
        ],
      },
    ],
    education: [
      {
        school: "New York University, Stern School of Business",
        degree: "B.S. Accounting",
        location: "New York, NY",
        start: "2013",
        end: "2017",
        details: ["Magna Cum Laude"],
      },
    ],
    certifications: [
      { name: "Certified Public Accountant (CPA)", issuer: "New York State Board", year: "2019" },
      { name: "Chartered Financial Analyst (CFA) Level I", issuer: "CFA Institute", year: "2023" },
    ],
    projects: [],
    customSections: [],
    meta: {
      template: "executive",
      accentHex: "#1E3A5F",
      pageSize: "Letter",
      persona: "finance",
    },
  };
}
