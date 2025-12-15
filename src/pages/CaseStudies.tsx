import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function CaseStudies() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-32 min-h-[60vh] flex items-center relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src="/hero-case-studies.jpg"
              alt="Technology network background"
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-background/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80" />
          
          {/* Animated accent glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
              Case Studies
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Real stories of how we've helped organizations overcome technology challenges and achieve their goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wire Fraud Case Study */}
      <section className="py-24 bg-card">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <span className="text-muted-foreground font-medium">Featured Case Study</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-8">
              Stopping the Bleed: How a NJ Non-Profit Recovered from Wire Fraud
            </h2>

            <div className="space-y-12">
              {/* The Challenge */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="p-8 rounded-2xl dark-gradient border border-white/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-white">
                    The Challenge
                  </h3>
                </div>
                <p className="text-white/70 text-lg leading-relaxed pl-14">
                  A prominent non-profit suffered a targeted Business Email Compromise (BEC) attack. Hackers compromised a weak password, monitored email, and authorized a fraudulent wire transfer.
                </p>
              </motion.div>

              {/* The Fix */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="p-8 rounded-2xl dark-gradient border border-white/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-[hsl(213_37%_47%)] flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-white">
                    The Fix
                  </h3>
                </div>
                <p className="text-white/70 text-lg leading-relaxed pl-14">
                  Episolve acted as the Crisis Response Team. We severed access, traced the breach, and deployed our <span className="text-[hsl(210_47%_70%)] font-medium">Adaptive Trust AI</span> stack. We implemented mandatory 2FA and enterprise Password Managers.
                </p>
              </motion.div>

              {/* The Result */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="p-8 rounded-2xl dark-gradient border border-[hsl(210_47%_70%)]/30"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-[hsl(213_37%_47%)] flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-white">
                    The Result
                  </h3>
                </div>
                <ul className="space-y-3 text-white/70 text-lg pl-14">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[hsl(210_47%_70%)] flex-shrink-0 mt-1" />
                    <span>Zero recurrence of account takeovers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[hsl(210_47%_70%)] flex-shrink-0 mt-1" />
                    <span>Full compliance with new Cyber Liability Insurance requirements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[hsl(210_47%_70%)] flex-shrink-0 mt-1" />
                    <span>A culture shifted from 'fear' to 'defense'</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Don't Wait for a Crisis
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Proactive security is always more cost-effective than crisis response. Let's assess your risk before attackers do.
            </p>
            <Button variant="default" size="lg" asChild className="text-base">
              <Link to="/contact">
                Book a Strategic Risk Audit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}