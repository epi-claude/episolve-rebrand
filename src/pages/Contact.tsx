import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock, Send, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Layout } from "@/components/layout/Layout";
import { services } from "@/data/services";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "(973) 740-0414",
    href: "tel:+19737400414",
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
    value: "Mon-Fri: 9am-5pm EST",
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
  
  // Consultation booking state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    preferredDate: "",
    message: "",
  });
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [isBookingSubmitted, setIsBookingSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from("contact_submissions")
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          service_interest: formData.service || null,
          message: formData.message,
        });

      if (dbError) throw dbError;

      // Send confirmation emails
      const { error: emailError } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          service: formData.service || undefined,
          message: formData.message,
        },
      });

      if (emailError) {
        console.error("Email error:", emailError);
        // Don't throw - form was still submitted successfully
      }

      setIsSubmitted(true);
      toast.success("Message sent! We'll be in touch within 24 hours.");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBookingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBookingData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingSubmitting(true);

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from("consultation_bookings")
        .insert({
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone || null,
          company: bookingData.company || null,
          preferred_date: bookingData.preferredDate || null,
          message: bookingData.message || null,
        });

      if (dbError) throw dbError;

      // Send confirmation emails
      const { error: emailError } = await supabase.functions.invoke("send-booking-email", {
        body: {
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone || undefined,
          company: bookingData.company || undefined,
          preferredDate: bookingData.preferredDate || undefined,
          message: bookingData.message || undefined,
        },
      });

      if (emailError) {
        console.error("Booking email error:", emailError);
      }

      setIsBookingSubmitted(true);
      toast.success("Consultation booked! We'll confirm your appointment soon.");
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-32 min-h-[60vh] flex items-center relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src="/hero-contact.jpg"
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
            className="max-w-3xl pt-8 pb-16"
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
                <Dialog open={bookingOpen} onOpenChange={(open) => {
                  setBookingOpen(open);
                  if (!open) {
                    setIsBookingSubmitted(false);
                    setBookingData({
                      name: "",
                      email: "",
                      phone: "",
                      company: "",
                      preferredDate: "",
                      message: "",
                    });
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book a Consultation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Book a Strategic Audit</DialogTitle>
                      <DialogDescription>
                        Schedule a 30-minute discovery call to discuss your challenges and goals.
                      </DialogDescription>
                    </DialogHeader>
                    {isBookingSubmitted ? (
                      <div className="text-center py-8">
                        <div className="h-16 w-16 rounded-full cta-gradient flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-foreground mb-2">
                          Booking Confirmed!
                        </h3>
                        <p className="text-muted-foreground">
                          We'll contact you within 24 hours to confirm your appointment.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="booking-name">Name *</Label>
                            <Input
                              id="booking-name"
                              name="name"
                              required
                              value={bookingData.name}
                              onChange={handleBookingChange}
                              placeholder="Your name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="booking-email">Email *</Label>
                            <Input
                              id="booking-email"
                              name="email"
                              type="email"
                              required
                              value={bookingData.email}
                              onChange={handleBookingChange}
                              placeholder="you@company.com"
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="booking-phone">Phone</Label>
                            <Input
                              id="booking-phone"
                              name="phone"
                              type="tel"
                              value={bookingData.phone}
                              onChange={handleBookingChange}
                              placeholder="(123) 456-7890"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="booking-company">Company</Label>
                            <Input
                              id="booking-company"
                              name="company"
                              value={bookingData.company}
                              onChange={handleBookingChange}
                              placeholder="Your company"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="booking-date">Preferred Date</Label>
                          <Input
                            id="booking-date"
                            name="preferredDate"
                            type="date"
                            value={bookingData.preferredDate}
                            onChange={handleBookingChange}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="booking-message">Additional Notes</Label>
                          <Textarea
                            id="booking-message"
                            name="message"
                            rows={3}
                            value={bookingData.message}
                            onChange={handleBookingChange}
                            placeholder="Tell us briefly about your challenges..."
                          />
                        </div>
                        <Button
                          type="submit"
                          variant="hero"
                          className="w-full"
                          disabled={isBookingSubmitting}
                        >
                          {isBookingSubmitting ? "Booking..." : "Confirm Booking"}
                        </Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
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
