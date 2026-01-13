import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  RefreshCw, 
  Mail,
  Search,
  UserCheck,
  UserX
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export function NewsletterTable() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-get-data", {
        body: { table: "newsletter_subscribers", limit: 100 },
      });

      if (error) throw error;
      setSubscribers(data?.data || []);
    } catch (error: any) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to load subscribers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = subscribers.filter(s => !s.unsubscribed_at).length;
  const unsubscribedCount = subscribers.filter(s => s.unsubscribed_at).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="gap-1">
              <UserCheck className="h-3 w-3" />
              {activeCount} active
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <UserX className="h-3 w-3" />
              {unsubscribedCount} unsubscribed
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSubscribers}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscribed Date</TableHead>
              <TableHead>Unsubscribed Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Loading subscribers...
                </TableCell>
              </TableRow>
            ) : filteredSubscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell>
                    <a 
                      href={`mailto:${subscriber.email}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {subscriber.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    {subscriber.unsubscribed_at ? (
                      <Badge variant="secondary" className="gap-1">
                        <UserX className="h-3 w-3" />
                        Unsubscribed
                      </Badge>
                    ) : (
                      <Badge variant="default" className="gap-1">
                        <UserCheck className="h-3 w-3" />
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(subscriber.subscribed_at), "MMM d, yyyy")}
                    <br />
                    <span className="text-xs">
                      {format(new Date(subscriber.subscribed_at), "h:mm a")}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {subscriber.unsubscribed_at ? (
                      <>
                        {format(new Date(subscriber.unsubscribed_at), "MMM d, yyyy")}
                        <br />
                        <span className="text-xs">
                          {format(new Date(subscriber.unsubscribed_at), "h:mm a")}
                        </span>
                      </>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground text-right">
        Showing {filteredSubscribers.length} of {subscribers.length} subscribers
      </p>
    </div>
  );
}
