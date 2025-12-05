import { Server, Code, Brain, Plug, Shield, Cloud, HeadphonesIcon, Cog } from "lucide-react";

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  featured: boolean;
}

export const services: Service[] = [
  {
    id: "1",
    slug: "it-consulting",
    title: "IT Consulting",
    shortDescription: "Strategic technology guidance tailored to your business goals and growth trajectory.",
    description: "We partner with you to understand your business challenges and develop technology strategies that drive real results. From infrastructure planning to digital transformation, we provide the expertise you need to make informed decisions.",
    icon: Cog,
    features: [
      "Technology roadmap development",
      "Infrastructure assessment",
      "Vendor evaluation & selection",
      "IT budget optimization",
      "Digital transformation strategy",
      "Security posture review",
    ],
    featured: true,
  },
  {
    id: "2",
    slug: "software-development",
    title: "Software Development",
    shortDescription: "Custom applications built to streamline your operations and solve unique challenges.",
    description: "We build custom software solutions that perfectly fit your workflow. Whether you need a customer portal, internal tool, or process automation, we deliver clean, maintainable code that grows with your business.",
    icon: Code,
    features: [
      "Custom web applications",
      "Internal business tools",
      "API development & integration",
      "Database design",
      "Mobile-responsive solutions",
      "Legacy system modernization",
    ],
    featured: true,
  },
  {
    id: "3",
    slug: "ai-solutions",
    title: "AI Solutions",
    shortDescription: "Practical AI implementation to automate tasks and unlock insights from your data.",
    description: "Cut through the AI hype. We help you identify where artificial intelligence can actually benefit your business, then implement solutions that deliver measurable ROI. From chatbots to predictive analytics, we make AI accessible.",
    icon: Brain,
    features: [
      "AI readiness assessment",
      "Chatbot & virtual assistants",
      "Document processing automation",
      "Predictive analytics",
      "AI workflow integration",
      "Team training & adoption",
    ],
    featured: true,
  },
  {
    id: "4",
    slug: "integration",
    title: "Integration Services",
    shortDescription: "Connect your systems to eliminate data silos and automate workflows across platforms.",
    description: "Your tools should work together, not against each other. We connect your CRM, accounting, operations, and marketing systems to create seamless workflows that save time and reduce errors.",
    icon: Plug,
    features: [
      "System integration & APIs",
      "Data synchronization",
      "Workflow automation",
      "CRM integration",
      "Accounting system connections",
      "Third-party app integration",
    ],
    featured: true,
  },
  {
    id: "5",
    slug: "managed-it",
    title: "Managed IT",
    shortDescription: "Proactive IT support and management so you can focus on running your business.",
    description: "Stop worrying about IT issues. Our managed services provide proactive monitoring, maintenance, and support for your entire technology infrastructure. We handle the tech so you can focus on growth.",
    icon: HeadphonesIcon,
    features: [
      "24/7 monitoring",
      "Help desk support",
      "Patch management",
      "Backup & disaster recovery",
      "Hardware procurement",
      "Vendor management",
    ],
    featured: false,
  },
  {
    id: "6",
    slug: "cloud-services",
    title: "Cloud Services",
    shortDescription: "Cloud migration and management to increase flexibility and reduce costs.",
    description: "Move to the cloud with confidence. We help you choose the right cloud platforms, migrate your data securely, and optimize your cloud infrastructure for performance and cost efficiency.",
    icon: Cloud,
    features: [
      "Cloud migration planning",
      "Microsoft 365 deployment",
      "AWS & Azure management",
      "Cloud cost optimization",
      "Hybrid cloud solutions",
      "Cloud security",
    ],
    featured: false,
  },
  {
    id: "7",
    slug: "cybersecurity",
    title: "Cybersecurity",
    shortDescription: "Protect your business with comprehensive security measures and compliance support.",
    description: "Security isn't optional. We implement multi-layered protection for your business, from employee training to advanced threat detection. Stay protected and compliant without the complexity.",
    icon: Shield,
    features: [
      "Security assessments",
      "Employee security training",
      "Endpoint protection",
      "Email security",
      "Compliance support",
      "Incident response planning",
    ],
    featured: false,
  },
  {
    id: "8",
    slug: "infrastructure",
    title: "Infrastructure",
    shortDescription: "Design, deploy, and maintain reliable IT infrastructure for your business.",
    description: "Build a solid foundation. We design and implement IT infrastructure that's reliable, scalable, and secure. From networks to servers, we ensure your technology backbone supports your business needs.",
    icon: Server,
    features: [
      "Network design & deployment",
      "Server setup & management",
      "Storage solutions",
      "Virtualization",
      "Business continuity",
      "Performance optimization",
    ],
    featured: false,
  },
];

export const getFeaturedServices = () => services.filter((s) => s.featured);
export const getServiceBySlug = (slug: string) => services.find((s) => s.slug === slug);
