import { Briefcase, Shield, Cog, Sparkles } from "lucide-react";

export interface Solution {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  featured: boolean;
  cta?: string;
}

export const solutions: Solution[] = [
  {
    id: "1",
    slug: "fractional-technology-office",
    title: "The Fractional Technology Office",
    shortDescription: "Align your technology with your business goals. From managing vendor relationships to planning multi-year budgets, our Virtual CIO service ensures every dollar you spend on IT drives profit, not just cost.",
    icon: Briefcase,
    featured: true,
  },
  {
    id: "2",
    slug: "risk-insurance",
    title: "AI-Driven Cyber Resilience",
    shortDescription: "Cyber insurance requirements are skyrocketing. We use advanced Adaptive Trust AI to analyze your communication patterns, sandbox threats, and guarantee compliance for your next insurance renewal.",
    icon: Shield,
    featured: true,
  },
  {
    id: "4",
    slug: "ai-development",
    title: "AI & Custom Application Engineering",
    shortDescription: "From intelligent workflow automation to bespoke internal copilots and portals. We build modern, production-ready AI applications that eliminate operational bottlenecks and scale your business.",
    icon: Sparkles,
    featured: true,
    cta: "Explore AI Solutions",
  },
  {
    id: "3",
    slug: "intelligent-automation",
    title: "Custom Workflows",
    shortDescription: "Off-the-shelf software rarely fits perfectly. Our engineering team builds custom integrations and automation tools that eliminate data silos and replace manual labor.",
    icon: Cog,
    featured: true,
  },
];

export const getSolutionBySlug = (slug: string) => solutions.find((s) => s.slug === slug);