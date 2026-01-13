import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  RefreshCw, 
  Mail, 
  Phone, 
  Building2, 
  MessageSquare,
  ExternalLink,
  Search
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

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  message: string | null;
  created_at: string;
}

export function ContactsTable() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-get-data", {
        body: { table: "contact_submissions", limit: 100 },
      });

      if (error) throw error;
      setContacts(data?.data || []);
    } catch (error: any) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) => {
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      (contact.company?.toLowerCase().includes(query) ?? false) ||
      (contact.service_interest?.toLowerCase().includes(query) ?? false)
    );
  });

  const getServiceBadgeColor = (service: string | null) => {
    if (!service) return "secondary";
    switch (service.toLowerCase()) {
      case "cybersecurity":
        return "destructive";
      case "managed-it":
        return "default";
      case "it-consulting":
        return "secondary";
      case "integration":
        return "outline";
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
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchContacts}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Service Interest</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[80px]">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading contacts...
                </TableCell>
              </TableRow>
            ) : filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No contacts found
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <a 
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </a>
                      {contact.phone && (
                        <a 
                          href={`tel:${contact.phone}`}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {contact.company && (
                      <span className="flex items-center gap-1 text-sm">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        {contact.company}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.service_interest && (
                      <Badge variant={getServiceBadgeColor(contact.service_interest)}>
                        {contact.service_interest}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(contact.created_at), "MMM d, yyyy")}
                    <br />
                    <span className="text-xs">
                      {format(new Date(contact.created_at), "h:mm a")}
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
                          <DialogTitle>{contact.name}</DialogTitle>
                          <DialogDescription>
                            Submitted {format(new Date(contact.created_at), "MMMM d, yyyy 'at' h:mm a")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
                              <p className="text-sm font-medium">{contact.email}</p>
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground uppercase tracking-wider">Phone</label>
                              <p className="text-sm font-medium">{contact.phone || "—"}</p>
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground uppercase tracking-wider">Company</label>
                              <p className="text-sm font-medium">{contact.company || "—"}</p>
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground uppercase tracking-wider">Service Interest</label>
                              <p className="text-sm font-medium">{contact.service_interest || "—"}</p>
                            </div>
                          </div>
                          {contact.message && (
                            <div>
                              <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                Message
                              </label>
                              <p className="text-sm mt-1 p-3 bg-muted rounded-lg whitespace-pre-wrap">
                                {contact.message}
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
        Showing {filteredContacts.length} of {contacts.length} contacts
      </p>
    </div>
  );
}
