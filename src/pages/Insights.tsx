import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { insights } from "@/data/insights";

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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Insights() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px]" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
              <span className="gradient-text">Insights</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Practical technology guidance, industry trends, and actionable advice for growing businesses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="grid md:grid-cols-2 gap-8"
          >
            {insights.map((post, index) => (
              <motion.article
                key={post.id}
                variants={fadeInUp}
              >
                <Link
                  to={`/insights/${post.slug}`}
                  className="flex flex-col h-full p-8 rounded-2xl card-gradient border border-border hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {post.category}
                    </span>
                  </div>

                  <h2 className="text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-muted-foreground mb-6 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime} min read
                      </span>
                    </div>

                    <span className="flex items-center text-primary font-medium text-sm group-hover:gap-2 gap-1 transition-all">
                      Read
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Stay in the Loop
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Get practical technology insights delivered to your inbox. No spam, just useful content.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 h-12 px-4 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              <button
                type="submit"
                className="h-12 px-6 rounded-lg cta-gradient font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
