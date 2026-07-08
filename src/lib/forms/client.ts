import { supabase } from "@/integrations/supabase/client";
import { FORMS, FORM_ORDER } from "@/lib/forms";
import type { FormKey } from "@/lib/forms/types";

export type AnswerValue = string | number | boolean | null | string[];
export type Answers = Record<string, AnswerValue>;

export interface QuestionnaireRecord {
  form_key: FormKey;
  data: Answers;
  last_updated_by: string | null;
  last_updated_by_email: string | null;
  updated_at: string | null;
  created_at: string | null;
}

// Casts: the generated Supabase types are regenerated after migration but this
// keeps the code robust regardless of regeneration timing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const table = () => (supabase as any).from("questionnaire_responses");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revisions = () => (supabase as any).from("questionnaire_revisions");

function emptyRecord(form_key: FormKey): QuestionnaireRecord {
  return {
    form_key,
    data: {},
    last_updated_by: null,
    last_updated_by_email: null,
    updated_at: null,
    created_at: null,
  };
}

export async function loadResponse(form_key: FormKey): Promise<QuestionnaireRecord> {
  const { data, error } = await table()
    .select("form_key,data,last_updated_by,last_updated_by_email,updated_at,created_at")
    .eq("form_key", form_key)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return emptyRecord(form_key);
  return {
    form_key: data.form_key as FormKey,
    data: (data.data as Answers) ?? {},
    last_updated_by: data.last_updated_by,
    last_updated_by_email: data.last_updated_by_email,
    updated_at: data.updated_at,
    created_at: data.created_at,
  };
}

export async function loadAllResponses(): Promise<QuestionnaireRecord[]> {
  const { data, error } = await table().select(
    "form_key,data,last_updated_by,last_updated_by_email,updated_at,created_at",
  );
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: Record<string, unknown>) => ({
    form_key: row.form_key as FormKey,
    data: (row.data as Answers) ?? {},
    last_updated_by: (row.last_updated_by as string | null) ?? null,
    last_updated_by_email: (row.last_updated_by_email as string | null) ?? null,
    updated_at: (row.updated_at as string | null) ?? null,
    created_at: (row.created_at as string | null) ?? null,
  }));
}

export async function saveResponse(
  form_key: FormKey,
  answers: Record<string, unknown>,
): Promise<QuestionnaireRecord> {
  const schema = FORMS[form_key];
  if (!schema) throw new Error("Unknown questionnaire");

  const allowed = new Set<string>();
  for (const s of schema.sections)
    for (const q of s.questions) for (const f of q.fields) allowed.add(f.name);
  const cleaned: Answers = {};
  for (const [k, v] of Object.entries(answers)) {
    if (allowed.has(k)) cleaned[k] = v as AnswerValue;
  }

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id ?? null;
  const email = userData.user?.email ?? null;

  // Upsert so a missing seed row doesn't break saving.
  const { data, error } = await table()
    .upsert(
      {
        form_key,
        data: cleaned,
        last_updated_by: userId,
        last_updated_by_email: email,
      },
      { onConflict: "form_key" },
    )
    .select("form_key,data,last_updated_by,last_updated_by_email,updated_at,created_at")
    .single();
  if (error) throw new Error(error.message);

  // Best-effort revision snapshot
  await revisions()
    .insert({
      form_key,
      data: cleaned,
      updated_by: userId,
      updated_by_email: email,
    })
    .then(
      () => undefined,
      () => undefined,
    );

  return {
    form_key: data.form_key as FormKey,
    data: (data.data as Answers) ?? {},
    last_updated_by: data.last_updated_by,
    last_updated_by_email: data.last_updated_by_email,
    updated_at: data.updated_at,
    created_at: data.created_at,
  };
}

function csvEscape(v: unknown): string {
  let s: string;
  if (v === null || v === undefined) s = "";
  else if (Array.isArray(v)) s = v.join("; ");
  else s = String(v);
  if (/[",\n]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function exportForm(
  form_key: FormKey,
  format: "json" | "csv",
): Promise<{ content: string; mime: string }> {
  const rec = await loadResponse(form_key);
  const schema = FORMS[form_key];
  const fieldNames: string[] = [];
  for (const s of schema.sections)
    for (const q of s.questions) for (const f of q.fields) fieldNames.push(f.name);
  const values = rec.data ?? {};

  if (format === "json") {
    const payload = {
      form: schema.key,
      title: schema.title,
      updated_at: rec.updated_at,
      last_updated_by_email: rec.last_updated_by_email,
      answers: Object.fromEntries(fieldNames.map((n) => [n, values[n] ?? null])),
    };
    return { content: JSON.stringify(payload, null, 2), mime: "application/json" };
  }

  const header = fieldNames.join(",");
  const rowLine = fieldNames.map((n) => csvEscape(values[n])).join(",");
  return { content: `${header}\n${rowLine}\n`, mime: "text/csv" };
}

export async function exportAll(): Promise<{ content: string; mime: string }> {
  const rows = await loadAllResponses();
  const map = new Map(rows.map((r) => [r.form_key, r]));
  const payload: Record<string, unknown> = {
    company: "Broadway Mechanical LLC",
    generated_at: new Date().toISOString(),
    forms: {} as Record<string, unknown>,
  };
  for (const key of FORM_ORDER) {
    const rec = map.get(key);
    const schema = FORMS[key];
    const fieldNames: string[] = [];
    for (const s of schema.sections)
      for (const q of s.questions) for (const f of q.fields) fieldNames.push(f.name);
    const values = rec?.data ?? {};
    (payload.forms as Record<string, unknown>)[key] = {
      title: schema.title,
      updated_at: rec?.updated_at ?? null,
      last_updated_by_email: rec?.last_updated_by_email ?? null,
      answers: Object.fromEntries(fieldNames.map((n) => [n, values[n] ?? null])),
    };
  }
  return { content: JSON.stringify(payload, null, 2), mime: "application/json" };
}