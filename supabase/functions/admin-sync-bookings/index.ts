import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GHL_API_KEY = Deno.env.get("GHL_API_KEY");
const GHL_LOCATION_ID = Deno.env.get("GHL_LOCATION_ID");
const GHL_CALENDAR_ID = Deno.env.get("GHL_CALENDAR_ID");

async function syncBookingToGHL(data: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  preferredDate?: string | null;
  message?: string | null;
}) {
  console.log("Syncing booking to GHL:", data.email);

  const nameParts = data.name.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Search for existing contact
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

  const contactPayload = {
    firstName,
    lastName,
    email: data.email,
    phone: data.phone || undefined,
    companyName: data.company || undefined,
    locationId: GHL_LOCATION_ID,
    customFields: [
      ...(data.message ? [{ key: "message", value: data.message }] : []),
    ],
    tags: ["website-booking", "strategic-audit", "manual-sync"],
    source: "Episolve Website",
  };

  let contactId: string;
  let action: string;

  if (searchResult.contacts && searchResult.contacts.length > 0) {
    contactId = searchResult.contacts[0].id;
    action = "updated";

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

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(`Failed to update: ${JSON.stringify(error)}`);
    }
  } else {
    action = "created";

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

    if (!createResponse.ok) {
      throw new Error(`Failed to create: ${JSON.stringify(createResult)}`);
    }

    contactId = createResult.contact?.id;
  }

  // Create calendar event if we have a preferred date and calendar ID
  if (data.preferredDate && GHL_CALENDAR_ID && contactId) {
    console.log("Creating GHL calendar event for booking");

    const startTime = new Date(data.preferredDate);
    startTime.setHours(10, 0, 0, 0);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const appointmentPayload = {
      calendarId: GHL_CALENDAR_ID,
      locationId: GHL_LOCATION_ID,
      contactId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      title: `Strategic Audit - ${data.name}`,
      appointmentStatus: "new",
      notes: data.message || "Strategic Audit booking from Episolve website (manual sync)",
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
    console.log("Calendar event result:", JSON.stringify(calendarResult));
  }

  return { contactId, action, email: data.email };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("admin-sync-bookings function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      throw new Error("GHL integration not configured");
    }

    const body = await req.json();
    const { bookingIds, syncAll, since } = body;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let query = supabase.from("consultation_bookings").select("*");

    if (bookingIds && bookingIds.length > 0) {
      query = query.in("id", bookingIds);
    } else if (since) {
      query = query.gte("created_at", since);
    } else if (syncAll) {
      console.log("Syncing all bookings...");
    } else {
      // Default: sync bookings from today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query = query.gte("created_at", today.toISOString());
    }

    const { data: bookings, error: dbError } = await query.order("created_at", { ascending: true });

    if (dbError) throw dbError;

    console.log(`Found ${bookings?.length || 0} bookings to sync`);

    const results = [];
    const errors = [];

    for (const booking of bookings || []) {
      try {
        const result = await syncBookingToGHL({
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          company: booking.company,
          preferredDate: booking.preferred_date,
          message: booking.message,
        });
        results.push(result);
        console.log(`✓ ${result.action} booking: ${result.email}`);
      } catch (error: any) {
        console.error(`✗ Failed to sync ${booking.email}:`, error.message);
        errors.push({ email: booking.email, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced: results.length,
        failed: errors.length,
        results,
        errors,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in admin-sync-bookings:", error);
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
