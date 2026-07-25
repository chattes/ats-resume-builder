import type { Resume } from "@/lib/schema";

export function educationPersona(): Resume {
  return {
    contact: {
      fullName: "Casey Nguyen, M.Ed.",
      title: "Middle School English Language Arts Teacher",
      email: "casey.nguyen@email.com",
      phone: "(503) 555-0134",
      location: "Portland, OR",
      links: [{ label: "LinkedIn", url: "linkedin.com/in/caseynguyenmed" }],
    },
    summary:
      "Dedicated educator with 9 years teaching middle school ELA and leading curriculum development aligned to state standards. Experienced with IEP/504 accommodations, Google Classroom, and differentiated instruction for diverse learners. Committed to inclusive classrooms where every student grows academically and socially.",
    skills: [
      "Curriculum development",
      "IEP/504",
      "Google Classroom",
      "Differentiated instruction",
      "Classroom management",
      "Formative assessment",
      "Literacy intervention",
      "Collaborative planning",
      "Parent communication",
      "Data-driven instruction",
      "Project-based learning",
      "Social-emotional learning",
      "Professional development",
      "Standards alignment",
      "Student engagement",
    ],
    experience: [
      {
        company: "Riverside Middle School",
        role: "ELA Teacher, Grades 6–8",
        location: "Portland, OR",
        start: "08/2019",
        end: "Present",
        bullets: [
          "Design and deliver standards-aligned ELA curriculum development for 120+ students, raising proficiency rates 18% on state assessments over three years.",
          "Implement IEP/504 accommodations and differentiated instruction strategies, ensuring equitable access for 25+ students with diverse learning needs.",
          "Use Google Classroom and digital tools to streamline assignments, feedback, and family communication with 95%+ weekly engagement.",
          "Lead grade-level PLC on formative assessment practices, improving common assessment reliability and instructional coherence.",
        ],
      },
      {
        company: "Cedar Grove Elementary",
        role: "5th Grade Teacher",
        location: "Beaverton, OR",
        start: "08/2015",
        end: "06/2019",
        bullets: [
          "Taught integrated ELA and social studies using project-based learning, increasing student reading growth by an average of 1.4 grade levels per year.",
          "Collaborated with special education staff on IEP/504 goals and progress monitoring for inclusive classroom placement.",
          "Facilitated after-school literacy club serving 30 students annually, with 80% showing measurable gains on benchmark assessments.",
          "Mentored two student teachers on classroom management, lesson design, and differentiated instruction.",
        ],
      },
    ],
    education: [
      {
        school: "Portland State University",
        degree: "M.Ed. Curriculum and Instruction",
        location: "Portland, OR",
        start: "2017",
        end: "2019",
      },
      {
        school: "University of Oregon",
        degree: "B.A. English; Teaching License (Multiple Subjects)",
        location: "Eugene, OR",
        start: "2011",
        end: "2015",
      },
    ],
    certifications: [
      { name: "Oregon Preliminary Teaching License – Multiple Subjects", issuer: "TSPC", year: "2015" },
      { name: "Google for Education Certified Educator Level 2", issuer: "Google", year: "2022" },
      { name: "SIOP Trained", issuer: "Pearson", year: "2020" },
    ],
    projects: [],
    customSections: [],
    meta: {
      template: "classic",
      accentHex: "#1E3A5F",
      pageSize: "Letter",
      persona: "education",
    },
  };
}
