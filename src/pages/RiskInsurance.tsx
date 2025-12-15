import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Brain, FlaskConical, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const features = [
  {
    icon: Brain,
    title: "Adaptive Trust AI",
    description: "Traditional security looks for keywords. Our system utilizes Adaptive Trust AI to learn the unique communication patterns of your team, flagging anomalies like Business Email Compromise (BEC) before they hit the inbox.",
  },
  {
    icon: FlaskConical,
    title: "Local Sandboxing",
    subtitle: "Zero-Risk Attachment Analysis",
    description: "Files are detonated and analyzed in a fully isolated, local environment before they reach your network. Your data never leaves your control.",
  },
  {
    icon: FileCheck,
    title: "Insurance Readiness",
    description: "We identify and fix security gaps before your underwriter does. Our 'Proof of Defense' logs help you lower premiums and ensure coverage.",
  },
];

export default function RiskInsurance() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-32 relative overflow-hidden hero-gradient">
        {/* Background effects */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <span className="text-primary font-medium">Risk & Insurance Solutions</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-[1.1]">
              Secure Your Data.<br />
              Lower Your Risk.<br />
              <span className="gradient-text">Guarantee Your Coverage.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Cyber insurance premiums are rising. We provide the AI-driven evidence and defense mechanisms you need to satisfy underwriters.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The "Active Defense" Stack */}
      <section className="py-24 bg-card">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              The "Active Defense" Stack
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Multi-layered protection powered by AI and designed for insurance compliance.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="p-8 rounded-2xl dark-gradient border border-white/10"
                >
                  <div className="h-14 w-14 rounded-xl bg-[hsl(213_37%_47%)] flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  {feature.subtitle && (
                    <p className="text-[hsl(210_47%_70%)] text-sm mb-3">{feature.subtitle}</p>
                  )}
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                Why Cyber Insurance Matters Now
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  Cyber insurance requirements are becoming increasingly stringent. Underwriters are demanding proof of active security measures—not just policies on paper.
                </p>
                <p>
                  Without adequate protection and documentation, you face higher premiums, coverage gaps, or outright denial of claims when you need protection most.
                </p>
                <p>
                  Our approach provides both the active defense systems and the audit-ready documentation that underwriters demand.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="p-8 rounded-2xl card-gradient border border-border">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Security Assessment</h4>
                      <p className="text-muted-foreground text-sm">We identify gaps in your current security posture</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Deploy Active Defense</h4>
                      <p className="text-muted-foreground text-sm">Implement AI-powered threat detection and sandboxing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Generate Proof of Defense</h4>
                      <p className="text-muted-foreground text-sm">Create audit-ready documentation for underwriters</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Secure Coverage</h4>
                      <p className="text-muted-foreground text-sm">Lower premiums and guaranteed renewals</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Don't wait for a non-renewal notice.
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Get ahead of your insurance requirements with a comprehensive security audit.
            </p>
            <Button variant="default" size="lg" asChild className="text-base">
              <Link to="/contact">
                Book Your Cyber-Insurance Readiness Audit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}