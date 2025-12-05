import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Users, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { EpiHighlight } from "@/components/EpiHighlight";
import { getFeaturedServices } from "@/data/services";
import { getFeaturedInsights } from "@/data/insights";

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

const stats = [
  { value: "20+", label: "Years Experience" },
  { value: "200+", label: "Projects Delivered" },
  { value: "98%", label: "Client Retention" },
  { value: "24/7", label: "Support Available" },
];

const values = [
  {
    icon: Users,
    title: "Partner, Not Vendor",
    description: "We invest in understanding your business, not just your technology.",
  },
  {
    icon: Zap,
    title: "Results-Focused",
    description: "Every recommendation ties back to measurable business outcomes.",
  },
  {
    icon: Shield,
    title: "Plain Language",
    description: "No jargon, no upselling—just honest advice you can act on.",
  },
  {
    icon: TrendingUp,
    title: "Built to Scale",
    description: "Solutions that grow with your business, not against it.",
  },
];

const testimonials = [
  {
    quote: " helped us modernize our entire operation. They took the time to understand our family business and delivered technology that actually fits how we work.",
    hasEpi: true,
    name: "Robert Hernandez",
    title: "CEO, Hernandez Manufacturing",
  },
  {
    quote: "Finally, an IT partner that speaks our language. They've saved us countless hours and helped us make smarter technology investments.",
    hasEpi: false,
    name: "Michelle Wong",
    title: "Executive Director, Newark Community Foundation",
  },
];

export default function Index() {
  const featuredServices = getFeaturedServices();
  const featuredInsights = getFeaturedInsights();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src="/hero-image.jpg"
              alt="Professional business technology"
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
            className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px]"
          />
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ duration: 2, delay: 0.8 }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]"
          />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                Technology Solutions for Business Problems
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight"
            >
              You Work.{" "}
              <span className="gradient-text">We IT.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance"
            >
              Your outsourced IT partner for family-run businesses and non-profits. 
              We make technology work for you—without the jargon or complexity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Book a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/services">
                  Explore Services
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border bg-card/30">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How We Help
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From strategic consulting to hands-on implementation, we provide the technology expertise your business needs.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  variants={fadeInUp}
                >
                  <Link
                    to={`/services/${service.slug}`}
                    className="block h-full p-6 rounded-2xl card-gradient border border-border hover:border-primary/50 transition-all duration-300 group"
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {service.shortDescription}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Button variant="outline" asChild>
              <Link to="/services">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Why Businesses Choose Us
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We're not your typical IT company. Here's what makes us different.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="h-14 w-14 rounded-2xl cta-gradient flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              What Clients Say
            </h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-8 rounded-2xl card-gradient border border-border"
              >
                <blockquote className="text-foreground mb-6 text-lg leading-relaxed">
                  "{testimonial.hasEpi && <EpiHighlight text="epiSolve" />}{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {testimonial.title}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Insights Preview */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Latest Insights
              </h2>
              <p className="text-muted-foreground max-w-xl text-lg">
                Practical technology guidance for growing businesses.
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0" asChild>
              <Link to="/insights">
                All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-8"
          >
            {featuredInsights.map((post) => (
              <motion.article
                key={post.id}
                variants={fadeInUp}
              >
                <Link
                  to={`/insights/${post.slug}`}
                  className="block p-6 rounded-2xl card-gradient border border-border hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {post.category}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {post.readTime} min read
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {post.excerpt}
                  </p>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
              Ready to Transform Your IT?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Let's have a conversation about your technology challenges and how we can help solve them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Book a Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <a href="tel:+19737400414">
                  Call (973) 740-0414
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
