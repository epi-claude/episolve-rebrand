import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GHL_API_KEY = Deno.env.get("GHL_API_KEY");
const GHL_LOCATION_ID = Deno.env.get("GHL_LOCATION_ID");

async function syncContactToGHL(data: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  message?: string | null;
}) {
  console.log("Syncing contact to GHL:", data.email);

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
      ...(data.service ? [{ key: "service_interest", value: data.service }] : []),
      ...(data.message ? [{ key: "message", value: data.message }] : []),
    ],
    tags: ["website-contact", "manual-sync", ...(data.service ? [`service-${data.service.toLowerCase().replace(/\s+/g, "-")}`] : [])],
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

  return { contactId, action, email: data.email };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("admin-sync-contacts function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      throw new Error("GHL integration not configured");
    }

    const body = await req.json();
    const { contactIds, syncAll, since } = body;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let query = supabase.from("contact_submissions").select("*");

    if (contactIds && contactIds.length > 0) {
      // Sync specific contacts by ID
      query = query.in("id", contactIds);
    } else if (since) {
      // Sync contacts since a specific date
      query = query.gte("created_at", since);
    } else if (syncAll) {
      // Sync all contacts (be careful with this!)
      console.log("Syncing all contacts...");
    } else {
      // Default: sync contacts from today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query = query.gte("created_at", today.toISOString());
    }

    const { data: contacts, error: dbError } = await query.order("created_at", { ascending: true });

    if (dbError) throw dbError;

    console.log(`Found ${contacts?.length || 0} contacts to sync`);

    const results = [];
    const errors = [];

    for (const contact of contacts || []) {
      try {
        const result = await syncContactToGHL({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          company: contact.company,
          service: contact.service_interest,
          message: contact.message,
        });
        results.push(result);
        console.log(`✓ ${result.action} contact: ${result.email}`);
      } catch (error: any) {
        console.error(`✗ Failed to sync ${contact.email}:`, error.message);
        errors.push({ email: contact.email, error: error.message });
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
    console.error("Error in admin-sync-contacts:", error);
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
