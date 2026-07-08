import { owner_managementSchema } from "./owner_management";
import { office_accountingSchema } from "./office_accounting";
import { field_technicianSchema } from "./field_technician";
import type { FormKey, FormSchema } from "./types";

export const FORMS: Record<FormKey, FormSchema> = {
  owner_management: owner_managementSchema,
  office_accounting: office_accountingSchema,
  field_technician: field_technicianSchema,
};

export const FORM_ORDER: FormKey[] = ["owner_management", "office_accounting", "field_technician"];

export const FORM_META: Record<FormKey, { slug: string; blurb: string }> = {
  owner_management: {
    slug: "owner-management",
    blurb: "Company profile, priorities, estimating, budgeting, and the metrics ownership needs to run the business.",
  },
  office_accounting: {
    slug: "office-accounting",
    blurb: "QuickBooks workflows, payroll intake, vendor bills, supplier credits, and office exceptions.",
  },
  field_technician: {
    slug: "field-technician",
    blurb: "Daily work assignment, time entry, field reports, purchasing, and mobile experience for technicians.",
  },
};

export function slugToKey(slug: string): FormKey | null {
  const entry = Object.entries(FORM_META).find(([, m]) => m.slug === slug);
  return (entry?.[0] as FormKey) ?? null;
}

export function countFields(schema: FormSchema): number {
  let n = 0;
  for (const s of schema.sections) for (const q of s.questions) n += q.fields.length;
  return n;
}

export function isFieldFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return !Number.isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  return false;
}

export function computeProgress(schema: FormSchema, data: Record<string, unknown>): {
  total: number;
  filled: number;
  percent: number;
} {
  let total = 0;
  let filled = 0;
  for (const s of schema.sections) {
    for (const q of s.questions) {
      for (const f of q.fields) {
        total += 1;
        if (isFieldFilled(data[f.name])) filled += 1;
      }
    }
  }
  return { total, filled, percent: total === 0 ? 0 : Math.round((filled / total) * 100) };
}

export * from "./types";
