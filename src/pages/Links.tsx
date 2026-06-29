import { useEffect } from "react";
import {
  ArrowUpRight,
  Calendar,
  ShieldCheck,
  Compass,
  Phone,
  MapPin,
  Clock,
  Linkedin,
  Facebook,
  Globe,
  Mail,
  Briefcase,
  Cog,
  Shield,
} from "lucide-react";
import logo from "@/assets/episolve-logo-horizontal.png";

const groups: {
  label: string;
  links: { label: string; href: string; icon: typeof Globe; external?: boolean }[];
}[] = [
  {
    label: "Connect",
    links: [
      { label: "Contact", href: "https://episolve.com/contact#get-in-touch", icon: Mail, external: true },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/episolve-llc/",
        icon: Linkedin,
        external: true,
      },
      {
        label: "Facebook",
        href: "https://www.facebook.com/profile.php?id=61574314388662",
        icon: Facebook,
        external: true,
      },
    ],
  },
  {
    label: "Start Here",
    links: [
      { label: "Website", href: "https://episolve.com", icon: Globe, external: true },
      { label: "About Episolve", href: "https://episolve.com/about", icon: Compass, external: true },
      { label: "Insights", href: "https://episolve.com/insights", icon: Briefcase, external: true },
    ],
  },
  {
    label: "Solutions",
    links: [
      {
        label: "Fractional Technology Office",
        href: "https://episolve.com/solutions/fractional-technology-office",
        icon: Briefcase,
        external: true,
      },
      {
        label: "AI-Driven Cyber Resilience",
        href: "https://episolve.com/solutions/risk-insurance",
        icon: Shield,
        external: true,
      },
      {
        label: "Custom Workflows",
        href: "https://episolve.com/solutions/intelligent-automation",
        icon: Cog,
        external: true,
      },
    ],
  },
];

const pillars = [
  {
    title: "Fractional Technology Office",
    desc: "Vendor strategy, multi-year budgets, and vCIO leadership that aligns IT to a 3-year growth plan.",
    icon: Briefcase,
  },
  {
    title: "AI-Driven Cyber Resilience",
    desc: "Adaptive Trust AI for threat sandboxing, communication analysis, and cyber insurance readiness.",
    icon: Shield,
  },
  {
    title: "Custom Workflows",
    desc: "Engineered integrations and automation that eliminate data silos and manual labor.",
    icon: Cog,
  },
];

export default function Links() {
  useEffect(() => {
    document.title = "Episolve — Strategic Technology Leadership";
    const meta =
      document.querySelector('meta[name="description"]') ??
      Object.assign(document.createElement("meta"), { name: "description" });
    meta.setAttribute(
      "content",
      "Episolve link hub — book a discovery call, request a strategic risk audit, and explore our approach to fractional technology leadership.",
    );
    if (!meta.parentElement) document.head.appendChild(meta);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/40">
      <div className="mx-auto w-full max-w-[560px] px-5 pt-10 pb-16 sm:pt-14">
        {/* Brand header */}
        <header className="flex flex-col items-center text-center">
          <img src={logo} alt="Episolve" className="h-16 sm:h-20 mb-6" />
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
            Strategic Technology Partner
          </p>
          <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            Strategic technology leadership for growth-focused organizations.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[440px]">
            Secure your data, modernize your workflows, and reduce operational risk. Built for
            businesses and non-profits that value relationships over transactions.
          </p>
        </header>

        {/* Primary CTA block */}
        <section className="mt-10 space-y-3">
          <a
            href="https://episolve.com/contact#get-in-touch"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between w-full rounded-2xl bg-accent text-accent-foreground px-5 py-4 font-semibold shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-3">
              <Calendar className="h-5 w-5" />
              Book a Discovery Call
            </span>
            <ArrowUpRight className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href="https://episolve.com/contact#get-in-touch"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between w-full rounded-2xl bg-primary text-primary-foreground px-5 py-4 font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
          >
            <span className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5" />
              Book a Strategic Risk Audit
            </span>
            <ArrowUpRight className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href="https://episolve.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between w-full rounded-2xl border border-border bg-card/60 backdrop-blur px-5 py-4 font-medium text-foreground transition-all hover:border-primary/40 hover:bg-card"
          >
            <span className="flex items-center gap-3">
              <Compass className="h-5 w-5 text-primary" />
              Explore Our Approach
            </span>
            <ArrowUpRight className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        </section>

        {/* Solutions preview */}
        <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-4">
            What We Do
          </p>
          <ul className="divide-y divide-border/60 border-y border-border/60">
            {pillars.map((p) => (
              <li key={p.title} className="flex gap-4 py-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <p.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-foreground text-sm">{p.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Quick links */}
        <section className="mt-12 space-y-7">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-3">
                {g.label}
              </p>
              <ul className="space-y-2">
                {g.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="group flex items-center justify-between rounded-xl border border-border/60 bg-card/40 px-4 py-3 transition-all hover:border-primary/40 hover:bg-card hover:translate-x-0.5"
                    >
                      <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                        <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        {link.label}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Trust strip */}
        <section className="mt-12 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/[0.04] to-accent/[0.06] p-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold mb-3">
            Why Episolve
          </p>
          <ul className="space-y-2.5 text-sm text-foreground/90">
            {[
              "Built for values-driven organizations",
              "Strategic guidance, not reactive support",
              "Technology aligned to a 3-year growth plan",
              "Trusted by organizations in the Tri-State Area",
            ].map((line) => (
              <li key={line} className="flex gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-4">
            Contact
          </p>
          <ul className="space-y-3 text-sm text-foreground/90">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary" />
              <a href="tel:+19737400414" className="hover:text-primary transition-colors">
                (973) 740-0414
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary" />
              Newark, NJ — serving the Tri-State Area
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              Mon–Fri, 9am–5pm EST
            </li>
          </ul>

          <a
            href="https://episolve.com/contact#get-in-touch"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 group flex items-center justify-between w-full rounded-2xl bg-accent text-accent-foreground px-5 py-4 font-semibold shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-3">
              <Calendar className="h-5 w-5" />
              Start a Conversation
            </span>
            <ArrowUpRight className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>
        </section>

        {/* Footer */}
        <footer className="mt-14 pt-6 border-t border-border/60 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Episolve. Strategic Technology Leadership.
          </p>
        </footer>
      </div>
    </div>
  );
}