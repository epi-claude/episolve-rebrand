import { useEffect, useState, type ReactNode } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Opt = { value: string; label: string; detail?: string };

const WORK_MIX: Opt[] = [
  { value: "Commercial Mechanical / Specialty Subcontracting", label: "Commercial Mechanical / HVAC / Specialty Subcontracting" },
  { value: "Commercial General Contracting & Fit-Outs", label: "Commercial General Contracting & Interior Fit-Outs" },
  { value: "Service Work Orders / Maintenance", label: "Recurring Facilities Maintenance / Service Work Orders" },
];
const VOLUME: Opt[] = [
  { value: "1-5", label: "1 to 5 jobs" },
  { value: "6-15", label: "6 to 15 jobs" },
  { value: "16+", label: "16+ jobs" },
];
const STORAGE: Opt[] = [
  { value: "Paper timecards and manila folders", label: "Paper timecards, physical clipboards, and manila folders" },
  { value: "Excel spreadsheets", label: "Disconnected Excel spreadsheets (budgets, PO logs, tracking sheets)" },
  { value: "Local server / Shared drives", label: "Local office server or shared desktop network drive" },
  { value: "Accounting system only", label: "Accounting software (QuickBooks / Sage) without field operational integration" },
];
const FRICTION: Opt[] = [
  { value: "Delayed Labor Tracking", label: "Delayed Labor Tracking:", detail: "Paper timecards collected days late, causing payroll bottlenecks and lagged job-cost data." },
  { value: "Uncontrolled Field Spending", label: "Field Purchases & POs:", detail: "Material receipts and card purchases bypassing PO approvals, causing surprise overruns." },
  { value: "Unbilled Extra Work", label: "Unbilled Extra Work:", detail: "T&M work done on verbal request without prompt change orders added to the billing schedule." },
  { value: "Manual Progress Billing", label: "Manual AIA Billing:", detail: "Reconciling G702/G703 pay apps and retainage across manual spreadsheets." },
  { value: "Lagging Cost Reports", label: "Lagging Cost Reports:", detail: "Not knowing a job's labor is bleeding hours until long after the work has been completed." },
];
const PRIORITIES: Opt[] = [
  { value: "Committed Costs & PO Tracking", label: "Committed Costs & POs:", detail: "Issue POs against cost codes to catch budget overruns at issuance rather than weeks later." },
  { value: "Mobile Field Timecards", label: "Mobile Field Timecards & Daily Logs:", detail: "Offline PWA for foremen to record daily crew hours, clock events, and site reports." },
  { value: "3-Way AP Bill Matching", label: "3-Way AP Bill Matching:", detail: "Match vendor bills against POs and receiving slips with a locked cost ledger before pushing to accounting." },
  { value: "Change Order & T&M Engine", label: "Change Order & SOV Engine:", detail: "Track change orders and T&M tickets with automatic updates to budget, contract, and billing schedules." },
  { value: "AIA G702/G703 Pay Applications", label: "AIA Progress Billing:", detail: "Generate automated G702/G703 progress pay apps with retainage tracking and accounting sync." },
  { value: "Real-Time Forecasting & Divergence", label: "Real-Time Forecasting & Divergence:", detail: "Weekly flash reports highlighting jobs where labor productivity is falling behind schedule." },
  { value: "Work Order & Maintenance Invoicing", label: "Work Order & Service Invoicing:", detail: "Fast technician views and instant invoice exports for work-order/maintenance jobs." },
];
const WINDOWS: Opt[] = [
  { value: "Morning", label: "Morning (9:00 AM – 12:00 PM EST)" },
  { value: "Afternoon", label: "Afternoon (1:00 PM – 5:00 PM EST)" },
  { value: "Flexible", label: "Any time during business hours" },
];

const schema = z.object({
  friction: z.array(z.string()).max(3, "Please select up to 3 items."),
  single_headache: z.string().trim().max(500, "Please keep this under 500 characters."),
  priority: z.array(z.string()).min(2, "Please select between 2 and 4 priorities before submitting.").max(4, "Please select between 2 and 4 priorities before submitting."),
  existing_software: z.string().trim().max(300, "Please keep this under 300 characters."),
  client_name: z.string().trim().min(1, "Full name is required.").max(100, "Name is too long."),
  company_name: z.string().trim().min(1, "Company name is required.").max(150, "Company name is too long."),
  client_email: z.string().trim().min(1, "Email address is required.").email("Please enter a valid email address.").max(254),
  client_phone: z.string().trim().max(30, "Phone number is too long.").regex(/^[0-9+()\-.\s]*$/, "Please enter a valid phone number."),
});

