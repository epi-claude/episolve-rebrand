import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { FormSchema, FormField } from "@/lib/forms/types";
import { computeProgress } from "@/lib/forms";
import {
  saveResponse,
  type QuestionnaireRecord,
  type Answers,
  type AnswerValue,
} from "@/lib/forms/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Status = "idle" | "saving" | "saved" | "error";

interface Props {
  schema: FormSchema;
  initial: QuestionnaireRecord;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function QuestionnaireForm({ schema, initial }: Props) {
  const [values, setValues] = useState<Answers>(() => (initial.data as Answers) ?? {});
  const [status, setStatus] = useState<Status>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(initial.updated_at);
  const [lastSavedBy, setLastSavedBy] = useState<string | null>(initial.last_updated_by_email);
  const dirtyRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const progress = useMemo(
    () => computeProgress(schema, values as Record<string, unknown>),
    [schema, values],
  );

  async function flush(fromButton = false) {
    if (!dirtyRef.current && !fromButton) return;
    setStatus("saving");
    try {
      const rec = await saveResponse(schema.key, valuesRef.current as Record<string, unknown>);
      setLastSavedAt(rec.updated_at);
      setLastSavedBy(rec.last_updated_by_email);
      dirtyRef.current = false;
      setStatus("saved");
      if (fromButton) toast.success("Response saved");
    } catch (err) {
      console.error(err);
      setStatus("error");
      toast.error("Save failed", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
  }

  function updateField(name: string, value: AnswerValue) {
    setValues((v) => ({ ...v, [name]: value }));
    dirtyRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void flush(), 1200);
  }

  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (dirtyRef.current) void flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="hidden lg:block">
        <nav className="sticky top-24 space-y-1 text-sm">
          {schema.sections.map((s) => (
            <a
              key={s.title}
              href={`#${slugify(s.title)}`}
              className="block rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </aside>

      <div className="space-y-8">
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="min-w-[220px] flex-1">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  {progress.filled} of {progress.total} fields
                </span>
                <span className="text-muted-foreground">{progress.percent}%</span>
              </div>
              <Progress value={progress.percent} />
            </div>
            <div className="flex items-center gap-3">
              <StatusPill status={status} lastSavedAt={lastSavedAt} lastSavedBy={lastSavedBy} />
              <Button
                type="button"
                onClick={() => void flush(true)}
                disabled={status === "saving"}
              >
                Save now
              </Button>
            </div>
          </CardContent>
        </Card>

        {schema.sections.map((section) => (
          <Card key={section.title} id={slugify(section.title)} className="scroll-mt-24">
            <CardContent className="space-y-8 py-6">
              <h2 className="border-b border-border pb-3 font-display text-2xl font-semibold text-foreground">
                {section.title}
              </h2>
              {section.questions.map((q, qi) => (
                <div key={`${section.title}-${qi}`} className="space-y-3">
                  <Label className="text-base font-semibold text-foreground">{q.title}</Label>
                  <div className="space-y-4">
                    {q.fields.map((field) => (
                      <FieldRenderer
                        key={field.name}
                        field={field}
                        value={values[field.name] ?? null}
                        onChange={(v) => updateField(field.name, v)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button
            type="button"
            size="lg"
            onClick={() => void flush(true)}
            disabled={status === "saving"}
          >
            {status === "saving" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save response
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatusPill({
  status,
  lastSavedAt,
  lastSavedBy,
}: {
  status: Status;
  lastSavedAt: string | null;
  lastSavedBy: string | null;
}) {
  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-destructive">
        <AlertCircle className="h-3.5 w-3.5" /> Save failed
      </span>
    );
  }
  if (lastSavedAt) {
    const stamp = new Date(lastSavedAt).toLocaleString();
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <Check className="h-3.5 w-3.5 text-primary" />
        Saved {stamp}
        {lastSavedBy ? ` · ${lastSavedBy}` : ""}
      </span>
    );
  }
  return <span className="text-sm text-muted-foreground">Not yet saved</span>;
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: AnswerValue;
  onChange: (v: AnswerValue) => void;
}) {
  if (field.type === "text" || field.type === "email") {
    return (
      <Input
        type={field.type}
        value={(value as string) ?? ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === "date") {
    return (
      <Input
        type="date"
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === "number") {
    return (
      <Input
        type="number"
        value={value === null || value === undefined ? "" : String(value)}
        onChange={(e) =>
          onChange(e.target.value === "" ? null : Number(e.target.value))
        }
      />
    );
  }
  if (field.type === "textarea") {
    return (
      <Textarea
        value={(value as string) ?? ""}
        placeholder={field.placeholder}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === "select") {
    return (
      <Select value={(value as string) ?? ""} onValueChange={(v) => onChange(v)}>
        <SelectTrigger className="max-w-md">
          <SelectValue placeholder="Select one" />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  if (field.type === "radio") {
    return (
      <RadioGroup
        value={(value as string) ?? ""}
        onValueChange={(v) => onChange(v)}
        className="space-y-1.5"
      >
        {field.options?.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
          >
            <RadioGroupItem value={o.value} className="mt-0.5" />
            <span>{o.label}</span>
          </label>
        ))}
      </RadioGroup>
    );
  }
  if (field.type === "checkbox") {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="space-y-1.5">
        {field.options?.map((o) => {
          const checked = arr.includes(o.value);
          return (
            <label
              key={o.value}
              className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(c) => {
                  const next =
                    c === true ? [...arr, o.value] : arr.filter((v) => v !== o.value);
                  onChange(next);
                }}
                className="mt-0.5"
              />
              <span>{o.label}</span>
            </label>
          );
        })}
      </div>
    );
  }
  return null;
}