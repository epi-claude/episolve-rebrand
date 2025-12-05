import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { getServiceBySlug, services } from "@/data/services";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const Icon = service.icon;
  const otherServices = services.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to="/services"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Services
            </Link>

            <div className="flex items-start gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                  {service.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                  {service.shortDescription}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                Overview
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-12">
                {service.description}
              </p>

              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                What's Included
              </h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-muted/50"
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* CTA Card */}
              <div className="p-8 rounded-2xl card-gradient border border-border mb-8">
                <h3 className="text-xl font-display font-bold text-foreground mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Let's discuss how {service.title.toLowerCase()} can help your business.
                </p>
                <Button variant="hero" className="w-full" asChild>
                  <Link to={`/contact?service=${service.slug}`}>
                    Request a Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Other Services */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Related Services
                </h4>
                <div className="space-y-3">
                  {otherServices.map((s) => {
                    const SIcon = s.icon;
                    return (
                      <Link
                        key={s.id}
                        to={`/services/${s.slug}`}
                        className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <SIcon className="h-5 w-5 text-primary" />
                        <span className="text-foreground group-hover:text-primary transition-colors">
                          {s.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