type FormState = {
  work_mix: string[];
  job_volume: string;
  storage: string[];
  friction: string[];
  single_headache: string;
  priority: string[];
  existing_software: string;
  client_name: string;
  company_name: string;
  client_email: string;
  client_phone: string;
  preferred_window: string;
  _honeypot: string;
};

const INITIAL: FormState = {
  work_mix: [], job_volume: "1-5", storage: [], friction: [], single_headache: "", priority: [],
  existing_software: "", client_name: "", company_name: "", client_email: "", client_phone: "",
  preferred_window: "Morning", _honeypot: "",
};

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function FieldLabel({ children, required, htmlFor }: { children: ReactNode; required?: boolean; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-foreground">
      {children} {required && <span className="text-destructive">*</span>}
    </label>
  );
}

function ErrorText({ msg, id }: { msg?: string; id?: string }) {
  if (!msg) return null;
  return <p id={id} className="mt-2 text-sm font-medium text-destructive">{msg}</p>;
}

function OptionList({
  name, type, options, selected, onToggle, invalid,
}: {
  name: string; type: "checkbox" | "radio"; options: Opt[]; selected: string[];
  onToggle: (v: string) => void; invalid?: boolean;
}) {
  return (
    <div className={type === "radio" ? "grid grid-cols-1 gap-3 sm:grid-cols-3" : "space-y-2"}>
      {options.map((o) => {
        const on = selected.includes(o.value);
        return (
          <label
            key={o.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted ${
              on ? "border-primary bg-primary/5" : invalid ? "border-destructive/60" : "border-border"
            }`}
          >
            <input
              type={type}
              name={name}
              value={o.value}
              checked={on}
              onChange={() => onToggle(o.value)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            />
            <span className="text-sm text-foreground">
              {o.detail ? <><strong>{o.label}</strong> <span className="text-muted-foreground">{o.detail}</span></> : o.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export default function ContractorModernizationIntake() {
  const [f, setF] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    document.title = "Operational Management & Field-to-Financials Snapshot";
  }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    if (errors[k as string]) setErrors((e) => { const n = { ...e }; delete n[k as string]; return n; });
  };

  const toggle = (k: "work_mix" | "storage" | "friction" | "priority", v: string, max?: number) => {
    const cur = f[k];
    if (cur.includes(v)) return set(k, cur.filter((x) => x !== v));
    if (max && cur.length >= max) {
      setErrors((e) => ({ ...e, [k]: k === "priority" ? "Please select a maximum of 4 priority items." : `Please select up to ${max} items.` }));
      return;
    }
    set(k, [...cur, v]);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const r = schema.safeParse(f);
    if (!r.success) {
      const errs: Record<string, string> = {};
      for (const i of r.error.issues) { const k = String(i.path[0]); if (!errs[k]) errs[k] = i.message; }
      setErrors(errs);
      const first = ["friction", "single_headache", "priority", "existing_software", "client_name", "company_name", "client_email", "client_phone"].find((k) => errs[k]);
      document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("contractor-intake", { body: { ...f, ...r.data } });
      if (error || (data && data.error)) throw new Error("submit failed");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setServerError("We couldn't submit your form. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-primary px-6 py-8 text-primary-foreground">
          <div className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Discovery Intake
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Operational Management &amp; Field-to-Financials Snapshot</h1>
          <p className="mt-2 text-sm leading-relaxed opacity-85">
            Estimated time: 3 minutes. Please tell us where your biggest operational bottlenecks occur today so we can tailor our walkthrough strictly to the features that move the needle for your business.
          </p>
        </div>

        {done ? (
          <div className="p-10 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Information Received</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Thank you. We have logged your priority operational areas and are setting up a targeted walkthrough environment focusing directly on those workflows.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-10 p-6 sm:p-8">
            <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden"
              value={f._honeypot} onChange={(e) => set("_honeypot", e.target.value)} />

            <Section title="1. Operating Profile">
              <div>
                <FieldLabel>Primary Work Mix &amp; Scope (Select all that apply)</FieldLabel>
                <OptionList name="work_mix" type="checkbox" options={WORK_MIX} selected={f.work_mix} onToggle={(v) => toggle("work_mix", v)} />
              </div>
              <div>
                <FieldLabel>Active Project Volume</FieldLabel>
                <OptionList name="job_volume" type="radio" options={VOLUME} selected={[f.job_volume]} onToggle={(v) => set("job_volume", v)} />
              </div>
            </Section>

            <Section title="2. Information Silos & Friction Points">
              <div>
                <FieldLabel>Where do operational and cost records live today? (Select all that apply)</FieldLabel>
                <OptionList name="storage" type="checkbox" options={STORAGE} selected={f.storage} onToggle={(v) => toggle("storage", v)} />
              </div>
              <div id="field-friction">
                <FieldLabel>Where do administrative delays happen most? (Select up to 3)</FieldLabel>
                <OptionList name="friction" type="checkbox" options={FRICTION} selected={f.friction} onToggle={(v) => toggle("friction", v, 3)} invalid={!!errors.friction} />
                <ErrorText msg={errors.friction} />
              </div>
            </Section>

            <Section title="3. Primary Targets & Priorities">
              <div id="field-single_headache">
                <FieldLabel htmlFor="single_headache">What is your single biggest operational headache today?</FieldLabel>
                <input id="single_headache" className={inputCls} maxLength={500} value={f.single_headache}
                  placeholder="e.g., Paper timecards, delayed bill matching, late change order billing..."
                  onChange={(e) => set("single_headache", e.target.value)} />
                <ErrorText msg={errors.single_headache} />
              </div>
              <div id="field-priority">
                <div className="mb-1 flex items-end justify-between gap-3">
                  <FieldLabel required>Select the 2 to 4 items you want to tackle first</FieldLabel>
                  <span className={`mb-2 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    f.priority.length >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {f.priority.length} of 4 selected
                  </span>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">Please choose at least 2 and up to 4 priorities for our demo.</p>
                <OptionList name="priority" type="checkbox" options={PRIORITIES} selected={f.priority} onToggle={(v) => toggle("priority", v, 4)} invalid={!!errors.priority} />
                <ErrorText msg={errors.priority} />
              </div>
            </Section>

            <Section title="4. Existing Systems & Logistics">
              <div id="field-existing_software">
                <FieldLabel htmlFor="existing_software">What accounting system or core software must remain in place?</FieldLabel>
                <input id="existing_software" className={inputCls} maxLength={300} value={f.existing_software}
                  placeholder="e.g., QuickBooks Online, Sage 100/300, Excel..."
                  onChange={(e) => set("existing_software", e.target.value)} />
                <ErrorText msg={errors.existing_software} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div id="field-client_name">
                  <FieldLabel htmlFor="client_name" required>Full Name</FieldLabel>
                  <input id="client_name" autoComplete="name" className={inputCls} maxLength={100} value={f.client_name}
                    aria-invalid={!!errors.client_name} onChange={(e) => set("client_name", e.target.value)} />
                  <ErrorText msg={errors.client_name} />
                </div>
                <div id="field-company_name">
                  <FieldLabel htmlFor="company_name" required>Company Name</FieldLabel>
                  <input id="company_name" autoComplete="organization" className={inputCls} maxLength={150} value={f.company_name}
                    aria-invalid={!!errors.company_name} onChange={(e) => set("company_name", e.target.value)} />
                  <ErrorText msg={errors.company_name} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div id="field-client_email">
                  <FieldLabel htmlFor="client_email" required>Email Address</FieldLabel>
                  <input id="client_email" type="email" autoComplete="email" className={inputCls} maxLength={254} value={f.client_email}
                    aria-invalid={!!errors.client_email} onChange={(e) => set("client_email", e.target.value)} />
                  <ErrorText msg={errors.client_email} />
                </div>
                <div id="field-client_phone">
                  <FieldLabel htmlFor="client_phone">Direct Phone</FieldLabel>
                  <input id="client_phone" type="tel" autoComplete="tel" className={inputCls} maxLength={30} value={f.client_phone}
                    aria-invalid={!!errors.client_phone} onChange={(e) => set("client_phone", e.target.value)} />
                  <ErrorText msg={errors.client_phone} />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="preferred_window">Preferred Time for 20-Min Walkthrough</FieldLabel>
                <select id="preferred_window" className={inputCls} value={f.preferred_window}
                  onChange={(e) => set("preferred_window", e.target.value)}>
                  {WINDOWS.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
              </div>
            </Section>

            {serverError && <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{serverError}</p>}

            <button type="submit" disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting…" : "Submit & Request Walkthrough"}
            </button>
          </form>
        )}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">Your information is kept confidential.</p>
    </div>
  );
}
