import { useState, useEffect } from "react";
import { UserPlus, UserMinus, Shield, Loader2, History, ShieldPlus, ShieldMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface AdminUser {
  user_id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

interface AuditLogEntry {
  id: string;
  action: string;
  target_user_id: string;
  target_email: string;
  performed_by_user_id: string;
  performed_by_email: string;
  details: unknown;
  created_at: string;
}

export function AdminUserManagement() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_admin_users");
      
      if (error) throw error;
      
      setAdmins(data || []);
    } catch (error: any) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to fetch admin users");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const { data, error } = await supabase.rpc("get_admin_audit_logs", { limit_count: 50 });
      
      if (error) throw error;
      
      setAuditLogs(data || []);
    } catch (error: any) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchAuditLogs();
  }, []);

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setIsAdding(true);
    try {
      const { data, error } = await supabase.rpc("add_admin_user", {
        target_email: newAdminEmail.trim().toLowerCase(),
      });

      if (error) throw error;

      const result = data as { success: boolean; message: string };
      
      if (result.success) {
        toast.success(result.message);
        setNewAdminEmail("");
        fetchAdmins();
        fetchAuditLogs();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Error adding admin:", error);
      toast.error(error.message || "Failed to add admin");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveAdmin = async (targetUserId: string) => {
    setIsRemoving(targetUserId);
    try {
      const { data, error } = await supabase.rpc("remove_admin_user", {
        target_user_id: targetUserId,
      });

      if (error) throw error;

      const result = data as { success: boolean; message: string };
      
      if (result.success) {
        toast.success(result.message);
        fetchAdmins();
        fetchAuditLogs();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Error removing admin:", error);
      toast.error(error.message || "Failed to remove admin");
    } finally {
      setIsRemoving(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "admin_granted":
        return { label: "Admin Granted", icon: ShieldPlus, className: "text-green-600" };
      case "admin_revoked":
        return { label: "Admin Revoked", icon: ShieldMinus, className: "text-red-600" };
      default:
        return { label: action, icon: History, className: "text-muted-foreground" };
    }
  };

  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList>
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Admin Users
        </TabsTrigger>
        <TabsTrigger value="audit" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Audit Log
        </TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-6">
        {/* Add Admin Form */}
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="new-admin-email">Add Admin by Email</Label>
            <Input
              id="new-admin-email"
              type="email"
              placeholder="user@example.com"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddAdmin()}
            />
            <p className="text-xs text-muted-foreground">
              The user must have signed up first before they can be made an admin.
            </p>
          </div>
          <Button onClick={handleAddAdmin} disabled={isAdding || !newAdminEmail.trim()}>
            {isAdding ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )}
            Add Admin
          </Button>
        </div>

        {/* Admin Users Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No admin users found</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.user_id}>
                    <TableCell className="font-medium">{admin.email}</TableCell>
                    <TableCell>{admin.full_name || "—"}</TableCell>
                    <TableCell>{formatDate(admin.created_at)}</TableCell>
                    <TableCell>
                      {admin.user_id === user?.id ? (
                        <span className="text-xs text-muted-foreground">You</span>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              disabled={isRemoving === admin.user_id}
                            >
                              {isRemoving === admin.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserMinus className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Admin Access</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove admin access for{" "}
                                <strong>{admin.email}</strong>? They will no longer be
                                able to access the admin dashboard.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveAdmin(admin.user_id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove Access
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      <TabsContent value="audit" className="space-y-4">
        {isLoadingLogs ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No audit log entries yet</p>
            <p className="text-sm">Changes to admin access will appear here</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Target User</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => {
                  const actionInfo = getActionLabel(log.action);
                  const ActionIcon = actionInfo.icon;
                  return (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className={`flex items-center gap-2 ${actionInfo.className}`}>
                          <ActionIcon className="h-4 w-4" />
                          <span className="font-medium">{actionInfo.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>{log.target_email}</TableCell>
                      <TableCell>{log.performed_by_email}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(log.created_at)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
