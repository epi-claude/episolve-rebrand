import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, User, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { DiameticaSubmissionsTable } from "@/components/diametica/DiameticaSubmissionsTable";
import { DiameticaUserManagement } from "@/components/diametica/DiameticaUserManagement";

export default function DiameticaAdmin() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/diametica");
  };

  return (
    <div className="min-h-screen bg-[#edf2f7]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              GROUP TO GO{" "}
              <span className="text-[#e97316]">INC.</span>
              <span className="text-base font-normal text-gray-400 ml-3">Admin</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto py-8 px-6">
        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="submissions" className="gap-2">
              <FileText className="h-4 w-4" /> Submissions
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-1">Form Submissions</h2>
              <p className="text-sm text-gray-500 mb-6">View flight authorizations, credit card authorizations, and travel profiles.</p>
              <DiameticaSubmissionsTable />
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <DiameticaUserManagement />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Group To Go Inc. All rights reserved.
      </footer>
    </div>
  );
}
