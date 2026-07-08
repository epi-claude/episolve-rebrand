import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, FileText, HardHat, Briefcase, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  loadAllResponses,
  exportForm,
  exportAll,
  type QuestionnaireRecord,
} from "@/lib/forms/client";
import { FORMS, FORM_ORDER, FORM_META, computeProgress } from "@/lib/forms";
import type { FormKey } from "@/lib/forms/types";
import { BwmechShell } from "@/components/bwmech/BwmechShell";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const ICONS: Record<FormKey, typeof FileText> = {
  owner_management: Briefcase,
  office_accounting: FileText,
  field_technician: HardHat,
};

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function BwmechDashboard() {
  const [rows, setRows] = useState<QuestionnaireRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exportingAll, setExportingAll] = useState(false);

  useEffect(() => {
    document.title = "Broadway Mechanical — Discovery Dashboard";
    loadAllResponses()
      .then(setRows)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  async function handleExportAll() {
    setExportingAll(true);
    try {
      const res = await exportAll();
      download("broadway-mechanical-discovery.json", res.content, res.mime);
    } catch (err) {
      toast.error("Export failed", {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setExportingAll(false);
    }
  }

  if (error) {
    return (
      <BwmechShell>
        <main className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-destructive">Failed to load: {error}</p>
        </main>
      </BwmechShell>
    );
  }

  if (!rows) {
    return (
      <BwmechShell>
        <main className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-muted-foreground">Loading…</p>
        </main>
      </BwmechShell>
    );
  }

  const byKey = new Map<FormKey, QuestionnaireRecord>(
    rows.map((r) => [r.form_key as FormKey, r]),
  );

  return (
    <BwmechShell>
      <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="space-y-10">
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                Broadway Mechanical LLC · Phase 1
              </p>
              <h1 className="mt-1 font-display text-4xl font-bold text-foreground">
                Requirements &amp; discovery
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Complete each questionnaire below to build the system of record for
                job-costing, office workflows, and field operations. Answers save
                automatically as you go — anyone on the team can return and update them.
              </p>
            </div>
            <Button variant="outline" onClick={handleExportAll} disabled={exportingAll}>
              {exportingAll ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export everything
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {FORM_ORDER.map((key) => (
            <FormCard key={key} formKey={key} row={byKey.get(key)} />
          ))}
        </section>
      </div>
      </main>
    </BwmechShell>
  );
}

function FormCard({
  formKey,
  row,
}: {
  formKey: FormKey;
  row: QuestionnaireRecord | undefined;
}) {
  const schema = FORMS[formKey];
  const meta = FORM_META[formKey];
  const Icon = ICONS[formKey];
  const answers = row?.data ?? {};
  const progress = computeProgress(schema, answers as Record<string, unknown>);
  const started = progress.filled > 0;

  async function handleExport(format: "json" | "csv") {
    try {
      const res = await exportForm(formKey, format);
      const ext = format === "json" ? "json" : "csv";
      download(`bwmech-${meta.slug}.${ext}`, res.content, res.mime);
    } catch (err) {
      toast.error("Export failed", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return (
    <Card className="flex flex-col overflow-hidden border-border transition-shadow hover:shadow-lg">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-accent" />
      <CardContent className="flex flex-1 flex-col gap-5 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              {schema.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{meta.blurb}</p>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {schema.sections.length} sections · {progress.total} fields
            </span>
            <span className="font-semibold text-foreground">{progress.percent}%</span>
          </div>
          <Progress value={progress.percent} />
        </div>

        <div className="text-xs text-muted-foreground">
          {row?.updated_at ? (
            <>
              Last updated {new Date(row.updated_at).toLocaleString()}
              {row.last_updated_by_email ? ` · ${row.last_updated_by_email}` : ""}
            </>
          ) : (
            "Not yet started"
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <Button asChild className="flex-1">
            <Link to={`/projects/bwmech/forms/${meta.slug}`}>
              {started ? "Continue" : "Start"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Export">
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("json")}>
                Export JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                Export CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}