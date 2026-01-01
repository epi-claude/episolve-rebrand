import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  preferredDate?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-booking-email function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, company, preferredDate, message }: BookingEmailRequest = await req.json();
    console.log("Received booking request from:", email);

    const formattedDate = preferredDate ? new Date(preferredDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Not specified';

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "Episolve <onboarding@resend.dev>",
      to: [email],
      subject: "Your Strategic Audit Booking - Episolve",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">Thank you for booking a Strategic Audit, ${name}!</h1>
          <p>We've received your consultation request and our team will be in touch shortly to confirm your appointment.</p>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">Booking Details:</h3>
            <p><strong>Preferred Date:</strong> ${formattedDate}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            ${message ? `<p><strong>Additional Notes:</strong> ${message}</p>` : ''}
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
      subject: `New Strategic Audit Booking from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">New Strategic Audit Booking</h1>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            <p><strong>Preferred Date:</strong> ${formattedDate}</p>
            ${message ? `<p><strong>Additional Notes:</strong> ${message}</p>` : ''}
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
