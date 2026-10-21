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

const Answer = z.object({
  id: str(60),
  number: str(10),
  question: str(400),
  answer: z.union([str(3000), z.array(str(500)).max(20)]),
  comments: str(3000).optional().default(""),
});

const Schema = z.object({
  form: z.literal("contractor-operations-discovery"),
  submitted_at: z.string().optional(),
  contact: z.object({
    name: str(100).min(1),
    title: str(150).optional().default(""),
    company: str(150).min(1),
    email: z.string().trim().email().max(254),
  }),
  sections: z.array(z.object({
    section: str(200),
    section_comments: str(3000).optional().default(""),
    answers: z.array(Answer).max(40),
  })).max(10),
});

function esc(t: string) {
  return t.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!));
}
const nl = (t: string) => esc(t).replace(/\n/g, "<br>");

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

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: row, error } = await admin
      .from("contractor_intake_submissions")
      .insert({ client_name: d.contact.name, company_name: d.contact.company, client_email: d.contact.email, answers: d })
      .select("id")
      .single();
    if (error) throw error;

    const td = "padding:8px 12px;border-bottom:1px solid #e5e7eb;vertical-align:top";
    const sectionsHtml = d.sections.map((s) => {
      const rows = s.answers.map((a) => {
        const empty = Array.isArray(a.answer) ? !a.answer.length : !a.answer;
        const val = empty ? '<span style="color:#9ca3af">—</span>'
          : Array.isArray(a.answer) ? a.answer.map((x) => `• ${esc(x)}`).join("<br>") : nl(a.answer);
        const c = a.comments ? `<div style="margin-top:6px;color:#6b7280;font-style:italic">Comment: ${nl(a.comments)}</div>` : "";
        return `<tr><td style="${td};width:42%;color:#254071;font-weight:600">${esc(a.number)} ${esc(a.question)}</td><td style="${td};color:#1f2937">${val}${c}</td></tr>`;
      }).join("");
      const sc = s.section_comments ? `<tr><td style="${td};color:#254071;font-weight:600">Additional comments</td><td style="${td}">${nl(s.section_comments)}</td></tr>` : "";
      return `<h3 style="margin:24px 0 8px;color:#254071;font-size:16px">${esc(s.section)}</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e5e7eb">${rows}${sc}</table>`;
    }).join("");

    const c = d.contact;
    const html = `<div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto">
      <div style="background:#254071;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0">
        <h2 style="margin:0">New Contractor Operations Discovery</h2>
        <p style="margin:6px 0 0;opacity:.85">${esc(c.company)} — ${esc(c.name)}${c.title ? ` (${esc(c.title)})` : ""} · ${esc(c.email)}</p>
      </div>${sectionsHtml}
      <p style="color:#6b7280;font-size:12px;margin-top:20px">Submitted ${new Date().toUTCString()}</p></div>`;

    const { error: mailErr } = await resend.emails.send({
      from: "Episolve Website <noreply@notify.e-dmm.com>",
      to: RECIPIENTS,
      replyTo: c.email,
      subject: `Contractor Discovery: ${c.company} (${c.name})`,
      html,
    });
    if (mailErr) console.error("Email send failed:", mailErr);
    else await admin.from("contractor_intake_submissions").update({ email_sent: true }).eq("id", row.id);
    return json({ success: true });
  } catch (e) {
    console.error("contractor-intake error:", e);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
