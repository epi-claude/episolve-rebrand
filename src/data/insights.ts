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
      <p>The AI conversation has shifted from "will it change business?" to "how do I actually use it?" For small and mid-size businesses, the answer isn't about massive investments or rebuilding your company from scratch.</p>

      <h2>Where AI Actually Helps Today</h2>

      <h3>Customer Service Automation</h3>
      <p>Chatbots have matured significantly. Tools like Intercom and Drift can handle 60-70% of routine inquiries, freeing your team for complex issues.</p>

      <h3>Document Processing</h3>
      <p>AI can extract data from invoices, contracts, and forms with high accuracy. This isn't futuristic—it's practical and available now.</p>

      <h3>Email and Communication</h3>
      <p>AI writing assistants like Grammarly Business and Jasper help your team communicate more effectively and consistently.</p>

      <h2>Getting Started</h2>

      <ol>
        <li><strong>Identify repetitive tasks</strong> - Where does your team spend time on predictable, routine work?</li>
        <li><strong>Start small</strong> - Pick one process to improve, not ten</li>
        <li><strong>Measure results</strong> - Track time saved and error reduction</li>
        <li><strong>Iterate</strong> - Build on successes, learn from what doesn't work</li>
      </ol>

      <p>The key isn't adopting AI for its own sake. It's identifying where technology can solve real problems in your business.</p>
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
      <p>For family-run businesses, relationships are everything. Your CRM should enhance those relationships, not create administrative burden.</p>

      <h2>What to Look For</h2>

      <h3>Ease of Use</h3>
      <p>Your team will only use what's intuitive. Complex systems with steep learning curves often become expensive shelf-ware.</p>

      <h3>Integration Capabilities</h3>
      <p>Can it connect to your accounting software? Your email? Your calendar? Integration eliminates double data entry.</p>

      <h3>Mobile Access</h3>
      <p>Your team isn't always at a desk. Mobile access ensures customer information is available when and where it's needed.</p>

      <h2>Top Recommendations</h2>

      <p>For most small businesses, we recommend starting with HubSpot (free tier) or Pipedrive. Both offer excellent value and grow with your business.</p>

      <p>The best CRM is the one your team actually uses. Start simple, prove value, then add complexity as needed.</p>
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
      <p>Cyberattacks aren't just for big companies. Small businesses are actually more frequently targeted because they're perceived as easier victims.</p>

      <h2>The Non-Negotiables</h2>

      <h3>Multi-Factor Authentication (MFA)</h3>
      <p>Enable MFA on everything—email, banking, critical business apps. It's the single most effective security measure you can take.</p>

      <h3>Regular Backups</h3>
      <p>Follow the 3-2-1 rule: 3 copies of data, on 2 different media types, with 1 stored offsite (cloud counts).</p>

      <h3>Employee Training</h3>
      <p>Most breaches start with human error. Regular, practical security training is essential.</p>

      <h3>Keep Software Updated</h3>
      <p>Updates often include security patches. Enable automatic updates wherever possible.</p>

      <h2>Common Mistakes to Avoid</h2>

      <ul>
        <li>Using the same password everywhere</li>
        <li>Clicking links in unexpected emails</li>
        <li>Sharing login credentials</li>
        <li>Ignoring software update prompts</li>
      </ul>

      <p>Security doesn't have to be complicated. Start with these basics and build from there.</p>
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
      <p>Moving to the cloud sounds simple in theory. In practice, it requires careful planning and realistic expectations.</p>

      <h2>Typical Timeline</h2>

      <h3>Assessment Phase (2-4 weeks)</h3>
      <p>Inventory your current systems, identify dependencies, and prioritize what moves first.</p>

      <h3>Planning Phase (2-4 weeks)</h3>
      <p>Choose cloud providers, design the target architecture, and create a detailed migration plan.</p>

      <h3>Migration Phase (4-12 weeks)</h3>
      <p>Actual migration varies widely based on complexity. Simple email migrations might take days; full infrastructure moves take months.</p>

      <h3>Optimization Phase (Ongoing)</h3>
      <p>Cloud environments need tuning. Expect to spend 3-6 months optimizing performance and costs.</p>

      <h2>What Often Goes Wrong</h2>

      <ul>
        <li>Underestimating data transfer times</li>
        <li>Not accounting for application dependencies</li>
        <li>Skipping user training</li>
        <li>Ignoring post-migration optimization</li>
      </ul>

      <p>The key to successful cloud migration is patience and proper planning. Rush it, and you'll spend more time fixing problems than you saved.</p>
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
