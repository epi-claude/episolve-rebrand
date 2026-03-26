import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plane, CalendarIcon, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { airports, airlines } from "@/data/airports";

interface FlightFormData {
  firstName: string;
  lastName: string;
  departureAirport: string;
  destinationAirport: string;
  departureDate: Date;
  returnDate?: Date;
  numTravelers: string;
  cabinClass: string;
  preferredAirlineText: string;
  preferredAirlineSelect: string;
  specificFlightNumbers: string;
  flexibleDates: boolean;
  budgetPerPerson: string;
  specialRequests: string;
  companyName: string;
  department: string;
  tripPurpose: string;
  travelPolicyLink: string;
  approvedBy: string;
  printName: string;
  confirmAccuracy: boolean;
  confirmNonRefundable: boolean;
}

export function FlightAuthorizationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [departureAirport, setDepartureAirport] = useState("");
  const [destinationAirport, setDestinationAirport] = useState("");
  const [numTravelers, setNumTravelers] = useState("");
  const [cabinClass, setCabinClass] = useState("");
  const [preferredAirlineSelect, setPreferredAirlineSelect] = useState("");
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [confirmAccuracy, setConfirmAccuracy] = useState(false);
  const [confirmNonRefundable, setConfirmNonRefundable] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FlightFormData>();

  const onSubmit = async (data: FlightFormData) => {
    if (!departureDate || !departureAirport || !destinationAirport || !numTravelers || !cabinClass) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!confirmAccuracy || !confirmNonRefundable) {
      toast.error("Please acknowledge all required checkboxes");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("flight_authorizations").insert({
        first_name: data.firstName,
        last_name: data.lastName,
        departure_airport: departureAirport,
        destination_airport: destinationAirport,
        departure_date: format(departureDate, "yyyy-MM-dd"),
        return_date: returnDate ? format(returnDate, "yyyy-MM-dd") : null,
        num_travelers: numTravelers,
        cabin_class: cabinClass,
        preferred_airline: preferredAirlineSelect || data.preferredAirlineText || null,
        specific_flight_numbers: data.specificFlightNumbers || null,
        flexible_dates: flexibleDates,
        budget_per_person: data.budgetPerPerson || null,
        special_requests: data.specialRequests || null,
        company_name: data.companyName || null,
        department: data.department || null,
        trip_purpose: data.tripPurpose || null,
        travel_policy_link: data.travelPolicyLink || null,
        approved_by: data.approvedBy || null,
        print_name: data.printName,
        authorization_date: format(new Date(), "yyyy-MM-dd"),
      });

      if (error) throw error;
      toast.success("Flight booking request submitted successfully!");
      reset();
      setDepartureDate(undefined);
      setReturnDate(undefined);
      setDepartureAirport("");
      setDestinationAirport("");
      setNumTravelers("");
      setCabinClass("");
      setPreferredAirlineSelect("");
      setFlexibleDates(false);
      setConfirmAccuracy(false);
      setConfirmNonRefundable(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Hero */}
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Plane className="h-12 w-12 text-[#e97316] mx-auto mb-3" />
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">Flight Authorization</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Submit your specific flight booking request below. Group To Go will review and process your request.
        </p>
      </div>

      {/* Identification */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Identification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>First Name <span className="text-red-500">*</span></Label>
            <Input {...register("firstName", { required: true })} />
          </div>
          <div>
            <Label>Last Name <span className="text-red-500">*</span></Label>
            <Input {...register("lastName", { required: true })} />
          </div>
        </div>
      </div>

      {/* Flight Details */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Flight Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Departure City / Airport <span className="text-red-500">*</span></Label>
              <Select value={departureAirport} onValueChange={setDepartureAirport}>
                <SelectTrigger><SelectValue placeholder="Select airport" /></SelectTrigger>
                <SelectContent>
                  {airports.map(a => (
                    <SelectItem key={a.code} value={a.code}>{a.code} – {a.name}</SelectItem>
                  ))}
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Destination City / Airport <span className="text-red-500">*</span></Label>
              <Select value={destinationAirport} onValueChange={setDestinationAirport}>
                <SelectTrigger><SelectValue placeholder="Select airport" /></SelectTrigger>
                <SelectContent>
                  {airports.map(a => (
                    <SelectItem key={a.code} value={a.code}>{a.code} – {a.name}</SelectItem>
                  ))}
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Departure Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={departureDate} onSelect={setDepartureDate} /></PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Return Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? format(returnDate, "PPP") : "Select date (one-way if blank)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={returnDate} onSelect={setReturnDate} /></PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Number of Travelers <span className="text-red-500">*</span></Label>
              <Select value={numTravelers} onValueChange={setNumTravelers}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["1","2","3","4","5+","Group"].map(n => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cabin Class <span className="text-red-500">*</span></Label>
              <Select value={cabinClass} onValueChange={setCabinClass}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["Economy","Premium Economy","Business","First"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Preferred Airline(s)</Label>
            <Input {...register("preferredAirlineText")} placeholder="e.g., Delta, United, or select below" />
            <Select value={preferredAirlineSelect} onValueChange={setPreferredAirlineSelect}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Or select an airline" /></SelectTrigger>
              <SelectContent>
                {airlines.map(a => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Specific Flight Numbers</Label>
            <Textarea {...register("specificFlightNumbers")} placeholder="e.g., AA123 / DL456 (optional)" />
          </div>

          <div>
            <Label>Flexible Dates?</Label>
            <Select value={flexibleDates ? "Yes" : "No"} onValueChange={(v) => setFlexibleDates(v === "Yes")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Budget Per Person</Label>
            <Input {...register("budgetPerPerson")} placeholder="" />
          </div>

          <div>
            <Label>Special Requests</Label>
            <Textarea {...register("specialRequests")} />
          </div>
        </div>
      </div>

      {/* Company / Trip Context */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Company / Trip Context</h3>
        <div className="space-y-4">
          <div>
            <Label>Company / Organization Name</Label>
            <Input {...register("companyName")} />
          </div>
          <div>
            <Label>Department / Division</Label>
            <Input {...register("department")} />
          </div>
          <div>
            <Label>Trip Purpose</Label>
            <Input {...register("tripPurpose")} />
          </div>
          <div>
            <Label>Travel Policy Link</Label>
            <Input {...register("travelPolicyLink")} />
          </div>
          <div>
            <Label>Approved By</Label>
            <Input {...register("approvedBy")} />
          </div>
        </div>
      </div>

      {/* Supporting Documents */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Supporting Documents</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Click or drag files here to upload</p>
          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOCX — max 10MB each</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Upload approval emails, itineraries, or other supporting documents (optional).
        </p>
      </div>

      {/* Legal & Authorization */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Legal & Authorization</h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            I authorize Group To Go Inc. to use the information provided to book flights and travel services on my behalf. 
            I understand that airlines, governments, and security authorities may require this information for ticketing and security-clearance purposes.
          </p>

          <div className="flex items-start gap-2">
            <Checkbox
              id="confirmAccuracy"
              checked={confirmAccuracy}
              onCheckedChange={(v) => setConfirmAccuracy(v === true)}
            />
            <label htmlFor="confirmAccuracy" className="text-sm text-gray-700">
              I confirm that all information provided is true, accurate, and current to the best of my knowledge. <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="confirmNonRefundable"
              checked={confirmNonRefundable}
              onCheckedChange={(v) => setConfirmNonRefundable(v === true)}
            />
            <label htmlFor="confirmNonRefundable" className="text-sm text-gray-700">
              I acknowledge that many fares are non-refundable or subject to change fees, and that schedules may change without notice. <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name (Print)</Label>
              <Input {...register("printName", { required: true })} />
            </div>
            <div>
              <Label>Signature</Label>
              <div className="border rounded-md h-10 bg-gray-50 flex items-center px-3 text-sm text-gray-400 italic">
                Digital signature
              </div>
            </div>
          </div>

          <div>
            <Label>Date</Label>
            <Input value={format(new Date(), "MMMM do, yyyy")} disabled />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#e97316] hover:bg-[#d96a14] text-white font-semibold py-3 text-base"
      >
        {isSubmitting ? "Submitting..." : "Submit Flight Booking Request"}
      </Button>
    </form>
  );
}
