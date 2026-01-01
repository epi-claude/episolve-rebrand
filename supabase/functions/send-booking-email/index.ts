import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const BookingEmailSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").trim(),
  email: z.string().email("Invalid email address").max(254, "Email too long"),
  phone: z.string().max(20, "Phone number too long").optional(),
  company: z.string().max(100, "Company name too long").optional(),
  preferredDate: z.string().max(50, "Date too long").optional(),
  message: z.string().max(2000, "Message too long").optional(),
});

// HTML escape function to prevent injection
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-booking-email function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const parseResult = BookingEmailSchema.safeParse(body);
    if (!parseResult.success) {
      console.error("Validation error:", parseResult.error.errors);
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parseResult.error.errors }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, phone, company, preferredDate, message } = parseResult.data;
    console.log("Received booking request from:", email);

    const formattedDate = preferredDate ? new Date(preferredDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Not specified';

    // Escape all user inputs for safe HTML rendering
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : null;
    const safeCompany = company ? escapeHtml(company) : null;
    const safeFormattedDate = escapeHtml(formattedDate);
    const safeMessage = message ? escapeHtml(message) : null;

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "Episolve <onboarding@resend.dev>",
      to: [email],
      subject: "Your Strategic Audit Booking - Episolve",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">Thank you for booking a Strategic Audit, ${safeName}!</h1>
          <p>We've received your consultation request and our team will be in touch shortly to confirm your appointment.</p>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">Booking Details:</h3>
            <p><strong>Preferred Date:</strong> ${safeFormattedDate}</p>
            ${safeCompany ? `<p><strong>Company:</strong> ${safeCompany}</p>` : ''}
            ${safeMessage ? `<p><strong>Additional Notes:</strong> ${safeMessage}</p>` : ''}
          </div>
          <h3 style="color: #2d3748;">What to Expect:</h3>
          <ul>
            <li>A team member will contact you within 24 hours</li>
            <li>We'll discuss your specific challenges and goals</li>
            <li>You'll receive a tailored action plan</li>
          </ul>
          <p>Best regards,<br>The Episolve Team</p>
        </div>
      `,
    });

    console.log("User confirmation email sent:", userEmailResponse);

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Episolve Website <onboarding@resend.dev>",
      to: ["contact@episolve.com"],
      subject: `New Strategic Audit Booking from ${safeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">New Strategic Audit Booking</h1>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ''}
            ${safeCompany ? `<p><strong>Company:</strong> ${safeCompany}</p>` : ''}
            <p><strong>Preferred Date:</strong> ${safeFormattedDate}</p>
            ${safeMessage ? `<p><strong>Additional Notes:</strong> ${safeMessage}</p>` : ''}
          </div>
        </div>
      `,
    });

    console.log("Admin notification email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ success: true, userEmail: userEmailResponse, adminEmail: adminEmailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
