import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, unsubscribed_at")
      .eq("email", email)
      .single();

    if (existing && !existing.unsubscribed_at) {
      console.log("Email already subscribed:", email);
      return new Response(
        JSON.stringify({ message: "You're already subscribed!" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Insert or update subscriber
    if (existing) {
      // Re-subscribe
      await supabase
        .from("newsletter_subscribers")
        .update({ unsubscribed_at: null, subscribed_at: new Date().toISOString() })
        .eq("id", existing.id);
      console.log("Re-subscribed:", email);
    } else {
      // New subscriber
      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert({ email });

      if (insertError) {
        console.error("Database insert error:", insertError);
        throw new Error("Failed to save subscription");
      }
      console.log("New subscriber added:", email);
    }

    // Send welcome email
    const emailResponse = await resend.emails.send({
      from: "Episolve <onboarding@resend.dev>",
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
