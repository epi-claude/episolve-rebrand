import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface TravelProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportNumber: string;
  passportCountry: string;
  knownTravelerNumber: string;
  redressNumber: string;
  tsaPrecheck: string;
  globalEntry: string;
  frequentFlyerPrograms: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  medicalConditions: string;
  specialAssistance: string;
}

export function TravelProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [passportExpiry, setPassportExpiry] = useState<Date>();
  const [gender, setGender] = useState("");
  const [seatPreference, setSeatPreference] = useState("");
  const [mealPreference, setMealPreference] = useState("");

  const { register, handleSubmit, reset } = useForm<TravelProfileFormData>();

  const onSubmit = async (data: TravelProfileFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("travel_profiles").insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone || null,
        date_of_birth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : null,
        gender: gender || null,
        passport_number: data.passportNumber || null,
        passport_expiry: passportExpiry ? format(passportExpiry, "yyyy-MM-dd") : null,
        passport_country: data.passportCountry || null,
        known_traveler_number: data.knownTravelerNumber || null,
        redress_number: data.redressNumber || null,
        tsa_precheck: data.tsaPrecheck || null,
        global_entry: data.globalEntry || null,
        seat_preference: seatPreference || null,
        meal_preference: mealPreference || null,
        frequent_flyer_programs: data.frequentFlyerPrograms || null,
        emergency_contact_name: data.emergencyContactName || null,
        emergency_contact_phone: data.emergencyContactPhone || null,
        emergency_contact_relationship: data.emergencyContactRelationship || null,
        medical_conditions: data.medicalConditions || null,
        special_assistance: data.specialAssistance || null,
      });

      if (error) throw error;
      toast.success("Travel profile submitted successfully!");
      reset();
      setDateOfBirth(undefined);
      setPassportExpiry(undefined);
      setGender("");
      setSeatPreference("");
      setMealPreference("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Hero */}
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <User className="h-12 w-12 text-[#e97316] mx-auto mb-3" />
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">Travel Profile</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Save your travel preferences and identification details for faster booking.
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Personal Information</h3>
        <div className="space-y-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input type="email" {...register("email", { required: true })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input type="tel" {...register("phone")} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateOfBirth ? format(dateOfBirth, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateOfBirth} onSelect={setDateOfBirth} captionLayout="dropdown-buttons" fromYear={1940} toYear={2010} />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["Male", "Female", "Non-binary", "Prefer not to say"].map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Documents */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Travel Documents</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Passport Number</Label>
              <Input {...register("passportNumber")} />
            </div>
            <div>
              <Label>Passport Expiry</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {passportExpiry ? format(passportExpiry, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={passportExpiry} onSelect={setPassportExpiry} /></PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <Label>Passport Country</Label>
            <Input {...register("passportCountry")} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Known Traveler Number</Label>
              <Input {...register("knownTravelerNumber")} />
            </div>
            <div>
              <Label>Redress Number</Label>
              <Input {...register("redressNumber")} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>TSA PreCheck</Label>
              <Input {...register("tsaPrecheck")} />
            </div>
            <div>
              <Label>Global Entry</Label>
              <Input {...register("globalEntry")} />
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Travel Preferences</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Seat Preference</Label>
              <Select value={seatPreference} onValueChange={setSeatPreference}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["Window", "Middle", "Aisle", "No preference"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Meal Preference</Label>
              <Select value={mealPreference} onValueChange={setMealPreference}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["Regular", "Vegetarian", "Vegan", "Kosher", "Halal", "Gluten-free", "No preference"].map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Frequent Flyer Programs</Label>
            <Textarea {...register("frequentFlyerPrograms")} placeholder="e.g., Delta SkyMiles #12345, United MileagePlus #67890" />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Emergency Contact</h3>
        <div className="space-y-4">
          <div>
            <Label>Contact Name</Label>
            <Input {...register("emergencyContactName")} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Contact Phone</Label>
              <Input type="tel" {...register("emergencyContactPhone")} />
            </div>
            <div>
              <Label>Relationship</Label>
              <Input {...register("emergencyContactRelationship")} />
            </div>
          </div>
        </div>
      </div>

      {/* Medical / Accessibility */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Medical & Accessibility</h3>
        <div className="space-y-4">
          <div>
            <Label>Medical Conditions</Label>
            <Textarea {...register("medicalConditions")} placeholder="Any conditions the airline should be aware of" />
          </div>
          <div>
            <Label>Special Assistance</Label>
            <Textarea {...register("specialAssistance")} placeholder="Wheelchair, hearing assistance, etc." />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#e97316] hover:bg-[#d96a14] text-white font-semibold py-3 text-base"
      >
        {isSubmitting ? "Submitting..." : "Save Travel Profile"}
      </Button>
    </form>
  );
}
