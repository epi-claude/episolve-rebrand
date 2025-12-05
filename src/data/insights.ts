export interface InsightPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
  };
  readTime: number;
  featured: boolean;
}

export const insights: InsightPost[] = [
  {
    id: "1",
    slug: "ai-for-small-business-practical-guide",
    title: "AI for Small Business: A Practical Guide for 2024",
    excerpt: "Cut through the hype. Here's what AI can actually do for your family-run business today, and where to start without breaking the bank.",
    content: `
# AI for Small Business: A Practical Guide for 2024

The AI conversation has shifted from "will it change business?" to "how do I actually use it?" For small and mid-size businesses, the answer isn't about massive investments or rebuilding your company from scratch.

## Where AI Actually Helps Today

### Customer Service Automation
Chatbots have matured significantly. Tools like Intercom and Drift can handle 60-70% of routine inquiries, freeing your team for complex issues.

### Document Processing
AI can extract data from invoices, contracts, and forms with high accuracy. This isn't futuristic—it's practical and available now.

### Email and Communication
AI writing assistants like Grammarly Business and Jasper help your team communicate more effectively and consistently.

## Getting Started

1. **Identify repetitive tasks** - Where does your team spend time on predictable, routine work?
2. **Start small** - Pick one process to improve, not ten
3. **Measure results** - Track time saved and error reduction
4. **Iterate** - Build on successes, learn from what doesn't work

The key isn't adopting AI for its own sake. It's identifying where technology can solve real problems in your business.
    `,
    category: "AI & Technology",
    publishedAt: "2024-11-28",
    author: {
      name: "Alex Rivera",
      role: "Technology Consultant",
    },
    readTime: 6,
    featured: true,
  },
  {
    id: "2",
    slug: "choosing-right-crm-family-business",
    title: "Choosing the Right CRM for Your Family Business",
    excerpt: "Not all CRMs are created equal. Learn how to evaluate options based on what actually matters for relationship-driven businesses.",
    content: `
# Choosing the Right CRM for Your Family Business

For family-run businesses, relationships are everything. Your CRM should enhance those relationships, not create administrative burden.

## What to Look For

### Ease of Use
Your team will only use what's intuitive. Complex systems with steep learning curves often become expensive shelf-ware.

### Integration Capabilities
Can it connect to your accounting software? Your email? Your calendar? Integration eliminates double data entry.

### Mobile Access
Your team isn't always at a desk. Mobile access ensures customer information is available when and where it's needed.

## Top Recommendations

For most small businesses, we recommend starting with HubSpot (free tier) or Pipedrive. Both offer excellent value and grow with your business.

The best CRM is the one your team actually uses. Start simple, prove value, then add complexity as needed.
    `,
    category: "Business Software",
    publishedAt: "2024-11-15",
    author: {
      name: "Jordan Chen",
      role: "Integration Specialist",
    },
    readTime: 5,
    featured: true,
  },
  {
    id: "3",
    slug: "cybersecurity-basics-small-business",
    title: "Cybersecurity Basics Every Small Business Needs",
    excerpt: "You don't need enterprise-level security. But you do need these fundamentals to protect your business and customers.",
    content: `
# Cybersecurity Basics Every Small Business Needs

Cyberattacks aren't just for big companies. Small businesses are actually more frequently targeted because they're perceived as easier victims.

## The Non-Negotiables

### Multi-Factor Authentication (MFA)
Enable MFA on everything—email, banking, critical business apps. It's the single most effective security measure you can take.

### Regular Backups
Follow the 3-2-1 rule: 3 copies of data, on 2 different media types, with 1 stored offsite (cloud counts).

### Employee Training
Most breaches start with human error. Regular, practical security training is essential.

### Keep Software Updated
Updates often include security patches. Enable automatic updates wherever possible.

## Common Mistakes to Avoid

- Using the same password everywhere
- Clicking links in unexpected emails
- Sharing login credentials
- Ignoring software update prompts

Security doesn't have to be complicated. Start with these basics and build from there.
    `,
    category: "Cybersecurity",
    publishedAt: "2024-10-30",
    author: {
      name: "Sam Martinez",
      role: "Security Consultant",
    },
    readTime: 4,
    featured: false,
  },
  {
    id: "4",
    slug: "cloud-migration-timeline-expectations",
    title: "Cloud Migration: Realistic Timelines and What to Expect",
    excerpt: "Planning a cloud migration? Here's what the process actually looks like for small and mid-size businesses.",
    content: `
# Cloud Migration: Realistic Timelines and What to Expect

Moving to the cloud sounds simple in theory. In practice, it requires careful planning and realistic expectations.

## Typical Timeline

### Assessment Phase (2-4 weeks)
Inventory your current systems, identify dependencies, and prioritize what moves first.

### Planning Phase (2-4 weeks)
Choose cloud providers, design the target architecture, and create a detailed migration plan.

### Migration Phase (4-12 weeks)
Actual migration varies widely based on complexity. Simple email migrations might take days; full infrastructure moves take months.

### Optimization Phase (Ongoing)
Cloud environments need tuning. Expect to spend 3-6 months optimizing performance and costs.

## What Often Goes Wrong

- Underestimating data transfer times
- Not accounting for application dependencies
- Skipping user training
- Ignoring post-migration optimization

The key to successful cloud migration is patience and proper planning. Rush it, and you'll spend more time fixing problems than you saved.
    `,
    category: "Cloud & Infrastructure",
    publishedAt: "2024-10-15",
    author: {
      name: "Alex Rivera",
      role: "Technology Consultant",
    },
    readTime: 7,
    featured: false,
  },
];

export const getFeaturedInsights = () => insights.filter((i) => i.featured);
export const getInsightBySlug = (slug: string) => insights.find((i) => i.slug === slug);
