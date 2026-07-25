import type { Resume } from "@/lib/schema";

export function healthcarePersona(): Resume {
  return {
    contact: {
      fullName: "Jordan Mitchell, RN, BSN",
      title: "Registered Nurse – Medical/Surgical",
      email: "jordan.mitchell@email.com",
      phone: "(312) 555-0198",
      location: "Chicago, IL",
      links: [{ label: "LinkedIn", url: "linkedin.com/in/jordanmitchellrn" }],
    },
    summary:
      "Compassionate Registered Nurse with 6 years of medical/surgical experience delivering high-quality patient care in fast-paced hospital settings. Proficient in EHR/Epic documentation, BLS/ACLS response, and HIPAA-compliant workflows. Known for calm leadership during emergencies and strong collaboration with interdisciplinary care teams.",
    skills: [
      "Patient care",
      "EHR/Epic",
      "BLS",
      "ACLS",
      "HIPAA",
      "Medication administration",
      "IV therapy",
      "Wound care",
      "Patient education",
      "Care coordination",
      "Telemetry monitoring",
      "Infection control",
      "Charge nurse duties",
      "Fall prevention",
      "Discharge planning",
    ],
    experience: [
      {
        company: "Lakeside Medical Center",
        role: "Registered Nurse, Med/Surg",
        location: "Chicago, IL",
        start: "03/2020",
        end: "Present",
        bullets: [
          "Provide direct patient care for 5–6 acute med/surg patients per shift, maintaining zero medication errors over 18 consecutive months.",
          "Document assessments, interventions, and outcomes in EHR/Epic with 100% chart completion before end of shift.",
          "Respond as ACLS/BLS team member to rapid responses, contributing to a 20% improvement in code blue survival metrics unit-wide.",
          "Educate patients and families on post-discharge plans, reducing 30-day readmissions 12% for assigned caseload.",
        ],
      },
      {
        company: "Midwest Community Hospital",
        role: "Registered Nurse, Telemetry",
        location: "Evanston, IL",
        start: "07/2018",
        end: "02/2020",
        bullets: [
          "Monitored cardiac telemetry patients and escalated rhythm changes per protocol, preventing adverse events for high-risk populations.",
          "Upheld HIPAA standards while coordinating care with physicians, case managers, and ancillary staff across shifts.",
          "Precepted 4 new graduate nurses on patient care workflows, medication safety, and infection control practices.",
          "Led unit fall-prevention initiative that cut inpatient falls 30% within six months.",
        ],
      },
    ],
    education: [
      {
        school: "University of Illinois at Chicago",
        degree: "Bachelor of Science in Nursing (BSN)",
        location: "Chicago, IL",
        start: "2014",
        end: "2018",
        details: ["Sigma Theta Tau Honor Society"],
      },
    ],
    certifications: [
      { name: "Registered Nurse (RN)", issuer: "Illinois Board of Nursing", year: "2018" },
      { name: "Basic Life Support (BLS)", issuer: "American Heart Association", year: "2025" },
      { name: "Advanced Cardiovascular Life Support (ACLS)", issuer: "American Heart Association", year: "2025" },
      { name: "NIH Stroke Scale (NIHSS)", issuer: "AHA/ASA", year: "2024" },
    ],
    projects: [],
    customSections: [],
    meta: {
      template: "classic",
      accentHex: "#1E3A5F",
      pageSize: "Letter",
      persona: "healthcare",
    },
  };
}
