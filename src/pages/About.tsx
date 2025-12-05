import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Linkedin, Target, Heart, Lightbulb, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { EpiHighlight } from "@/components/EpiHighlight";
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

const values = [
  {
    icon: Target,
    title: "Results First",
    description: "We measure success by your outcomes, not our hours. Every engagement is designed to deliver measurable business value.",
  },
  {
    icon: Heart,
    title: "Genuine Partnership",
    description: "We're invested in your success. When you win, we win. That's the foundation of every client relationship.",
  },
  {
    icon: Lightbulb,
    title: "Practical Innovation",
    description: "We embrace new technology when it makes sense—not for its own sake. Innovation should solve problems, not create them.",
  },
  {
    icon: Handshake,
    title: "Honest Communication",
    description: "No jargon. No overselling. Just clear, straightforward advice you can trust and act on.",
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
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
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
              About <EpiHighlight text="epiSolve" />
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              We're a technology consulting firm built for businesses that value relationships over transactions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                <EpiHighlight text="epiSolve" /> was founded with a simple observation: small and mid-size businesses deserve the same quality technology guidance that Fortune 500 companies get—without the enterprise price tag or corporate bureaucracy.
              </p>
                <p>
                  Based in Newark, NJ, we serve family-run businesses and non-profits across the NYC/NJ tristate region. Our clients aren't just customers—they're partners we're genuinely invested in helping succeed.
                </p>
                <p>
                  We believe technology should simplify your business, not complicate it. That's why we focus on practical solutions that deliver real results, explained in plain language you can actually understand.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl md:text-7xl font-display font-bold gradient-text mb-4">
                    15+
                  </div>
                  <div className="text-xl text-foreground font-semibold mb-2">
                    Years of Experience
                  </div>
                  <div className="text-muted-foreground">
                    Helping businesses leverage technology
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              What We Stand For
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Our values guide every decision we make and every project we take on.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-8"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex gap-6 p-8 rounded-2xl card-gradient border border-border"
                >
                  <div className="h-14 w-14 rounded-xl cta-gradient flex items-center justify-center flex-shrink-0">
                    <Icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
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
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Experienced professionals committed to your success.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                variants={fadeInUp}
                className="p-6 rounded-2xl card-gradient border border-border text-center group"
              >
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-foreground">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-primary text-sm mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary transition-colors"
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
      <section className="py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Let's Work Together
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Ready to see what the right technology partner can do for your business?
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Start a Conversation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
