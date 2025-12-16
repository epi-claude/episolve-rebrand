import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Users, DollarSign, TrendingUp, Clock, Target, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
const fadeInUp = {
  initial: {
    opacity: 0,
    y: 30
  },
  animate: {
    opacity: 1,
    y: 0
  },
  transition: {
    duration: 0.6
  }
};
const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};
const benefits = [{
  icon: DollarSign,
  title: "Fraction of the Cost",
  description: "A full-time CIO costs $200K+ annually. Our Fractional Technology Office delivers senior-level expertise at a fraction of the price—with no benefits, training costs, or turnover risk."
}, {
  icon: Users,
  title: "Full Team, Not One Person",
  description: "You don't just get one IT person. You get a complete technology office: strategists, engineers, and specialists working together on your behalf."
}, {
  icon: Target,
  title: "Strategy Over Break-Fix",
  description: "We're not waiting for things to break. We align your technology investments with your 3-year business plan, ensuring every dollar drives growth."
}, {
  icon: Clock,
  title: "Instant Expertise",
  description: "Skip the 6-month hiring process. Get immediate access to seasoned technology leadership who've solved problems like yours before."
}];
const comparisonPoints = [{
  item: "Senior technology leadership",
  fractional: true,
  fullTime: true
}, {
  item: "Multi-year technology roadmap",
  fractional: true,
  fullTime: true
}, {
  item: "Vendor evaluation & management",
  fractional: true,
  fullTime: true
}, {
  item: "Budget planning & optimization",
  fractional: true,
  fullTime: true
}, {
  item: "Diverse team of specialists",
  fractional: true,
  fullTime: false
}, {
  item: "No hiring or onboarding delays",
  fractional: true,
  fullTime: false
}, {
  item: "No benefits, insurance, or overhead",
  fractional: true,
  fullTime: false
}, {
  item: "Scalable engagement model",
  fractional: true,
  fullTime: false
}, {
  item: "Cross-industry expertise",
  fractional: true,
  fullTime: false
}, {
  item: "Risk of single point of failure",
  fractional: false,
  fullTime: true
}];
export default function FractionalTechnologyOffice() {
  return <Layout>
      {/* Hero */}
      <section className="py-32 relative overflow-hidden hero-gradient">
        {/* Background effects */}
        <div className="absolute inset-0">
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 2
        }} className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 0.5
        }} transition={{
          duration: 2,
          delay: 0.5
        }} className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[120px]" />
        </div>

        <div className="container relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <span className="text-primary font-medium">Fractional Technology Office</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-[1.1]">
              You Don't Need More IT Support.<br />
              <span className="gradient-text">You Need a Technology Office.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Most IT firms are reactive—fixing things after they break. We act as your fractional Chief Technology Office, aligning technology with your business goals before problems arise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 bg-card">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }}>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                The Real Cost of a Full-Time IT Department
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  Building an in-house IT team sounds logical—until you crunch the numbers. A competent IT director runs $150K+. Add a systems admin, a security specialist, and suddenly you're looking at $400K+ annually in salaries alone.
                </p>
                <p>
                  Then come the hidden costs: benefits (add 30%), ongoing training, turnover (the average IT tenure is just 2 years), and the inevitable knowledge gaps when your single expert is out sick or moves on.
                </p>
                <p>For most small businesses and not-for-profit organizations, this model doesn't make financial sense—and it doesn't have to.</p>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="relative">
              <div className="p-8 rounded-2xl card-gradient border border-border">
                <h3 className="text-xl font-display font-bold text-foreground mb-6">
                  Full-Time IT Team Costs
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">IT Director / CIO</span>
                    <span className="font-semibold text-foreground">$150,000 - $200,000</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Systems Administrator</span>
                    <span className="font-semibold text-foreground">$75,000 - $95,000</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Security Specialist</span>
                    <span className="font-semibold text-foreground">$90,000 - $120,000</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Benefits & Overhead (30%)</span>
                    <span className="font-semibold text-foreground">$95,000 - $125,000</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="font-bold text-foreground">Annual Total</span>
                    <span className="font-bold text-primary text-xl">$410,000 - $540,000</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24">
        <div className="container">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              The Fractional Advantage
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Enterprise-grade technology leadership without enterprise-grade overhead.
            </p>
          </motion.div>

          <motion.div initial="initial" whileInView="animate" viewport={{
          once: true
        }} variants={stagger} className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return <motion.div key={index} variants={fadeInUp} className="p-8 rounded-2xl dark-gradient border border-white/10">
                  <div className="h-14 w-14 rounded-xl bg-[hsl(213_37%_47%)] flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>;
          })}
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-card">
        <div className="container">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Side-by-Side Comparison
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              See what you get with each approach.
            </p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-border">
              {/* Header */}
              <div className="grid grid-cols-3 bg-muted/50">
                <div className="p-4 font-semibold text-foreground"></div>
                <div className="p-4 text-center font-semibold text-primary border-l border-border">
                  Fractional Technology Office
                </div>
                <div className="p-4 text-center font-semibold text-muted-foreground border-l border-border">
                  Full-Time IT Team
                </div>
              </div>
              
              {/* Rows */}
              {comparisonPoints.map((point, index) => <div key={index} className={`grid grid-cols-3 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
                  <div className="p-4 text-foreground text-sm md:text-base">
                    {point.item}
                  </div>
                  <div className="p-4 flex justify-center items-center border-l border-border">
                    {point.fractional ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                  <div className="p-4 flex justify-center items-center border-l border-border">
                    {point.fullTime ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                </div>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="order-2 lg:order-1">
              <div className="p-8 rounded-2xl card-gradient border border-border">
                <h3 className="text-xl font-display font-bold text-foreground mb-6">
                  What Your Technology Office Handles
                </h3>
                <div className="space-y-4">
                  {["Technology strategy aligned to your 3-year plan", "Vendor evaluation, selection, and management", "Multi-year IT budgeting and spend optimization", "Security posture and compliance oversight", "Cloud infrastructure planning and migration", "Software selection and integration strategy", "Team training and technology adoption", "Board-level technology reporting"].map((item, index) => <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>)}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                More Than Support—Strategic Partnership
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  Traditional IT support waits for tickets. We're different. As your Fractional Technology Office, we participate in leadership meetings, understand your mission, and proactively recommend technology investments that drive impact.
                </p>
                <p>
                  We're not just fixing printers—we're helping you decide whether to build or buy your next system, which CRM aligns with your donor strategy, and how to protect your organization from the next cyber threat.
                </p>
                <p>
                  Think of us as your technology leadership team—without the full-time overhead.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card">
        <div className="container">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Ready for Strategic Technology Leadership?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Let's discuss how a Fractional Technology Office can align your IT investments with your mission—at a price that makes sense.
            </p>
            <Button variant="default" size="lg" asChild className="text-base">
              <Link to="/contact">
                Book a Strategic Risk Audit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>;
}