import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { services } from "@/data/services";

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

export default function Services() {
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
              src="/hero-image.jpg"
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
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Comprehensive technology solutions tailored for growing businesses. From strategic consulting to hands-on implementation, we've got you covered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  variants={fadeInUp}
                >
                  <Link
                    to={`/services/${service.slug}`}
                    className="flex flex-col h-full p-8 rounded-2xl card-gradient border border-border hover:border-primary/50 transition-all duration-300 group"
                  >
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 flex-1">
                      {service.shortDescription}
                    </p>
                    <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
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
              Not Sure Where to Start?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Let's have a conversation. We'll help you identify the right technology priorities for your business.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Schedule a Discovery Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
