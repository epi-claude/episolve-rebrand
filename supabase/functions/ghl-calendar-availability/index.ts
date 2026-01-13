import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const AvailabilityRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const GHL_API_KEY = Deno.env.get("GHL_API_KEY");
const GHL_LOCATION_ID = Deno.env.get("GHL_LOCATION_ID");
const GHL_CALENDAR_ID = Deno.env.get("GHL_CALENDAR_ID");

// Define available time slots (10:00 AM - 3:00 PM in 30-min intervals)
const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00"
];

async function getGHLAppointments(startDate: string, endDate: string) {
  console.log(`Fetching GHL appointments from ${startDate} to ${endDate}`);

  const url = new URL("https://services.leadconnectorhq.com/calendars/events");
  url.searchParams.set("locationId", GHL_LOCATION_ID!);
  url.searchParams.set("calendarId", GHL_CALENDAR_ID!);
  url.searchParams.set("startTime", startDate);
  url.searchParams.set("endTime", endDate);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${GHL_API_KEY}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("GHL API error:", error);
    throw new Error(`Failed to fetch GHL appointments: ${response.status}`);
  }

  const result = await response.json();
  console.log("GHL appointments result:", JSON.stringify(result));
  return result;
}

function extractBookedSlots(appointments: any[], targetDate: string): string[] {
  const bookedSlots: string[] = [];

  if (!appointments || !Array.isArray(appointments)) {
    return bookedSlots;
  }

  for (const appt of appointments) {
    if (!appt.startTime) continue;

    const startTime = new Date(appt.startTime);
    const apptDate = startTime.toISOString().split("T")[0];

    // Only process appointments for the target date
    if (apptDate !== targetDate) continue;

    // Extract the time in HH:MM format
    const hours = startTime.getUTCHours().toString().padStart(2, "0");
    const minutes = startTime.getUTCMinutes().toString().padStart(2, "0");
    const timeSlot = `${hours}:${minutes}`;

    if (TIME_SLOTS.includes(timeSlot)) {
      bookedSlots.push(timeSlot);
    }

    // Also check if appointment spans multiple slots (e.g., 1-hour appointments)
    if (appt.endTime) {
      const endTime = new Date(appt.endTime);
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMins = durationMs / (1000 * 60);

      // If appointment is longer than 30 mins, block additional slots
      if (durationMins > 30) {
        const slotsToBlock = Math.ceil(durationMins / 30);
        for (let i = 1; i < slotsToBlock; i++) {
          const nextSlotTime = new Date(startTime.getTime() + i * 30 * 60 * 1000);
          const nextHours = nextSlotTime.getUTCHours().toString().padStart(2, "0");
          const nextMinutes = nextSlotTime.getUTCMinutes().toString().padStart(2, "0");
          const nextTimeSlot = `${nextHours}:${nextMinutes}`;
          
          if (TIME_SLOTS.includes(nextTimeSlot) && !bookedSlots.includes(nextTimeSlot)) {
            bookedSlots.push(nextTimeSlot);
          }
        }
      }
    }
  }

  return bookedSlots;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("ghl-calendar-availability function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GHL_API_KEY || !GHL_LOCATION_ID || !GHL_CALENDAR_ID) {
      console.error("Missing required GHL environment variables");
      throw new Error("GHL calendar integration not configured");
    }

    const body = await req.json();
    console.log("Received request body:", JSON.stringify(body));

    const parseResult = AvailabilityRequestSchema.safeParse(body);
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

    const { date } = parseResult.data;

    // Create start and end times for the full day in UTC
    const startOfDay = `${date}T00:00:00Z`;
    const endOfDay = `${date}T23:59:59Z`;

    // Fetch appointments from GHL
    const ghlResult = await getGHLAppointments(startOfDay, endOfDay);
    
    // Extract booked time slots
    const bookedSlots = extractBookedSlots(ghlResult.events || ghlResult.appointments || [], date);

    // Determine available slots
    const availableSlots = TIME_SLOTS.filter(slot => !bookedSlots.includes(slot));

    console.log(`Date: ${date}, Booked: ${bookedSlots.join(", ")}, Available: ${availableSlots.length} slots`);

    return new Response(
      JSON.stringify({
        success: true,
        date,
        bookedSlots,
        availableSlots,
        allSlots: TIME_SLOTS,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in ghl-calendar-availability:", error);
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
