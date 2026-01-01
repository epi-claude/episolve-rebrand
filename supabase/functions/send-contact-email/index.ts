import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-contact-email function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, company, service, message }: ContactEmailRequest = await req.json();
    console.log("Received contact form submission from:", email);

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "Episolve <onboarding@resend.dev>",
      to: [email],
      subject: "We've received your message - Episolve",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">Thank you for contacting us, ${name}!</h1>
          <p>We have received your message and one of our team members will get back to you within 24 hours.</p>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">Your Message Details:</h3>
            ${service ? `<p><strong>Service Interest:</strong> ${service}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p>Best regards,<br>The Episolve Team</p>
        </div>
      `,
    });

    console.log("User confirmation email sent:", userEmailResponse);

    // Send notification email to admin (you can change this to your actual admin email)
    const adminEmailResponse = await resend.emails.send({
      from: "Episolve Website <onboarding@resend.dev>",
      to: ["contact@episolve.com"],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">New Contact Form Submission</h1>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            ${service ? `<p><strong>Service Interest:</strong> ${service}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
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
    console.error("Error in send-contact-email function:", error);
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
