import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, CheckCircle2, Clock, Loader2, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/episolve-logo-horizontal.png";
import { SECTIONS, type Answers, type Q } from "@/data/contractorDiscovery";

const STORE_KEY = "episolve-contractor-discovery-v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NumberedQ = Q & { id: string; num: string; section: string };
type Item = { kind: "heading"; label: string } | { kind: "pair"; qs: NumberedQ[] } | { kind: "q"; q: NumberedQ };

const NUMBERED = SECTIONS.map((s, si) => {
  let n = 0;
  const items: Item[] = [];
  let pair: NumberedQ[] = [];
  const flush = () => { if (pair.length) { items.push({ kind: "pair", qs: pair }); pair = []; } };
  for (const q of s.questions) {
    if (q.type === "heading") { flush(); items.push({ kind: "heading", label: q.label }); continue; }
    const nq = { ...q, id: q.id!, num: `${si + 1}.${++n}`, section: s.id } as NumberedQ;
    if (q.pair) pair.push(nq); else { flush(); items.push({ kind: "q", q: nq }); }
  }
  flush();
  return { ...s, items };
});
const ALL_Q: NumberedQ[] = NUMBERED.flatMap((s) => s.items.flatMap((i) => (i.kind === "q" ? [i.q] : i.kind === "pair" ? i.qs : [])));
const REQUIRED = ALL_Q.filter((q) => q.required);

const isAnswered = (v: unknown) => (Array.isArray(v) ? v.length > 0 : v !== "" && v != null);
const isVisible = (q: Q, a: Answers) => !q.showIf || q.showIf(a);

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";

type State = { answers: Answers; others: Record<string, string>; comments: Record<string, string> };
const EMPTY: State = { answers: {}, others: {}, comments: {} };

