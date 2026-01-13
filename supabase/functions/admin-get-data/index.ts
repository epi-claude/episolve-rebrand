import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("admin-get-data function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create admin client that bypasses RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { table, limit = 100 } = await req.json();
    console.log("Fetching from table:", table, "limit:", limit);

    // Validate table name to prevent injection
    const allowedTables = ["contact_submissions", "newsletter_subscribers", "consultation_bookings"];
    if (!allowedTables.includes(table)) {
      console.error("Invalid table requested:", table);
      return new Response(
        JSON.stringify({ error: "Invalid table" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let query = supabaseAdmin.from(table).select("*");

    // Apply appropriate ordering based on table
    if (table === "contact_submissions") {
      query = query.order("created_at", { ascending: false });
    } else if (table === "newsletter_subscribers") {
      query = query.order("subscribed_at", { ascending: false });
    } else if (table === "consultation_bookings") {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      console.error("Database query error:", error);
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} records from ${table}`);

    return new Response(
      JSON.stringify({ data }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in admin-get-data function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
