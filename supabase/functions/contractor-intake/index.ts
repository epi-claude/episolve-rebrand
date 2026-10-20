import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { checkRateLimit, getClientIP, rateLimitResponse } from "../_shared/rate-limiter.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const RECIPIENTS = ["rdb@episolve.com", "pjariwala@episolve.com"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const str = (max: number) => z.string().trim().max(max);
const list = (max: number) => z.array(str(200)).max(max);

const Schema = z.object({
  work_mix: list(3),
  job_volume: z.enum(["1-5", "6-15", "16+"]),
  storage: list(4),
  friction: list(3),
  single_headache: str(500).optional().default(""),
  priority: list(4).min(2),
  existing_software: str(300).optional().default(""),
  client_name: str(100).min(1),
  company_name: str(150).min(1),
  client_email: z.string().trim().email().max(254),
  client_phone: str(30).optional().default(""),
  preferred_window: z.enum(["Morning", "Afternoon", "Flexible"]),
  _honeypot: z.string().optional(),
});

function esc(t: string) {
  return t.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!));
}

const LABELS: [string, string][] = [
  ["client_name", "Full Name"],
  ["company_name", "Company Name"],
  ["client_email", "Email Address"],
  ["client_phone", "Direct Phone"],
  ["preferred_window", "Preferred Walkthrough Time"],
  ["work_mix", "Primary Work Mix & Scope"],
  ["job_volume", "Active Project Volume"],
  ["storage", "Where records live today"],
  ["friction", "Where administrative delays happen most"],
  ["single_headache", "Single biggest operational headache"],
  ["priority", "Priorities to tackle first"],
  ["existing_software", "Accounting system / software to keep"],
];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...corsHeaders } });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const rl = checkRateLimit(getClientIP(req), "contractor-intake");
    if (!rl.allowed) return rateLimitResponse(rl, corsHeaders);

    const parsed = Schema.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Invalid input", details: parsed.error.errors }, 400);
    const d = parsed.data;
    if (d._honeypot) return json({ success: true });
    delete d._honeypot;

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: row, error } = await admin
      .from("contractor_intake_submissions")
      .insert({ client_name: d.client_name, company_name: d.company_name, client_email: d.client_email, answers: d })
      .select("id")
      .single();
    if (error) throw error;

    const rows = LABELS.map(([k, label]) => {
      const v = (d as Record<string, unknown>)[k];
      const val = Array.isArray(v) ? (v.length ? v.map((x) => `• ${esc(String(x))}`).join("<br>") : "—") : esc(String(v || "—"));
      return `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#254071;vertical-align:top;width:40%">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#1f2937">${val}</td></tr>`;
    }).join("");

    const html = `<div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto">
      <div style="background:#254071;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0">
        <h2 style="margin:0">New Contractor Modernization Intake</h2>
        <p style="margin:6px 0 0;opacity:.85">${esc(d.company_name)} — ${esc(d.client_name)}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e5e7eb">${rows}</table>
      <p style="color:#6b7280;font-size:12px">Submitted ${new Date().toUTCString()}</p></div>`;

    const { error: mailErr } = await resend.emails.send({
      from: "Episolve Website <noreply@notify.e-dmm.com>",
      to: RECIPIENTS,
      replyTo: d.client_email,
      subject: `Contractor Intake: ${d.company_name} (${d.client_name})`,
      html,
    });
    if (mailErr) {
      console.error("Email send failed:", mailErr);
    } else {
      await admin.from("contractor_intake_submissions").update({ email_sent: true }).eq("id", row.id);
    }
    return json({ success: true });
  } catch (e) {
    console.error("contractor-intake error:", e);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
