import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const ContactSyncSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  phone: z.string().max(20).optional(),
  company: z.string().max(100).optional(),
  service: z.string().max(100).optional(),
  message: z.string().max(2000).optional(),
  preferredDate: z.string().optional(),
  isBooking: z.boolean().optional(),
});

const GHL_API_KEY = Deno.env.get("GHL_API_KEY");
const GHL_LOCATION_ID = Deno.env.get("GHL_LOCATION_ID");
const GHL_CALENDAR_ID = Deno.env.get("GHL_CALENDAR_ID");

async function createOrUpdateContact(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
}) {
  console.log("Creating/updating GHL contact for:", data.email);

  // Split name into first and last
  const nameParts = data.name.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // First, search for existing contact by email
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

  const contactPayload = {
    firstName,
    lastName,
    email: data.email,
    phone: data.phone || undefined,
    companyName: data.company || undefined,
    locationId: GHL_LOCATION_ID,
    customFields: [
      ...(data.service ? [{ key: "service_interest", value: data.service }] : []),
      ...(data.message ? [{ key: "message", value: data.message }] : []),
    ],
    tags: ["website-contact", ...(data.service ? [`service-${data.service.toLowerCase().replace(/\s+/g, "-")}`] : [])],
    source: "Episolve Website",
  };

  let contactId: string;

  if (searchResult.contacts && searchResult.contacts.length > 0) {
    // Update existing contact
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
        body: JSON.stringify(contactPayload),
      }
    );

    const updateResult = await updateResponse.json();
    console.log("GHL contact update result:", JSON.stringify(updateResult));

    if (!updateResponse.ok) {
      throw new Error(`Failed to update contact: ${JSON.stringify(updateResult)}`);
    }
  } else {
    // Create new contact
    console.log("Creating new contact");

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
        body: JSON.stringify(contactPayload),
      }
    );

    const createResult = await createResponse.json();
    console.log("GHL contact create result:", JSON.stringify(createResult));

    if (!createResponse.ok) {
      throw new Error(`Failed to create contact: ${JSON.stringify(createResult)}`);
    }

    contactId = createResult.contact?.id;
  }

  return contactId;
}

async function createCalendarEvent(contactId: string, data: {
  name: string;
  email: string;
  phone?: string;
  preferredDate: string;
  message?: string;
}) {
  console.log("Creating GHL calendar event for contact:", contactId);

  // Parse the preferred date and set a 1-hour appointment
  const startTime = new Date(data.preferredDate);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

  const appointmentPayload = {
    calendarId: GHL_CALENDAR_ID,
    locationId: GHL_LOCATION_ID,
    contactId,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    title: `Consultation with ${data.name}`,
    appointmentStatus: "new",
    assignedUserId: undefined,
    notes: data.message || "Consultation booking from Episolve website",
  };

  console.log("Appointment payload:", JSON.stringify(appointmentPayload));

  const response = await fetch(
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

  const result = await response.json();
  console.log("GHL calendar event result:", JSON.stringify(result));

  if (!response.ok) {
    throw new Error(`Failed to create calendar event: ${JSON.stringify(result)}`);
  }

  return result;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("ghl-contact-sync function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      console.error("Missing required GHL environment variables");
      throw new Error("GHL integration not configured");
    }

    const body = await req.json();
    console.log("Received request body:", JSON.stringify(body));

    // Validate input
    const parseResult = ContactSyncSchema.safeParse(body);
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

    const data = parseResult.data;

    // Create or update contact
    const contactId = await createOrUpdateContact({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.service,
      message: data.message,
    });

    let calendarEvent = null;

    // If this is a booking and we have a preferred date, create calendar event
    if (data.isBooking && data.preferredDate && GHL_CALENDAR_ID) {
      calendarEvent = await createCalendarEvent(contactId, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredDate: data.preferredDate,
        message: data.message,
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        contactId,
        calendarEvent: calendarEvent ? true : false,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in ghl-contact-sync function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
