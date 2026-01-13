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
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create a client with the user's token to verify their identity
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the user from the token
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      console.error("Error getting user:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Authenticated user:", user.email);

    // Check if user has admin role using service role client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      console.error("User is not an admin:", user.email);
      return new Response(
        JSON.stringify({ error: "Forbidden - Admin access required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Admin access verified for:", user.email);

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
