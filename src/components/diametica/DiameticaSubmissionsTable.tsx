import { useState, useEffect } from "react";
import { Loader2, Plane, CreditCard, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function DiameticaSubmissionsTable() {
  const [flights, setFlights] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [f, c, p] = await Promise.all([
        supabase.from("flight_authorizations").select("*").order("created_at", { ascending: false }),
        supabase.from("credit_card_authorizations").select("*").order("created_at", { ascending: false }),
        supabase.from("travel_profiles").select("*").order("created_at", { ascending: false }),
      ]);
      setFlights(f.data || []);
      setCards(c.data || []);
      setProfiles(p.data || []);
    } catch (err: any) {
      toast.error("Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={fetchAll}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      <Tabs defaultValue="flights">
        <TabsList>
          <TabsTrigger value="flights" className="gap-2">
            <Plane className="h-4 w-4" /> Flights ({flights.length})
          </TabsTrigger>
          <TabsTrigger value="cards" className="gap-2">
            <CreditCard className="h-4 w-4" /> Credit Cards ({cards.length})
          </TabsTrigger>
          <TabsTrigger value="profiles" className="gap-2">
            <User className="h-4 w-4" /> Profiles ({profiles.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flights">
          {flights.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No flight authorizations yet</p>
          ) : (
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Cabin</TableHead>
                    <TableHead>Travelers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flights.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.first_name} {f.last_name}</TableCell>
                      <TableCell>{f.departure_airport} → {f.destination_airport}</TableCell>
                      <TableCell>{fmt(f.departure_date)}</TableCell>
                      <TableCell className="capitalize">{f.cabin_class}</TableCell>
                      <TableCell>{f.num_travelers}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {f.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">{fmt(f.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cards">
          {cards.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No credit card authorizations yet</p>
          ) : (
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cardholder</TableHead>
                    <TableHead>Card</TableHead>
                    <TableHead>Last 4</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cards.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.cardholder_name}</TableCell>
                      <TableCell className="capitalize">{c.card_type}</TableCell>
                      <TableCell>****{c.card_last_four}</TableCell>
                      <TableCell>{c.authorized_amount || "—"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{c.authorization_purpose || "—"}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {c.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">{fmt(c.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="profiles">
          {profiles.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No travel profiles yet</p>
          ) : (
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Passport</TableHead>
                    <TableHead>Seat Pref</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.first_name} {p.last_name}</TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell>{p.phone || "—"}</TableCell>
                      <TableCell>{p.passport_country || "—"}</TableCell>
                      <TableCell className="capitalize">{p.seat_preference || "—"}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {p.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">{fmt(p.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
