import type { Resume } from "@/lib/schema";

export function techPersona(): Resume {
  return {
    contact: {
      fullName: "Alex Rivera",
      title: "Senior Software Engineer",
      email: "alex.rivera@email.com",
      phone: "(415) 555-0142",
      location: "San Francisco, CA",
      links: [
        { label: "LinkedIn", url: "linkedin.com/in/alexrivera" },
        { label: "GitHub", url: "github.com/alexrivera" },
      ],
    },
    summary:
      "Results-driven Senior Software Engineer with 8+ years building scalable web services and cloud-native systems. Expert in Python and Java with deep experience in Agile delivery, CI/CD pipelines, and AWS infrastructure. Passionate about mentoring teams and shipping reliable products that serve millions of users.",
    skills: [
      "Python",
      "Java",
      "TypeScript",
      "React",
      "Node.js",
      "AWS",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Agile",
      "PostgreSQL",
      "Redis",
      "GraphQL",
      "Terraform",
      "System Design",
    ],
    experience: [
      {
        company: "Nimbus Labs",
        role: "Senior Software Engineer",
        location: "San Francisco, CA",
        start: "01/2021",
        end: "Present",
        bullets: [
          "Led migration of monolith to microservices on AWS, cutting deploy time 60% and improving p99 latency by 35% for 2M+ monthly active users.",
          "Designed and implemented CI/CD pipelines with GitHub Actions and Terraform, enabling 40+ engineers to ship safely multiple times per day.",
          "Mentored 5 junior engineers through Agile sprints and code reviews, raising team sprint velocity 25% over two quarters.",
          "Built Python/Java APIs handling 10k RPS with Redis caching and PostgreSQL, achieving 99.95% uptime SLA.",
        ],
      },
      {
        company: "BrightPath Software",
        role: "Software Engineer",
        location: "Oakland, CA",
        start: "06/2017",
        end: "12/2020",
        bullets: [
          "Developed customer-facing React and Node.js features that increased trial-to-paid conversion by 18%.",
          "Automated integration test suites in CI/CD, reducing production regressions 45% year over year.",
          "Collaborated in Agile squads to deliver quarterly roadmap items on time for enterprise SaaS clients.",
          "Optimized Java batch jobs processing 50M records nightly, cutting runtime from 6 hours to 90 minutes.",
        ],
      },
    ],
    education: [
      {
        school: "University of California, Berkeley",
        degree: "B.S. Computer Science",
        location: "Berkeley, CA",
        start: "2013",
        end: "2017",
        details: ["GPA: 3.7", "Dean's List"],
      },
    ],
    certifications: [
      { name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", year: "2022" },
      { name: "Certified Kubernetes Application Developer (CKAD)", issuer: "CNCF", year: "2023" },
    ],
    projects: [
      {
        name: "OpenMetrics Dashboard",
        description: "Open-source observability dashboard for Kubernetes clusters using Python and React.",
        bullets: [
          "Grew to 1.2k GitHub stars; adopted by 3 internal teams for on-call visibility.",
          "Integrated Prometheus and AWS CloudWatch exporters with configurable alert rules.",
        ],
      },
      {
        name: "DeployBot CLI",
        description: "CLI tool streamlining blue-green deploys across AWS ECS and EKS.",
        bullets: [
          "Reduced average release coordination time from 45 minutes to under 10 minutes.",
        ],
      },
    ],
    customSections: [],
    meta: {
      template: "modern",
      accentHex: "#1E3A5F",
      pageSize: "Letter",
      persona: "tech",
    },
  };
}
