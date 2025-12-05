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
    name: "Michael Torres",
    role: "Founder & Principal Consultant",
    bio: "20+ years helping businesses leverage technology. Michael founded epiSolve with a mission to make enterprise-grade IT accessible to growing companies.",
    linkedin: "https://linkedin.com",
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "Director of Client Services",
    bio: "Sarah ensures every client engagement delivers measurable results. Her background spans operations management and technology consulting.",
    linkedin: "https://linkedin.com",
  },
  {
    id: "3",
    name: "David Okonkwo",
    role: "Lead Software Engineer",
    bio: "David leads our custom development practice, specializing in building scalable applications that solve real business problems.",
    linkedin: "https://linkedin.com",
  },
  {
    id: "4",
    name: "Lisa Martinez",
    role: "AI & Automation Specialist",
    bio: "Lisa helps clients navigate the AI landscape, identifying practical applications that deliver ROI without the hype.",
    linkedin: "https://linkedin.com",
  },
];