/* ---------------- module-scope presentational components ---------------- */

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Control({ q, value, other, onChange, onOther, maxMsg }: {
  q: NumberedQ; value: string | string[] | undefined; other: string;
  onChange: (v: string | string[]) => void; onOther: (v: string) => void; maxMsg?: string;
}) {
  const id = `q_${q.id}`;
  if (["text", "email", "tel", "url", "number"].includes(q.type)) {
    const ac: Record<string, string> = { full_name: "name", email: "email", phone: "tel", company: "organization", title: "organization-title", website: "url" };
    return <input id={id} type={q.type} className={inputCls} placeholder={q.placeholder} autoComplete={ac[q.id] || "off"}
      value={(value as string) || ""} onChange={(e) => onChange(e.target.value)} {...(q.type === "number" ? { min: 0, inputMode: "numeric" as const } : {})} />;
  }
  if (q.type === "textarea")
    return <textarea id={id} rows={4} className={`${inputCls} min-h-24 resize-y`} placeholder={q.placeholder} value={(value as string) || ""} onChange={(e) => onChange(e.target.value)} />;
  if (q.type === "select")
    return (
      <select id={id} className={inputCls} value={(value as string) || ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select…</option>
        {q.options!.map((o) => <option key={o}>{o}</option>)}
      </select>
    );
  if (q.type === "scale")
    return (
      <div className="max-w-md">
        <div className="grid grid-cols-5 gap-1.5" role="radiogroup">
          {[1, 2, 3, 4, 5].map((n) => {
            const on = value === String(n);
            return (
              <label key={n} className={`cursor-pointer rounded-lg border py-2 text-center text-sm font-medium tabular-nums transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary/40"}`}>
                <input type="radio" name={id} value={n} checked={on} onChange={() => onChange(String(n))} className="sr-only" />{n}
              </label>
            );
          })}
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-muted-foreground"><span>1 · {q.low}</span><span>{q.high} · 5</span></div>
      </div>
    );
  // radio / checkbox
  const multi = q.type === "checkbox";
  const sel = multi ? ((value as string[]) || []) : [value as string];
  const opts = [...q.options!, ...(q.other ? ["__other"] : [])];
  const toggle = (o: string) => {
    if (!multi) return onChange(o);
    onChange(sel.includes(o) ? sel.filter((x) => x !== o) : [...sel, o]);
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {opts.map((o) => {
          const on = sel.includes(o);
          return (
            <label key={o} className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${on ? "border-primary bg-primary/5 text-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/30"}`}>
              <input type={multi ? "checkbox" : "radio"} name={id} checked={on} onChange={() => toggle(o)} className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
              <span>{o === "__other" ? "Other" : o}</span>
            </label>
          );
        })}
      </div>
      {q.other && sel.includes("__other") && (
        <input className={`${inputCls} mt-2`} placeholder="Please describe" value={other} onChange={(e) => onOther(e.target.value)} autoFocus />
      )}
      {q.max && <p className="mt-1.5 text-xs text-muted-foreground">{maxMsg || `${sel.length} of ${q.max} selected`}</p>}
    </>
  );
}

function Question({ q, st, invalid, maxMsg, setAnswer, setOther, setComment }: {
  q: NumberedQ; st: State; invalid: boolean; maxMsg?: string;
  setAnswer: (q: NumberedQ, v: string | string[]) => void; setOther: (id: string, v: string) => void; setComment: (k: string, v: string) => void;
}) {
  const showComment = q.comment !== false && q.type !== "textarea";
  return (
    <div id={`wrap_${q.id}`} className="border-b border-border px-5 py-5 last:border-b-0 sm:px-7">
      <label htmlFor={`q_${q.id}`} className="flex gap-2.5 text-[15px] font-medium text-foreground">
        <span className="min-w-[30px] shrink-0 tabular-nums text-muted-foreground">{q.num}</span>
        <span>{q.label}{q.required && <span className="text-destructive"> *</span>}</span>
      </label>
      <div className="mt-2 sm:ml-10">
        {q.help && <p className="mb-2.5 text-sm text-muted-foreground">{q.help}</p>}
        <div className={invalid ? "[&_input]:border-destructive" : ""}>
          <Control q={q} value={st.answers[q.id]} other={st.others[q.id] || ""} maxMsg={maxMsg}
            onChange={(v) => setAnswer(q, v)} onOther={(v) => setOther(q.id, v)} />
        </div>
        {invalid && <p className="mt-1.5 text-sm text-destructive">This field is required{q.type === "email" ? " and must be a valid email" : ""}.</p>}
        {showComment && (
          <div className="mt-3">
            <label htmlFor={`c_${q.id}`} className="mb-1 block text-xs font-medium text-muted-foreground">Comments</label>
            <textarea id={`c_${q.id}`} rows={2} className={`${inputCls} resize-y`} placeholder="Add context, exceptions or examples (optional)"
              value={st.comments[q.id] || ""} onChange={(e) => setComment(q.id, e.target.value)} />
          </div>
        )}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <a href="https://episolve.com" aria-label="epiSolve home"><img src={logo} alt="epiSolve" className="h-8 w-auto opacity-90" /></a>
          <div className="text-xs leading-relaxed">
            <p>An epiSolve discovery project</p>
            <p>Your responses are confidential and used only to prepare for our conversation.</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs sm:items-end">
          <a href="https://episolve.com" className="font-medium text-primary hover:underline">episolve.com</a>
          <span>© {new Date().getFullYear()} epiSolve LLC</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- page ---------------- */

export default function ContractorModernizationIntake() {
  const [st, setSt] = useState<State>(EMPTY);
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [maxMsg, setMaxMsg] = useState<Record<string, string>>({});
  const [saveText, setSaveText] = useState("Saves as you type on this device");
  const [saveState, setSaveState] = useState<"" | "saving" | "saved" | "error">("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [active, setActive] = useState(SECTIONS[0].id);
  const loaded = useRef(false);
  const timer = useRef<number>();

  useEffect(() => {
    document.title = "Contractor Operations Discovery | epiSolve";
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (saved?.v === 3 && saved.state) {
        setSt({ ...EMPTY, ...saved.state });
        const d = new Date(saved.savedAt);
        setSaveState("saved");
        setSaveText(`Welcome back. Answers restored from ${d.toLocaleDateString([], { month: "short", day: "numeric" })} at ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`);
      }
    } catch { /* ignore */ }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current || done) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        const now = new Date();
        localStorage.setItem(STORE_KEY, JSON.stringify({ v: 3, savedAt: now.toISOString(), state: st }));
        setSaveState("saved");
        setSaveText(`All changes saved on this device · ${now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`);
      } catch {
        setSaveState("error");
        setSaveText("Couldn't save in this browser. Please finish in one sitting.");
      }
    }, 300);
  }, [st, done]);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(`sec_${s.id}`)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver((ents) => {
      const v = ents.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (v) setActive(v.target.id.replace("sec_", ""));
    }, { rootMargin: "-140px 0px -55% 0px" });
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [done]);

  const touch = () => { setSaveState("saving"); setSaveText("Saving…"); };
  const setAnswer = (q: NumberedQ, v: string | string[]) => {
    if (q.max && Array.isArray(v) && v.length > q.max) {
      setMaxMsg((m) => ({ ...m, [q.id]: `You can pick up to ${q.max}. Unselect one to choose another.` }));
      return;
    }
    setMaxMsg((m) => { const n = { ...m }; delete n[q.id]; return n; });
    setInvalid((i) => (i[q.id] ? { ...i, [q.id]: false } : i));
    touch();
    setSt((p) => ({ ...p, answers: { ...p.answers, [q.id]: v } }));
  };
  const setOther = (id: string, v: string) => { touch(); setSt((p) => ({ ...p, others: { ...p.others, [id]: v } })); };
  const setComment = (k: string, v: string) => { touch(); setSt((p) => ({ ...p, comments: { ...p.comments, [k]: v } })); };

  const progress = useMemo(() => {
    let total = 0, doneN = 0;
    const per: Record<string, { t: number; d: number }> = {};
    for (const q of ALL_Q) {
      per[q.section] ||= { t: 0, d: 0 };
      if (!isVisible(q, st.answers)) continue;
      total++; per[q.section].t++;
      if (isAnswered(st.answers[q.id])) { doneN++; per[q.section].d++; }
    }
    return { total, done: doneN, per, pct: total ? Math.round((doneN / total) * 100) : 0 };
  }, [st.answers]);

  function buildPayload() {
    const a = st.answers;
    return {
      form: "contractor-operations-discovery",
      submitted_at: new Date().toISOString(),
      contact: { name: String(a.full_name || "").trim(), title: String(a.title || "").trim(), company: String(a.company || "").trim(), email: String(a.email || "").trim() },
      sections: NUMBERED.map((s) => ({
        section: s.title,
        section_comments: (st.comments[`section_${s.id}`] || "").trim(),
        answers: ALL_Q.filter((q) => q.section === s.id && isVisible(q, a)).map((q) => {
          const other = (st.others[q.id] || "").trim();
          let ans = a[q.id] ?? (q.type === "checkbox" ? [] : "");
          if (Array.isArray(ans)) ans = ans.map((v) => (v === "__other" ? `Other: ${other}` : v));
          else ans = ans === "__other" ? `Other: ${other}` : String(ans).trim();
          return { id: q.id, number: q.num, question: q.label, answer: ans, comments: (st.comments[q.id] || "").trim() };
        }),
      })),
    };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bad: Record<string, boolean> = {};
    for (const q of REQUIRED) {
      const v = String(st.answers[q.id] || "").trim();
      if (!v || (q.type === "email" && !EMAIL_RE.test(v))) bad[q.id] = true;
    }
    setInvalid(bad);
    const first = REQUIRED.find((q) => bad[q.id]);
    if (first) {
      setFormError("Please complete the required fields marked with * in Section 1 (About You & Your Company).");
      const el = document.getElementById(`q_${first.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("contractor-intake", { body: buildPayload() });
      if (error || data?.error) throw new Error("submit failed");
      window.clearTimeout(timer.current);
      try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError("We couldn't submit your questionnaire. Please try again in a moment. Your answers are still saved.");
    } finally {
      setSubmitting(false);
    }
  }

  function clearAll() {
    if (!window.confirm("Clear all of your answers? This can't be undone.")) return;
    window.clearTimeout(timer.current);
    try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
    setSt(EMPTY); setInvalid({}); setFormError("");
    setSaveState(""); setSaveText("Saves as you type on this device");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const dot = { "": "bg-border", saving: "bg-accent", saved: "bg-primary", error: "bg-destructive" }[saveState];

  return (
    <div className="flex min-h-screen flex-col bg-muted/40 text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center px-5 py-3">
          <a href="https://episolve.com" aria-label="epiSolve home"><img src={logo} alt="epiSolve" className="h-7 w-auto" /></a>
        </div>
      </header>

      <main className="flex-1">
        {done ? (
          <div className="mx-auto max-w-xl px-5 py-20 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Thank you, we have your responses.</h2>
            <p className="mt-3 text-muted-foreground">Our team will review what you've shared and reach out within two business days to schedule a follow-up conversation. We'll come prepared with questions and observations specific to the areas you flagged.</p>
            <p className="mt-3 text-muted-foreground">In the meantime, you can learn more about us at <a href="https://episolve.com" className="font-medium text-primary hover:underline">episolve.com</a>.</p>
          </div>
        ) : (
          <>
            <div className="mx-auto max-w-4xl px-5 pb-4 pt-10 sm:pt-12">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/80">Operations &amp; Job Cost Discovery</p>
              <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">Mechanical Contractor Operations Questionnaire</h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">
                Before we talk, we'd like to understand how your business actually runs today: how jobs are set up, how labor and material costs flow from the field to the office, how change orders and billing are handled, and where things slow down or slip through. Your answers shape a focused follow-up conversation about the problems you're facing and how you'd like to approach them.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {[[Check, "Saves as you type"], [RotateCcw, "Come back any time to finish"], [Clock, "About 20 minutes for the whole form"]].map(([Icon, t]) => {
                  const I = Icon as typeof Check;
                  return <li key={t as string} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground"><I className="h-4 w-4 text-primary" />{t as string}</li>;
                })}
              </ul>
              <div className="mt-6 grid gap-4 md:grid-cols-[1.3fr_1fr]">
                <Panel title="A few notes">
                  <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                    <li>There are no right or wrong answers. Describe things as they really are, not as they're supposed to be.</li>
                    <li>Skip anything that doesn't apply. Only your name, company and email are required.</li>
                    <li>Each question about your operations has a comments box. Use it for context, exceptions or examples; this is often the most useful part.</li>
                    <li>Your answers save automatically in this browser as you type. Close the page whenever you like and reopen this link on the same device and browser to pick up where you left off.</li>
                  </ul>
                </Panel>
                <Panel title="What happens next">
                  <ol className="space-y-2.5 text-sm text-muted-foreground">
                    {["You complete the questionnaire (or as much of it as you like).", "We review your answers and prepare specific questions and observations.", "We meet for a follow-up conversation to talk through your priority problem areas and possible approaches."].map((t, i) => (
                      <li key={i} className="flex gap-2.5"><span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>{t}</li>
                    ))}
                  </ol>
                </Panel>
              </div>
            </div>

            <div className="mx-auto max-w-4xl px-5 pb-16">
              <div className="sticky top-0 z-30 -mx-5 mb-5 border-b border-border bg-muted/95 px-5 backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2 pt-3 text-xs text-muted-foreground sm:text-sm">
                  <span className="inline-flex items-center gap-2" aria-live="polite"><i className={`h-2 w-2 rounded-full ${dot}`} />{saveText}</span>
                  <span className="inline-flex items-center gap-2.5 tabular-nums text-foreground">
                    <span><b>{progress.done}</b> of <b>{progress.total}</b> answered</span>
                    <span className="h-1.5 w-32 overflow-hidden rounded-full bg-border"><i className="block h-full bg-primary transition-all" style={{ width: `${progress.pct}%` }} /></span>
                  </span>
                </div>
                <nav aria-label="Questionnaire sections">
                  <ol className="-mx-2 flex justify-between overflow-x-auto [scrollbar-width:none]">
                    {SECTIONS.map((s, i) => {
                      const p = progress.per[s.id];
                      const complete = p && p.t > 0 && p.d === p.t;
                      const on = active === s.id;
                      return (
                        <li key={s.id}>
                          <a href={`#sec_${s.id}`} title={`${s.title}: ${p?.d ?? 0} of ${p?.t ?? 0} answered`}
                            className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-2 pb-2.5 pt-2.5 text-[13px] font-medium transition-colors ${on ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                            <span className={`grid h-5 w-5 place-items-center rounded-full text-[11px] font-semibold ${on ? "bg-primary text-primary-foreground" : complete ? "bg-primary/15 text-primary" : "bg-border text-muted-foreground"}`}>{complete && !on ? <Check className="h-3 w-3" /> : i + 1}</span>
                            {s.short}
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                </nav>
              </div>

              <form onSubmit={onSubmit} noValidate>
                {NUMBERED.map((s, si) => (
                  <section key={s.id} id={`sec_${s.id}`} className="mb-6 scroll-mt-32 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border px-5 pb-4 pt-6 sm:px-7">
                      <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">Section {si + 1} of {SECTIONS.length}</p>
                      <h2 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">{s.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{s.intro}</p>
                    </div>
                    {s.items.map((it, k) => {
                      const props = { st, setAnswer, setOther, setComment };
                      if (it.kind === "heading") return <div key={k} className="border-b border-border bg-muted/50 px-5 pb-2.5 pt-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:px-7">{it.label}</div>;
                      if (it.kind === "pair") return (
                        <div key={k} className="grid border-b border-border sm:grid-cols-2 [&>div]:border-b-0">
                          {it.qs.map((q) => <Question key={q.id} q={q} invalid={!!invalid[q.id]} {...props} />)}
                        </div>
                      );
                      if (!isVisible(it.q, st.answers)) return null;
                      return <Question key={it.q.id} q={it.q} invalid={!!invalid[it.q.id]} maxMsg={maxMsg[it.q.id]} {...props} />;
                    })}
                    <div className="px-5 py-5 sm:px-7">
                      <label htmlFor={`c_section_${s.id}`} className="mb-1 block text-sm font-medium text-foreground">Anything else about {s.title.toLowerCase()}?</label>
                      <textarea id={`c_section_${s.id}`} rows={3} className={`${inputCls} resize-y`} placeholder="Optional"
                        value={st.comments[`section_${s.id}`] || ""} onChange={(e) => setComment(`section_${s.id}`, e.target.value)} />
                    </div>
                  </section>
                ))}

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
                  <h2 className="text-xl font-semibold text-foreground">Ready to send?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">You can submit now even if some questions are blank. We'll cover anything open during our conversation.</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button type="submit" disabled={submitting}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60">
                      {submitting && <Loader2 className="h-4 w-4 animate-spin" />}{submitting ? "Submitting…" : "Submit questionnaire"}
                    </button>
                    <button type="button" onClick={clearAll} className="rounded-lg border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Clear my answers</button>
                  </div>
                  {formError && <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{formError}</p>}
                </div>
              </form>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
