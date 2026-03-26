import { DiameticaLayout } from "@/components/diametica/DiameticaLayout";
import { FlightAuthorizationForm } from "@/components/diametica/FlightAuthorizationForm";
import { CreditCardAuthorizationForm } from "@/components/diametica/CreditCardAuthorizationForm";
import { TravelProfileForm } from "@/components/diametica/TravelProfileForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plane, CreditCard, User } from "lucide-react";

export default function Diametica() {
  return (
    <DiameticaLayout>
      <Tabs defaultValue="flight" className="w-full">
        <TabsList className="w-full bg-white border-b border-gray-200 rounded-none h-auto p-0 justify-start">
          <TabsTrigger
            value="flight"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#e97316] data-[state=active]:text-[#e97316] data-[state=active]:shadow-none px-6 py-3 gap-2"
          >
            <Plane className="h-4 w-4" />
            Flight Authorization
          </TabsTrigger>
          <TabsTrigger
            value="creditcard"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#e97316] data-[state=active]:text-[#e97316] data-[state=active]:shadow-none px-6 py-3 gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Credit Card Authorization
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#e97316] data-[state=active]:text-[#e97316] data-[state=active]:shadow-none px-6 py-3 gap-2"
          >
            <User className="h-4 w-4" />
            Travel Profile
          </TabsTrigger>
        </TabsList>

        <div className="p-6">
          <TabsContent value="flight" className="mt-0">
            <FlightAuthorizationForm />
          </TabsContent>
          <TabsContent value="creditcard" className="mt-0">
            <CreditCardAuthorizationForm />
          </TabsContent>
          <TabsContent value="profile" className="mt-0">
            <TravelProfileForm />
          </TabsContent>
        </div>
      </Tabs>
    </DiameticaLayout>
  );
}
