import { BwmechShell } from "@/components/bwmech/BwmechShell";
import { ExternalLink, GitBranch, ListChecks, FileText } from "lucide-react";
import checklistPdf from "@/assets/bwmech/broadway-checklists-letter.pdf.asset.json";
import processMapPdf from "@/assets/bwmech/broadway-process-map-11x17.pdf.asset.json";

const documents = [
  {
    title: "How a Job Runs",
    description:
      "End-to-end process map of a Broadway Mechanical job — from first call through closeout — across the office, project management, and field lanes.",
    href: "/bwmech/process-map.html",
    icon: GitBranch,
  },
  {
    title: "Don't Forget Checklists",
    description:
      "Printable checklists for each stage of a job so nothing falls through the cracks — estimating, buyout, submittals, closeout, and more.",
    href: "/bwmech/process-checklists.html",
    icon: ListChecks,
  },
  {
    title: "Process Map — 11 × 17 PDF",
    description:
      "A large-format overview of job stages, responsibilities, and handoffs, including the purchase-order trail and job-site versus billing addresses. Prepared for printing and team review.",
    href: processMapPdf.url,
    icon: GitBranch,
  },
  {
    title: "Checklists — Letter-size PDF",
    description:
      "Five printable checklists covering bid won, startup, ongoing work, closeout, and a who-owns-it worksheet for every handoff. Each identifies who owns the task and includes space for corrections and notes.",
    href: checklistPdf.url,
    icon: ListChecks,
  },
  {
    title: "Checklists — Google Docs-friendly HTML",
    description:
      "A simplified text version of all five checklists, with task owners and purchase-order and address markers. Suitable for copying into Google Docs for collaborative editing.",
    href: "/bwmech/process-checklists-for-google-docs.html",
    icon: FileText,
  },
];

const BwmechProcess = () => {
  return (
    <BwmechShell showDashboardLink={false}>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Broadway Mechanical Work Flows
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Working documents that describe how jobs run today. Each opens as a
          standalone page in a new tab.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {documents.map((doc) => (
            <a
              key={doc.href}
              href={doc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <doc.icon className="h-6 w-6 text-primary" />
                <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">
                {doc.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {doc.description}
              </p>
              <span className="mt-4 text-xs font-medium uppercase tracking-wider text-primary">
                Open document
              </span>
            </a>
          ))}
        </div>
      </main>
    </BwmechShell>
  );
};

export default BwmechProcess;
