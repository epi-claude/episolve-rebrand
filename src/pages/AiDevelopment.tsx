import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot, FileStack, LayoutDashboard, Plug, Zap, Brain, ShieldCheck, Cloud } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const builds = [
  { icon: Bot, title: "Internal AI Copilots & Assistants", description: "Custom conversational tools trained on your internal documentation, SOPs, and knowledge bases with enterprise access controls." },
  { icon: FileStack, title: "Intelligent Document & Data Pipelines", description: "Automated extraction, categorization, and processing of invoices, contracts, customer forms, and operational data." },
  { icon: LayoutDashboard, title: "Custom Web Applications & Portals", description: "Client portals, partner dashboards, and bespoke SaaS tools built rapidly using modern full-stack architectures." },
  { icon: Plug, title: "API & System Integrations", description: "Connecting legacy databases, CRMs, POS systems, and ERPs with real-time AI processing layers." },
];

const method = [
  { icon: Zap, title: "Agentic Rapid Development", description: "Claude Code and Lovable accelerate design and build, compressing months of work into days and weeks." },
  { icon: Brain, title: "Multi-Model Intelligence", description: "We pick the right model for the job—Gemini, ChatGPT, and others—based on accuracy, cost, and data sensitivity." },
  { icon: ShieldCheck, title: "Engineering Discipline", description: "Every release goes through human code review, database security hardening, and access-control testing." },
  { icon: Cloud, title: "Secure Cloud Deployment", description: "Production-grade hosting, monitoring, and backups so your application stays reliable as you scale." },
];

export default function AiDevelopment() {
  useEffect(() => {
    document.title = "AI & Custom Application Engineering | Episolve";
  }, []);

  return (
    <Layout>
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 pt-8 pb-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
              AI & App Engineering
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 leading-[1.1]">
              Practical AI Applications. <span className="gradient-text">Built for Real Business Outcomes.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl">
              Cut through the AI hype. We design, build, and deploy bespoke AI applications, automated workflows, and internal assistants tailored to how your business actually operates.
            </p>
            <Button size="lg" asChild>
              <Link to="/contact#get-in-touch">
                Schedule an AI Strategy Session
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-12 text-center">What We Build</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {builds.map(({ icon: Icon, title, description }) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-8 rounded-2xl card-gradient border border-border hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Our AI Engineering Stack & Methodology</h2>
            <p className="text-lg text-muted-foreground">
              A hybrid approach: high-speed development with agentic tools, multi-model intelligence, and the rock-solid review, security, and deployment standards your business depends on.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {method.map(({ icon: Icon, title, description }) => (
              <div key={title} className="p-6 rounded-2xl bg-background border border-border">
                <Icon className="h-6 w-6 text-primary mb-4" />
                <h3 className="font-display font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {["Claude Code", "Lovable", "OpenAI / ChatGPT", "Google Gemini", "Secure Cloud Architecture"].map((t) => (
              <span key={t} className="px-4 py-2 rounded-full text-sm font-medium bg-background border border-border text-foreground">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">Have an operational bottleneck or an app idea?</h2>
            <p className="text-lg text-muted-foreground mb-10">
              Let's explore how custom AI tooling can solve it without enterprise price tags or lengthy dev cycles.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact#get-in-touch">
                Book an AI Exploration Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
