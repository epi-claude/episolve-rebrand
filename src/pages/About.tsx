import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Linkedin, Globe, Building, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { team } from "@/data/team";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-32 relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src="/hero-about.jpg"
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
              Enterprise Strategy.<br />
              <span className="gradient-text">Boutique Agility.</span><br />
              Global Reach.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              We started with a simple belief: Growing organizations deserve the same level of technology leadership as the Fortune 500.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Value Block */}
      <section className="py-24 bg-card">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-8">
              "We Eat Our Own Cooking"
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We are pragmatic engineers. If a technology isn't good enough for us, it isn't good enough for you. We test, validate, and utilize every strategy in-house before we recommend it to a client.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="p-8 rounded-2xl card-gradient border border-border">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Building className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-4">
                Enterprise Strategy
              </h3>
              <p className="text-muted-foreground">
                Fortune 500 methodologies and frameworks adapted for growing organizations.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="p-8 rounded-2xl card-gradient border border-border">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-4">
                Boutique Agility
              </h3>
              <p className="text-muted-foreground">
                Fast decisions, direct access to experts, and personalized attention at every step.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="p-8 rounded-2xl card-gradient border border-border">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-4">
                Global Reach
              </h3>
              <p className="text-muted-foreground">
                Technology partnerships and vendor relationships that span continents.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-card">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Meet the Team
            </h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {team.map((member) => (
              <motion.div
                key={member.id}
                variants={fadeInUp}
                className="p-6 rounded-2xl dark-gradient border border-white/10 text-center group"
              >
                <div className="h-24 w-24 rounded-full bg-[hsl(213_37%_47%)] mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-white">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <h3 className="text-lg font-display font-semibold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-[hsl(210_47%_70%)] text-sm mb-3">{member.role}</p>
                <p className="text-white/70 text-sm mb-4">{member.bio}</p>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-white/10 hover:bg-accent/20 text-white hover:text-accent transition-colors"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
              </motion.div>
            ))}
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
              Ready to Partner With Us?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Let's discuss how we can bring enterprise-grade technology leadership to your organization.
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