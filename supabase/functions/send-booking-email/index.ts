import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const GHL_API_KEY = Deno.env.get("GHL_API_KEY");
const GHL_LOCATION_ID = Deno.env.get("GHL_LOCATION_ID");
const GHL_CALENDAR_ID = Deno.env.get("GHL_CALENDAR_ID");

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

// Function to sync booking to GHL
async function syncToGHL(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  preferredDate?: string;
  message?: string;
}): Promise<string | null> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.log("GHL not configured, skipping sync");
    return null;
  }

  console.log("Syncing booking to GHL for:", data.email);

  // Split name into first and last
  const nameParts = data.name.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Search for existing contact by email
  const searchResponse = await fetch(
    `https://services.leadconnectorhq.com/contacts/?locationId=${GHL_LOCATION_ID}&query=${encodeURIComponent(data.email)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        Version: "2021-07-28",
        Accept: "application/json",
      },
    }
  );

  const searchResult = await searchResponse.json();
  console.log("GHL contact search result:", JSON.stringify(searchResult));

  // Base contact payload (locationId only for create, not update)
  const baseContactPayload = {
    firstName,
    lastName,
    email: data.email,
    phone: data.phone || undefined,
    companyName: data.company || undefined,
    customFields: data.message ? [{ key: "message", value: data.message }] : [],
    tags: ["website-booking", "strategic-audit"],
    source: "Episolve Website",
  };

  let contactId: string;

  if (searchResult.contacts && searchResult.contacts.length > 0) {
    // Update existing contact (no locationId in update payload)
    contactId = searchResult.contacts[0].id;
    console.log("Updating existing contact:", contactId);

    const updateResponse = await fetch(
      `https://services.leadconnectorhq.com/contacts/${contactId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(baseContactPayload),
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      console.error("Failed to update GHL contact:", error);
    }
  } else {
    // Create new contact
    console.log("Creating new GHL contact");

    // Add locationId for create requests
    const createPayload = { ...baseContactPayload, locationId: GHL_LOCATION_ID };
    
    const createResponse = await fetch(
      "https://services.leadconnectorhq.com/contacts/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(createPayload),
      }
    );

    const createResult = await createResponse.json();
    
    if (!createResponse.ok) {
      console.error("Failed to create GHL contact:", createResult);
      return null;
    }

    contactId = createResult.contact?.id;
  }

  // Create calendar event if we have a preferred date and calendar ID
  if (data.preferredDate && GHL_CALENDAR_ID && contactId) {
    console.log("Creating GHL calendar event");

    // Use the actual selected date/time from the booking picker
    const startTime = new Date(data.preferredDate);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30-minute slots

    const appointmentPayload = {
      calendarId: GHL_CALENDAR_ID,
      locationId: GHL_LOCATION_ID,
      contactId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      title: `Strategic Audit - ${data.name}`,
      appointmentStatus: "new",
      notes: data.message || "Strategic Audit booking from Episolve website",
    };

    const calendarResponse = await fetch(
      "https://services.leadconnectorhq.com/calendars/events/appointments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(appointmentPayload),
      }
    );

    const calendarResult = await calendarResponse.json();
    console.log("GHL calendar event result:", JSON.stringify(calendarResult));
  }

  return contactId;
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

    // Sync to GHL (non-blocking, don't fail if this fails)
    let ghlContactId: string | null = null;
    try {
      ghlContactId = await syncToGHL({
        name,
        email,
        phone,
        company,
        preferredDate,
        message,
      });
      console.log("GHL sync completed, contact ID:", ghlContactId);
    } catch (ghlError) {
      console.error("GHL sync failed (continuing with email):", ghlError);
    }

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "Episolve <noreply@notify.e-dmm.com>",
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
      from: "Episolve Website <noreply@notify.e-dmm.com>",
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
      JSON.stringify({ 
        success: true, 
        userEmail: userEmailResponse, 
        adminEmail: adminEmailResponse,
        ghlSync: ghlContactId ? true : false,
      }),
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
