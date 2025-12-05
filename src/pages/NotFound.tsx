import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

export default function NotFound() {
  return (
    <Layout>
      <section className="py-24 min-h-[60vh] flex items-center hero-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="text-8xl md:text-9xl font-display font-bold gradient-text mb-6">
              404
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Page Not Found
            </h1>
            <p className="text-muted-foreground text-lg mb-10">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/contact">
                  Contact Support
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
