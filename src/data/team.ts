export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  linkedin?: string;
}

export const team: TeamMember[] = [
  {
    id: "1",
    name: "Richard Baldwin",
    role: "Founder & vCIO",
    bio: "20+ years making enterprise IT accessible. Michael acts as the Virtual CIO for our clients, aligning complex infrastructure with business outcomes.",
    linkedin: "https://linkedin.com",
  },
  {
    id: "2",
    name: "Stephanie Meininger",
    role: "Director of Client Services",
    bio: "Ensuring every project delivers measurable ROI and on-time delivery.",
    linkedin: "https://linkedin.com",
  },
  {
    id: "3",
    name: "Parimal Jariwala",
    role: "Lead Software Engineer",
    bio: "Specializing in 'Pragmatic Engineering'—building scalable apps that solve operational bottlenecks.",
    linkedin: "https://linkedin.com",
  },
  {
    id: "4",
    name: "Vincent Cayenne",
    role: "Risk & Automation Specialist",
    bio: "Lisa leverages AI to analyze cybersecurity gaps and automate compliance reporting, helping clients navigate the complex world of cyber insurance.",
    linkedin: "https://linkedin.com",
  },
];