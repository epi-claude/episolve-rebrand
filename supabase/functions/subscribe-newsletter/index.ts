import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { checkRateLimit, getClientIP, rateLimitResponse } from "../_shared/rate-limiter.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const SubscribeSchema = z.object({
  email: z.string().email().max(255),
});

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = getClientIP(req);
    const rateLimitResult = checkRateLimit(clientIP, "subscribe-newsletter");
    
    if (!rateLimitResult.allowed) {
      console.log(`Rate limited: ${clientIP}, remaining: ${rateLimitResult.remaining}`);
      return rateLimitResponse(rateLimitResult, corsHeaders);
    }

    const body = await req.json();
    console.log("Newsletter subscription request received");

    // Validate input
    const validationResult = SubscribeSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email } = validationResult.data;
    console.log("Processing subscription for:", email);

    // Initialize Supabase client with anon key (respects RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Simply try to insert - PostgreSQL will handle duplicates via unique constraint
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (insertError) {
      // Check if it's a duplicate (unique constraint violation)
      if (insertError.code === "23505") {
        console.log("Email already subscribed:", email);
        return new Response(
          JSON.stringify({ message: "You're already subscribed!" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      console.error("Database insert error:", insertError);
      throw new Error("Failed to save subscription");
    }

    console.log("New subscriber added:", email);

    // Send welcome email
    const emailResponse = await resend.emails.send({
      from: "Episolve <noreply@notify.e-dmm.com>",
      to: [email],
      subject: "Welcome to Episolve Insights",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Welcome to Episolve!</h1>
          <p>Thank you for subscribing to our newsletter. You'll receive insights on:</p>
          <ul>
            <li>Technology strategy and leadership</li>
            <li>Cybersecurity and risk management</li>
            <li>Digital transformation trends</li>
          </ul>
          <p>We look forward to sharing valuable insights with you.</p>
          <p style="color: #666;">Best regards,<br>The Episolve Team</p>
        </div>
      `,
    });

    console.log("Welcome email sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Successfully subscribed!" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in subscribe-newsletter function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Subscription failed" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
