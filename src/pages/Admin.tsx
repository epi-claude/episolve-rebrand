import { useState } from "react";
import { motion } from "framer-motion";
import { 
  RefreshCw, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Database,
  Settings,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  results: Array<{ email: string; action: string; contactId: string }>;
  errors: Array<{ email: string; error: string }>;
}

export default function Admin() {
  const [isLoading, setIsLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [sinceDate, setSinceDate] = useState("");
  const [contactIds, setContactIds] = useState("");

  const runSync = async (options: { syncAll?: boolean; since?: string; contactIds?: string[] }) => {
    setIsLoading(true);
    setSyncResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("admin-sync-contacts", {
        body: options,
      });

      if (error) throw error;

      setSyncResult(data);
      
      if (data.synced > 0) {
        toast.success(`Successfully synced ${data.synced} contact(s) to GHL`);
      } else {
        toast.info("No contacts found to sync");
      }
      
      if (data.failed > 0) {
        toast.error(`Failed to sync ${data.failed} contact(s)`);
      }
    } catch (error: any) {
      console.error("Sync error:", error);
      toast.error(error.message || "Sync failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    runSync({ since: today.toISOString() });
  };

  const handleSyncSince = () => {
    if (!sinceDate) {
      toast.error("Please select a date");
      return;
    }
    runSync({ since: new Date(sinceDate).toISOString() });
  };

  const handleSyncSpecific = () => {
    if (!contactIds.trim()) {
      toast.error("Please enter contact IDs");
      return;
    }
    const ids = contactIds.split(",").map(id => id.trim()).filter(Boolean);
    runSync({ contactIds: ids });
  };

  const handleSyncAll = () => {
    if (confirm("Are you sure you want to sync ALL contacts? This may take a while.")) {
      runSync({ syncAll: true });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage and run one-off tasks</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <Tabs defaultValue="ghl-sync" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="ghl-sync" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              GHL Sync
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </TabsTrigger>
          </TabsList>

          {/* GHL Sync Tab */}
          <TabsContent value="ghl-sync" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Run common sync operations with one click
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleSyncToday}
                    disabled={isLoading}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {isLoading ? "Syncing..." : "Sync Today's Contacts"}
                  </Button>
                  
                  <Button
                    onClick={handleSyncAll}
                    disabled={isLoading}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    Sync All Contacts
                  </Button>
                </CardContent>
              </Card>

              {/* Custom Sync */}
              <Card>
                <CardHeader>
                  <CardTitle>Custom Sync</CardTitle>
                  <CardDescription>
                    Sync contacts with custom filters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="since-date">Sync Since Date</Label>
                    <div className="flex gap-2">
                      <Input
                        id="since-date"
                        type="date"
                        value={sinceDate}
                        onChange={(e) => setSinceDate(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSyncSince}
                        disabled={isLoading || !sinceDate}
                        size="icon"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-ids">Sync Specific IDs</Label>
                    <div className="flex gap-2">
                      <Input
                        id="contact-ids"
                        placeholder="id1, id2, id3..."
                        value={contactIds}
                        onChange={(e) => setContactIds(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSyncSpecific}
                        disabled={isLoading || !contactIds.trim()}
                        size="icon"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Comma-separated contact IDs from the database
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            {syncResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {syncResult.failed === 0 ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      Sync Results
                    </CardTitle>
                    <CardDescription>
                      {syncResult.synced} synced, {syncResult.failed} failed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {syncResult.results.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <h4 className="text-sm font-medium text-green-600">Successful:</h4>
                        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 space-y-1">
                          {syncResult.results.map((r, i) => (
                            <div key={i} className="text-sm flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-foreground">{r.email}</span>
                              <span className="text-muted-foreground">({r.action})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {syncResult.errors.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-red-600">Failed:</h4>
                        <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 space-y-1">
                          {syncResult.errors.map((e, i) => (
                            <div key={i} className="text-sm">
                              <span className="text-foreground">{e.email}:</span>
                              <span className="text-red-500 ml-1">{e.error}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* Database Tab - Placeholder for future */}
          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>Database Tools</CardTitle>
                <CardDescription>
                  Database management tools coming soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Future database operations like data exports, cleanup tasks, and more will be available here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
