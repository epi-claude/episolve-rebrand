import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { loadResponse, type QuestionnaireRecord } from "@/lib/forms/client";
import { FORMS, slugToKey, FORM_META } from "@/lib/forms";
import { QuestionnaireForm } from "@/components/forms/QuestionnaireForm";
import { Button } from "@/components/ui/button";
import { BwmechShell } from "@/components/bwmech/BwmechShell";

export default function BwmechForm() {
  const { slug } = useParams<{ slug: string }>();
  const key = slug ? slugToKey(slug) : null;
  const [record, setRecord] = useState<QuestionnaireRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!key) return;
    document.title = `${FORMS[key].title} · Broadway Mechanical Discovery`;
    loadResponse(key)
      .then(setRecord)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, [key]);

  if (!key) return <Navigate to="/projects/bwmech/dashboard" replace />;

  const schema = FORMS[key];
  const meta = FORM_META[key];

  return (
    <BwmechShell>
      <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="space-y-6">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
            <Link to="/projects/bwmech/dashboard">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Broadway Mechanical · Discovery
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-foreground">
            {schema.title}
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">{meta.blurb}</p>
        </div>
        {error ? (
          <p className="text-destructive">Failed to load: {error}</p>
        ) : record ? (
          <QuestionnaireForm schema={schema} initial={record} />
        ) : (
          <p className="text-muted-foreground">Loading…</p>
        )}
      </div>
      </main>
    </BwmechShell>
  );
}