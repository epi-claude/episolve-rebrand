import { BwmechShell } from "@/components/bwmech/BwmechShell";
import { ExternalLink, GitBranch, ListChecks } from "lucide-react";

const documents = [
  {
    title: "How a Job Runs",
    description:
      "End-to-end process map of a Broadway Mechanical job — from first call through closeout — across the office, project management, and field lanes.",
    href: "/process-map.html",
    icon: GitBranch,
  },
  {
    title: "Don't Forget Checklists",
    description:
      "Printable checklists for each stage of a job so nothing falls through the cracks — estimating, buyout, submittals, closeout, and more.",
    href: "/process-checklists.html",
    icon: ListChecks,
  },
];

const BwmechProcess = () => {
  return (
    <BwmechShell>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Broadway Mechanical
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          Process Reference
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
