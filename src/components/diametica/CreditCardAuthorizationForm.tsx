import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface CreditCardFormData {
  cardholderName: string;
  cardLastFour: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  authorizedAmount: string;
  authorizationPurpose: string;
  companyName: string;
  printName: string;
}

export function CreditCardAuthorizationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardType, setCardType] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [billingCountry, setBillingCountry] = useState("US");
  const [confirmAccuracy, setConfirmAccuracy] = useState(false);
  const [confirmAuthorize, setConfirmAuthorize] = useState(false);

  const { register, handleSubmit, reset } = useForm<CreditCardFormData>();

  const onSubmit = async (data: CreditCardFormData) => {
    if (!cardType || !expMonth || !expYear) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!confirmAccuracy || !confirmAuthorize) {
      toast.error("Please acknowledge all required checkboxes");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("credit_card_authorizations").insert({
        cardholder_name: data.cardholderName,
        card_type: cardType,
        card_last_four: data.cardLastFour,
        expiration_month: expMonth,
        expiration_year: expYear,
        billing_address: data.billingAddress,
        billing_city: data.billingCity,
        billing_state: data.billingState,
        billing_zip: data.billingZip,
        billing_country: billingCountry,
        authorized_amount: data.authorizedAmount || null,
        authorization_purpose: data.authorizationPurpose || null,
        company_name: data.companyName || null,
        print_name: data.printName,
        authorization_date: format(new Date(), "yyyy-MM-dd"),
      });

      if (error) throw error;
      toast.success("Credit card authorization submitted successfully!");
      reset();
      setCardType("");
      setExpMonth("");
      setExpYear("");
      setConfirmAccuracy(false);
      setConfirmAuthorize(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear + i));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Hero */}
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <CreditCard className="h-12 w-12 text-[#e97316] mx-auto mb-3" />
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">Credit Card Authorization</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Authorize Group To Go to charge your credit card for travel-related expenses.
        </p>
      </div>

      {/* Card Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Card Information</h3>
        <div className="space-y-4">
          <div>
            <Label>Cardholder Name <span className="text-red-500">*</span></Label>
            <Input {...register("cardholderName", { required: true })} placeholder="As it appears on card" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Card Type <span className="text-red-500">*</span></Label>
              <Select value={cardType} onValueChange={setCardType}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["Visa", "Mastercard", "American Express", "Discover"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Last 4 Digits <span className="text-red-500">*</span></Label>
              <Input {...register("cardLastFour", { required: true })} maxLength={4} placeholder="XXXX" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Expiration Month <span className="text-red-500">*</span></Label>
              <Select value={expMonth} onValueChange={setExpMonth}>
                <SelectTrigger><SelectValue placeholder="MM" /></SelectTrigger>
                <SelectContent>
                  {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Expiration Year <span className="text-red-500">*</span></Label>
              <Select value={expYear} onValueChange={setExpYear}>
                <SelectTrigger><SelectValue placeholder="YYYY" /></SelectTrigger>
                <SelectContent>
                  {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Billing Address</h3>
        <div className="space-y-4">
          <div>
            <Label>Street Address <span className="text-red-500">*</span></Label>
            <Input {...register("billingAddress", { required: true })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>City <span className="text-red-500">*</span></Label>
              <Input {...register("billingCity", { required: true })} />
            </div>
            <div>
              <Label>State / Province <span className="text-red-500">*</span></Label>
              <Input {...register("billingState", { required: true })} />
            </div>
            <div>
              <Label>ZIP / Postal Code <span className="text-red-500">*</span></Label>
              <Input {...register("billingZip", { required: true })} />
            </div>
          </div>
          <div>
            <Label>Country</Label>
            <Select value={billingCountry} onValueChange={setBillingCountry}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Authorization Details */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Authorization Details</h3>
        <div className="space-y-4">
          <div>
            <Label>Authorized Amount</Label>
            <Input {...register("authorizedAmount")} placeholder="$0.00" />
          </div>
          <div>
            <Label>Purpose of Authorization</Label>
            <Textarea {...register("authorizationPurpose")} placeholder="e.g., Flight booking for business trip to NYC" />
          </div>
          <div>
            <Label>Company / Organization</Label>
            <Input {...register("companyName")} />
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Legal & Authorization</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Checkbox id="ccConfirmAccuracy" checked={confirmAccuracy} onCheckedChange={(v) => setConfirmAccuracy(v === true)} />
            <label htmlFor="ccConfirmAccuracy" className="text-sm text-gray-700">
              I confirm that all information provided is accurate and I authorize the charges described. <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="ccConfirmAuthorize" checked={confirmAuthorize} onCheckedChange={(v) => setConfirmAuthorize(v === true)} />
            <label htmlFor="ccConfirmAuthorize" className="text-sm text-gray-700">
              I authorize Group To Go Inc. to charge the credit card listed above for authorized travel expenses. <span className="text-red-500">*</span>
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
        {isSubmitting ? "Submitting..." : "Submit Credit Card Authorization"}
      </Button>
    </form>
  );
}
