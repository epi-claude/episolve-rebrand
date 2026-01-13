import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  RefreshCw, 
  Mail,
  Phone,
  Building2,
  Calendar,
  Search,
  ExternalLink,
  MessageSquare,
  Upload,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  results: Array<{ email: string; action: string; contactId: string }>;
  errors: Array<{ email: string; error: string }>;
}

interface ConsultationBooking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  preferred_date: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export function BookingsTable() {
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-get-data", {
        body: { table: "consultation_bookings", limit: 100 },
      });

      if (error) throw error;
      setBookings(data?.data || []);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSyncAllToGHL = async () => {
    if (!confirm("Sync all bookings to GHL? This will create contacts and calendar events for all existing bookings.")) {
      return;
    }
    
    setIsSyncing(true);
    setSyncResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("admin-sync-bookings", {
        body: { syncAll: true },
      });

      if (error) throw error;

      setSyncResult(data);
      
      if (data.synced > 0) {
        toast.success(`Successfully synced ${data.synced} booking(s) to GHL`);
      } else {
        toast.info("No bookings found to sync");
      }
      
      if (data.failed > 0) {
        toast.error(`Failed to sync ${data.failed} booking(s)`);
      }
    } catch (error: any) {
      console.error("Sync error:", error);
      toast.error(error.message || "Sync failed");
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const query = searchQuery.toLowerCase();
    return (
      booking.name.toLowerCase().includes(query) ||
      booking.email.toLowerCase().includes(query) ||
      (booking.company?.toLowerCase().includes(query) ?? false)
    );
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "default";
      case "cancelled":
        return "destructive";
      case "pending":
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncAllToGHL}
            disabled={isSyncing || bookings.length === 0}
          >
            <Upload className={`h-4 w-4 mr-2 ${isSyncing ? "animate-pulse" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync All to GHL"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBookings}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Sync Results */}
      {syncResult && (
        <div className={`p-4 rounded-lg border ${syncResult.failed > 0 ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'}`}>
          <div className="flex items-center gap-2 mb-2">
            {syncResult.failed === 0 ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <span className="font-medium">
              {syncResult.synced} synced, {syncResult.failed} failed
            </span>
          </div>
          {syncResult.results.length > 0 && (
            <div className="text-sm text-green-700 dark:text-green-400">
              {syncResult.results.map((r, i) => (
                <div key={i}>✓ {r.email} ({r.action})</div>
              ))}
            </div>
          )}
          {syncResult.errors.length > 0 && (
            <div className="text-sm text-red-600 dark:text-red-400 mt-2">
              {syncResult.errors.map((e, i) => (
                <div key={i}>✗ {e.email}: {e.error}</div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Preferred Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="w-[80px]">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Loading bookings...
                </TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <a 
                        href={`mailto:${booking.email}`}
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Mail className="h-3 w-3" />
                        {booking.email}
                      </a>
                      {booking.phone && (
                        <a 
                          href={`tel:${booking.phone}`}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <Phone className="h-3 w-3" />
                          {booking.phone}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.company && (
                      <span className="flex items-center gap-1 text-sm">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        {booking.company}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {booking.preferred_date ? (
                      <span className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(booking.preferred_date), "MMM d, yyyy")}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(booking.created_at), "MMM d, yyyy")}
                    <br />
                    <span className="text-xs">
                      {format(new Date(booking.created_at), "h:mm a")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>{booking.name}</DialogTitle>
                          <DialogDescription>
                            Submitted {format(new Date(booking.created_at), "MMMM d, yyyy 'at' h:mm a")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
                              <p className="text-sm font-medium">{booking.email}</p>
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground uppercase tracking-wider">Phone</label>
                              <p className="text-sm font-medium">{booking.phone || "—"}</p>
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground uppercase tracking-wider">Company</label>
                              <p className="text-sm font-medium">{booking.company || "—"}</p>
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground uppercase tracking-wider">Status</label>
                              <p className="text-sm font-medium capitalize">{booking.status}</p>
                            </div>
                            <div className="col-span-2">
                              <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Preferred Date
                              </label>
                              <p className="text-sm font-medium">
                                {booking.preferred_date 
                                  ? format(new Date(booking.preferred_date), "MMMM d, yyyy")
                                  : "Not specified"
                                }
                              </p>
                            </div>
                          </div>
                          {booking.message && (
                            <div>
                              <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                Message
                              </label>
                              <p className="text-sm mt-1 p-3 bg-muted rounded-lg whitespace-pre-wrap">
                                {booking.message}
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground text-right">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </p>
    </div>
  );
}
