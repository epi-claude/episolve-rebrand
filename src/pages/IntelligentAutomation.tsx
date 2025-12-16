import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cog, Database, Zap, RefreshCw, Link2, Clock, TrendingUp, Users } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const challenges = [
  {
    icon: Database,
    title: "Data Silos",
    description: "Information trapped in disconnected systems, requiring manual copying between platforms and creating inconsistencies."
  },
  {
    icon: Clock,
    title: "Manual Processes",
    description: "Staff spending hours on repetitive tasks like data entry, report generation, and status updates."
  },
  {
    icon: Users,
    title: "Communication Gaps",
    description: "Teams using different tools that don't talk to each other, leading to missed updates and duplicated effort."
  },
  {
    icon: RefreshCw,
    title: "Outdated Information",
    description: "Reports and dashboards that are always behind because updating them requires manual intervention."
  }
];

const solutions = [
  {
    icon: Link2,
    title: "System Integrations",
    description: "Connect your CRM, accounting software, donor management, and project tools so data flows automatically between them."
  },
  {
    icon: Zap,
    title: "Process Automation",
    description: "Automate repetitive workflows like invoice processing, donor acknowledgments, grant reporting, and compliance tracking."
  },
  {
    icon: TrendingUp,
    title: "Real-Time Dashboards",
    description: "Get live visibility into your operations with dashboards that update automatically as data changes across your systems."
  },
  {
    icon: Cog,
    title: "Custom Tools",
    description: "When off-the-shelf doesn't fit, we build exactly what you need—tailored to your unique processes and requirements."
  }
];

const IntelligentAutomation = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 pt-8 pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Cog className="w-4 h-4" />
              <span className="text-sm font-medium">Custom Workflows</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Stop Wasting Time on Tasks<br />
              <span className="text-primary">Software Should Handle</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-8">
              Off-the-shelf software rarely fits perfectly. We build custom integrations 
              and automation tools that eliminate data silos and replace manual labor—so 
              your team can focus on mission-critical work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/contact">Request a Workflow Assessment</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/case-studies">See Our Work</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                The Hidden Cost of Disconnected Systems
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Most not-for-profits operate with a patchwork of software tools that don't 
                communicate. The result? Your team spends more time managing technology 
                than advancing your mission.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
                      <challenge.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {challenge.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Custom Solutions, Not More Software Subscriptions
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We don't sell software licenses. Our engineering team builds integrations 
                and automations tailored to your specific workflows—making your existing 
                tools work better together.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors"
                >
                  <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                    <solution.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {solution.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {solution.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The ROI of Automation
            </h2>
            <p className="text-xl opacity-90 mb-12">
              Every hour your team spends on manual data entry is an hour not spent 
              serving your community. Our clients typically see:
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-primary-foreground/10 rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">15-20</div>
                <div className="text-lg opacity-90">Hours saved per week on manual tasks</div>
              </div>
              <div className="bg-primary-foreground/10 rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">90%</div>
                <div className="text-lg opacity-90">Reduction in data entry errors</div>
              </div>
              <div className="bg-primary-foreground/10 rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">Real-Time</div>
                <div className="text-lg opacity-90">Visibility into operations</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Process
              </h2>
              <p className="text-xl text-muted-foreground">
                We take a pragmatic, phased approach to automation—starting with 
                quick wins and building toward comprehensive integration.
              </p>
            </motion.div>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Workflow Audit",
                  description: "We map your current processes, identify bottlenecks, and document where manual work is consuming the most time."
                },
                {
                  step: "02",
                  title: "Prioritization",
                  description: "Together, we prioritize automation opportunities based on time savings, error reduction, and implementation complexity."
                },
                {
                  step: "03",
                  title: "Build & Test",
                  description: "Our engineering team builds your custom integrations, testing thoroughly in a sandbox before touching production data."
                },
                {
                  step: "04",
                  title: "Deploy & Train",
                  description: "We roll out automations gradually, train your team, and provide documentation so you're never dependent on us."
                },
                {
                  step: "05",
                  title: "Monitor & Optimize",
                  description: "We monitor performance, catch issues early, and continuously refine workflows as your needs evolve."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex gap-6 items-start"
                >
                  <div className="text-4xl font-bold text-primary/30">{item.step}</div>
                  <div className="flex-1 bg-card border border-border rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Reclaim Your Team's Time?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Schedule a free workflow assessment. We'll identify your biggest 
              automation opportunities and show you what's possible—no obligation.
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/contact">Book a Workflow Assessment</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default IntelligentAutomation;
