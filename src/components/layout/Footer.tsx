import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, Linkedin, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/episolve-logo-horizontal.png";

const footerLinks = {
  solutions: [{
    name: "Fractional Technology Office",
    href: "/solutions/fractional-technology-office"
  }, {
    name: "AI-Driven Cyber Resilience",
    href: "/solutions/risk-insurance"
  }, {
    name: "Custom Workflows",
    href: "/solutions/intelligent-automation"
  }],
  company: [{
    name: "About",
    href: "/about"
  }, {
    name: "Case Studies",
    href: "/case-studies"
  }, {
    name: "Insights",
    href: "/insights"
  }, {
    name: "Contact",
    href: "/contact"
  }]
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("subscribe-newsletter", {
        body: { email },
      });

      if (error) throw error;

      toast({
        title: "Subscribed!",
        description: data.message || "You've been added to our newsletter.",
      });
      setEmail("");
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="relative border-t border-border bg-card">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img src={logo} alt="Episolve" className="h-24" />
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Strategic Technology Leadership for Growth-Focused Organizations. We bridge the gap between complex enterprise IT and nimble business strategy.
            </p>
            <div className="flex gap-3">
              <a href="https://www.linkedin.com/company/episolve-llc/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Solutions</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
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
              {footerLinks.company.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
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
              Get insights on technology strategy and risk management.
            </p>
            <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-muted border-border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <Button variant="default" size="icon" type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              </Button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm text-muted-foreground">
            <a href="tel:+19737400414" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone size={16} />
              (973) 740-0414
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              Tri-State Area
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Episolve. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
