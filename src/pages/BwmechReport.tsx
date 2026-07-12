import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { BwmechShell } from "@/components/bwmech/BwmechShell";
import { Button } from "@/components/ui/button";
import { loadAllResponses, type QuestionnaireRecord } from "@/lib/forms/client";
import { FORMS, FORM_ORDER, computeProgress } from "@/lib/forms";
import type { FormKey } from "@/lib/forms/types";

function renderValue(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}

export default function BwmechReport() {
  const [rows, setRows] = useState<QuestionnaireRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Broadway Mechanical — Discovery Report";
    loadAllResponses()
      .then(setRows)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  function handleDownloadHtml() {
    const html = document.documentElement.outerHTML;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bwmech-discovery-report.html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <BwmechShell>
      <main className="mx-auto max-w-4xl px-6 py-10 print:px-0 print:py-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link to="/projects/bwmech/dashboard">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadHtml}>
              <Download className="mr-2 h-4 w-4" />
              Download HTML
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print / Save as PDF
            </Button>
          </div>
        </div>

        {error ? (
          <p className="text-destructive">Failed to load: {error}</p>
        ) : !rows ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <article className="space-y-10">
            <header className="border-b border-border pb-6">
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                Broadway Mechanical LLC · Phase 1
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold text-foreground">
                Discovery Report
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Generated {new Date().toLocaleString()}
              </p>
            </header>

            {FORM_ORDER.map((key: FormKey) => {
              const schema = FORMS[key];
              const rec = rows.find((r) => r.form_key === key);
              const data = (rec?.data ?? {}) as Record<string, unknown>;
              const progress = computeProgress(schema, data);
              return (
                <section key={key} className="space-y-6 break-inside-avoid">
                  <div className="border-b border-border/60 pb-3">
                    <h2 className="font-display text-2xl font-semibold text-foreground">
                      {schema.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {progress.filled} of {progress.total} fields · {progress.percent}%
                      {rec?.updated_at
                        ? ` · updated ${new Date(rec.updated_at).toLocaleString()}`
                        : " · not yet started"}
                      {rec?.last_updated_by_email ? ` by ${rec.last_updated_by_email}` : ""}
                    </p>
                  </div>
                  {schema.sections.map((section, si) => (
                    <div key={si} className="space-y-4">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {section.title}
                      </h3>
                      <dl className="space-y-4">
                        {section.questions.map((q, qi) => (
                          <div key={qi} className="break-inside-avoid">
                            <dt className="text-sm font-medium text-foreground">
                              {q.title}
                            </dt>
                            <dd className="mt-1 space-y-1">
                              {q.fields.map((f) => (
                                <div
                                  key={f.name}
                                  className="whitespace-pre-wrap text-sm text-muted-foreground"
                                >
                                  {q.fields.length > 1 ? (
                                    <span className="mr-2 font-medium text-foreground/70">
                                      {f.name}:
                                    </span>
                                  ) : null}
                                  {renderValue(data[f.name])}
                                </div>
                              ))}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </section>
              );
            })}
          </article>
        )}
      </main>
    </BwmechShell>
  );
}