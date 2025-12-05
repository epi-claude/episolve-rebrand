import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/layout/Layout";
import { services } from "@/data/services";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@episolve.com",
    href: "mailto:hello@episolve.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "(973) 555-1234",
    href: "tel:+19735551234",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Newark, NJ",
    href: null,
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon-Fri: 9am-6pm EST",
    href: null,
  },
];

export default function Contact() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("service") || "";
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: preselectedService,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Message sent! We'll be in touch within 24 hours.");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
              Let's <span className="gradient-text">Talk</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Have a question or ready to get started? We'd love to hear from you. Fill out the form below or reach out directly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <h2 className="text-2xl font-display font-bold text-foreground mb-8">
                Get in Touch
              </h2>
              
              <div className="space-y-6 mb-12">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {item.label}
                        </div>
                        <div className="text-foreground font-medium">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a
                      key={index}
                      href={item.href}
                      className="block hover:opacity-80 transition-opacity"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={index}>{content}</div>
                  );
                })}
              </div>

              <div className="p-6 rounded-2xl card-gradient border border-border">
                <h3 className="font-display font-semibold text-foreground mb-2">
                  Prefer to Book a Call?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Schedule a 30-minute discovery call at your convenience.
                </p>
                <Button variant="outline" className="w-full">
                  Book a Consultation
                </Button>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              {isSubmitted ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-12 rounded-2xl card-gradient border border-border">
                    <div className="h-16 w-16 rounded-full cta-gradient flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                      Thank you for reaching out. We typically respond within 24 business hours.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-muted border-border"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-muted border-border"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-muted border-border"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="bg-muted border-border"
                        placeholder="Your company"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Service Interest</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, service: value }))
                      }
                    >
                      <SelectTrigger className="bg-muted border-border">
                        <SelectValue placeholder="Select a service (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.slug} value={service.slug}>
                            {service.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="bg-muted border-border resize-none"
                      placeholder="Tell us about your project or question..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
