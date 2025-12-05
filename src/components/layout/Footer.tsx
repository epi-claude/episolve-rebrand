import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EpiHighlight } from "@/components/EpiHighlight";
import logo from "@/assets/episolve-logo-horizontal.png";

const footerLinks = {
  services: [
    { name: "IT Consulting", href: "/services/it-consulting" },
    { name: "Software Development", href: "/services/software-development" },
    { name: "AI Solutions", href: "/services/ai-solutions" },
    { name: "Integration Services", href: "/services/integration" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Insights", href: "/insights" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-muted/30">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img 
                src={logo} 
                alt="epiSolve LLC" 
                className="h-20 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Technology Solutions for Business Problems. Helping family-run businesses and non-profits thrive with modern IT.
            </p>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get insights on technology trends and business solutions.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Your email"
                className="bg-background border-border"
              />
              <Button variant="default" size="icon">
                <ArrowRight size={16} />
              </Button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm text-muted-foreground">
            <a href="mailto:hello@episolve.com" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail size={16} />
              hello@episolve.com
            </a>
            <a href="tel:+19735551234" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone size={16} />
              (973) 555-1234
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              Newark, NJ
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} <EpiHighlight text="epiSolve" /> LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
